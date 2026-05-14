import { supabase } from "./supabaseClient";
import { Outfit } from "./outfitService";

export async function getRecommendations(userId: string): Promise<Outfit[]> {
  // Fetch user's outfits
  const { data: userOutfits } = await supabase
    .from("outfits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!userOutfits || userOutfits.length === 0) return [];

  // Fetch favorited outfit ids
  const { data: favData } = await supabase
    .from("favorites")
    .select("outfit_id")
    .eq("user_id", userId);
  const favIds = new Set((favData || []).map((f: any) => f.outfit_id));

  // Fetch recently used calendar outfits (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { data: calData } = await supabase
    .from("calendar_outfits")
    .select("outfit_id")
    .eq("user_id", userId)
    .gte("date", sevenDaysAgo.toISOString().split("T")[0]);
  const recentIds = new Set((calData || []).map((c: any) => c.outfit_id));

  // Score outfits
  const scored = userOutfits.map((outfit: Outfit) => {
    let score = 0;
    if (favIds.has(outfit.id)) score += 10;
    if (recentIds.has(outfit.id)) score -= 5; // avoid recent repeats
    // Prefer diverse styles
    score += Math.random() * 3;
    return { outfit, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.outfit);
}

export async function getTrendingStyles(userId: string): Promise<{ style: string; count: number }[]> {
  const { data } = await supabase
    .from("outfits")
    .select("style")
    .eq("user_id", userId);

  if (!data) return [];

  const counts: Record<string, number> = {};
  data.forEach((o: any) => {
    if (o.style) counts[o.style] = (counts[o.style] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([style, count]) => ({ style, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}
