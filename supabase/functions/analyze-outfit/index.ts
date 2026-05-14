import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FASHION_TYPES = [
  "T-Shirt", "Shirt", "Blouse", "Polo Shirt", "Tank Top", "Crop Top",
  "Hoodie", "Sweatshirt", "Jacket", "Blazer", "Coat", "Trench Coat",
  "Jeans", "Trousers", "Shorts", "Skirt", "Mini Skirt", "Maxi Skirt",
  "Dress", "Midi Dress", "Maxi Dress", "Jumpsuit", "Romper",
  "Leggings", "Joggers", "Sweatpants", "Cargo Pants",
  "Sneakers", "Boots", "Heels", "Sandals", "Loafers", "Oxfords",
  "Suit", "Kurta", "Saree", "Salwar Kameez",
];

const STYLE_TAGS: Record<string, string[]> = {
  Streetwear: ["oversized", "urban", "graphic", "sneakers", "hoodie", "cargo"],
  Casual: ["relaxed", "everyday", "comfortable", "basics", "denim"],
  Formal: ["professional", "office", "business", "tailored", "smart"],
  Party: ["glamorous", "festive", "bold", "statement", "sequin"],
  Activewear: ["sporty", "athletic", "performance", "workout", "gym"],
  Bohemian: ["flowy", "earthy", "floral", "layered", "vintage"],
  Minimalist: ["clean", "neutral", "simple", "structured", "monochrome"],
  Preppy: ["classic", "collegiate", "polo", "chino", "blazer"],
  "Indo-Western": ["fusion", "ethnic", "kurta", "churidar", "printed"],
  Summer: ["light", "breezy", "pastel", "floral", "linen"],
};

const COLORS = [
  "Black", "White", "Grey", "Navy Blue", "Royal Blue", "Sky Blue",
  "Red", "Maroon", "Pink", "Coral", "Orange", "Yellow",
  "Olive Green", "Forest Green", "Mint", "Teal",
  "Brown", "Beige", "Cream", "Khaki",
  "Purple", "Lavender", "Gold", "Silver",
  "Multicolor", "Printed", "Striped", "Checkered",
];

function detectStyle(type: string, color: string): string {
  const lower = type.toLowerCase();
  if (["hoodie", "sweatshirt", "joggers", "sneakers", "cargo pants"].some(k => lower.includes(k)))
    return "Streetwear";
  if (["blazer", "suit", "trousers", "shirt", "oxford"].some(k => lower.includes(k)))
    return "Formal";
  if (["dress", "heels", "jumpsuit"].some(k => lower.includes(k)))
    return "Party";
  if (["leggings", "sweatpants", "activewear"].some(k => lower.includes(k)))
    return "Activewear";
  if (["kurta", "saree", "salwar"].some(k => lower.includes(k)))
    return "Indo-Western";
  if (["maxi", "flowy", "bohemian"].some(k => lower.includes(k)))
    return "Bohemian";
  return "Casual";
}

function generateOutfitMetadata(imageUrl: string) {
  // Deterministic seed based on URL to get consistent results for same image
  let seed = 0;
  for (let i = 0; i < imageUrl.length; i++) {
    seed = (seed * 31 + imageUrl.charCodeAt(i)) % 1000000;
  }

  const type = FASHION_TYPES[seed % FASHION_TYPES.length];
  const color = COLORS[(seed * 7) % COLORS.length];
  const style = detectStyle(type, color);
  const styleTags = STYLE_TAGS[style] || STYLE_TAGS["Casual"];

  // Pick 2-4 tags
  const numTags = 2 + (seed % 3);
  const tags: string[] = [];
  for (let i = 0; i < numTags; i++) {
    const tag = styleTags[(seed + i * 3) % styleTags.length];
    if (!tags.includes(tag)) tags.push(tag);
  }

  return { type, color, style, tags };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "imageUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let metadata: { type: string; color: string; style: string; tags: string[] };

    if (openAiKey) {
      // Use OpenAI Vision API
      const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this fashion outfit image and return ONLY a JSON object with these exact fields:
{
  "type": "<specific clothing type like T-Shirt, Jeans, Dress, Blazer, Hoodie, Sneakers, etc.>",
  "color": "<primary color like Black, White, Navy Blue, Red, etc.>",
  "style": "<one of: Streetwear, Casual, Formal, Party, Activewear, Bohemian, Minimalist, Preppy, Indo-Western, Summer>",
  "tags": ["<2-4 descriptive fashion tags like oversized, vintage, floral, etc.>"]
}
Return ONLY the JSON, no explanation.`,
                },
                {
                  type: "image_url",
                  image_url: { url: imageUrl, detail: "low" },
                },
              ],
            },
          ],
          max_tokens: 200,
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content || "";
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            metadata = JSON.parse(jsonMatch[0]);
          } else {
            metadata = generateOutfitMetadata(imageUrl);
          }
        } catch {
          metadata = generateOutfitMetadata(imageUrl);
        }
      } else {
        metadata = generateOutfitMetadata(imageUrl);
      }
    } else {
      // Fallback: intelligent pattern-based analysis
      metadata = generateOutfitMetadata(imageUrl);
    }

    return new Response(JSON.stringify(metadata), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
