import { supabase } from "./supabaseClient";
import * as FileSystem from "expo-file-system";

export type Outfit = {
  id: string;
  user_id: string;
  image_url: string;
  type: string;
  color: string;
  style: string;
  tags: string[];
  created_at: string;
};

export type OutfitProduct = {
  id: string;
  outfit_id: string;
  product_name: string;
  brand: string;
  image_url: string;
  price: number;
  platform: string;
  product_url: string;
};

export async function uploadOutfitImage(userId: string, imageUri: string): Promise<string> {
  const filename = `${userId}/${Date.now()}.jpg`;

  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const { data, error } = await supabase.storage
    .from("outfits")
    .upload(filename, byteArray, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("outfits")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function analyzeOutfit(imageUrl: string) {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

  const response = await fetch(`${supabaseUrl}/functions/v1/analyze-outfit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseAnonKey}`,
      Apikey: supabaseAnonKey,
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI analysis failed: ${err}`);
  }

  return response.json();
}

export async function saveOutfit(
  userId: string,
  imageUrl: string,
  metadata: { type: string; color: string; style: string; tags: string[] }
): Promise<Outfit> {
  const { data, error } = await supabase
    .from("outfits")
    .insert({
      user_id: userId,
      image_url: imageUrl,
      type: metadata.type,
      color: metadata.color,
      style: metadata.style,
      tags: metadata.tags,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as Outfit;
}

export async function getUserOutfits(userId: string): Promise<Outfit[]> {
  const { data, error } = await supabase
    .from("outfits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Outfit[]) || [];
}

export async function searchOutfits(
  userId: string,
  query: string,
  filters: { type?: string; color?: string; style?: string }
): Promise<Outfit[]> {
  let q = supabase
    .from("outfits")
    .select("*")
    .eq("user_id", userId);

  if (filters.type) q = q.ilike("type", `%${filters.type}%`);
  if (filters.color) q = q.ilike("color", `%${filters.color}%`);
  if (filters.style) q = q.ilike("style", `%${filters.style}%`);

  if (query) {
    q = q.or(
      `type.ilike.%${query}%,color.ilike.%${query}%,style.ilike.%${query}%`
    );
  }

  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Outfit[]) || [];
}

export async function deleteOutfit(outfitId: string) {
  const { error } = await supabase.from("outfits").delete().eq("id", outfitId);
  if (error) throw error;
}

// Favorites
export async function toggleFavorite(userId: string, outfitId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("outfit_id", outfitId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("outfit_id", outfitId);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, outfit_id: outfitId });
    if (error) throw error;
    return true;
  }
}

export async function getUserFavorites(userId: string): Promise<Outfit[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select("outfit_id, outfits(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data || []).map((f: any) => f.outfits).filter(Boolean)) as Outfit[];
}

export async function isFavorited(userId: string, outfitId: string): Promise<boolean> {
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("outfit_id", outfitId)
    .maybeSingle();
  return !!data;
}

// Calendar
export async function setCalendarOutfit(userId: string, outfitId: string, date: string) {
  const { error } = await supabase
    .from("calendar_outfits")
    .upsert({ user_id: userId, outfit_id: outfitId, date }, { onConflict: "user_id,date" });
  if (error) throw error;
}

export async function getMonthCalendar(userId: string, year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = `${year}-${String(month).padStart(2, "0")}-31`;

  const { data, error } = await supabase
    .from("calendar_outfits")
    .select("date, outfit_id, outfits(id, image_url, type, color, style)")
    .eq("user_id", userId)
    .gte("date", start)
    .lte("date", end);

  if (error) throw error;
  return data || [];
}

export async function removeCalendarOutfit(userId: string, date: string) {
  const { error } = await supabase
    .from("calendar_outfits")
    .delete()
    .eq("user_id", userId)
    .eq("date", date);
  if (error) throw error;
}

// Products
export async function getOutfitProducts(outfitId: string): Promise<OutfitProduct[]> {
  const { data, error } = await supabase
    .from("outfit_products")
    .select("*")
    .eq("outfit_id", outfitId)
    .order("price", { ascending: true });

  if (error) throw error;
  return (data as OutfitProduct[]) || [];
}

export async function saveOutfitProducts(outfitId: string, products: Omit<OutfitProduct, "id" | "outfit_id">[]) {
  const rows = products.map((p) => ({ ...p, outfit_id: outfitId }));
  const { error } = await supabase.from("outfit_products").insert(rows);
  if (error) throw error;
}
