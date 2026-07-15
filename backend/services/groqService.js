const Groq = require("groq-sdk");
const { RecipeResponseSchema } = require("../schemas/recipeSchema");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a recipe generation engine. Given a list of ingredients a user has and a dietary restriction, generate exactly 3 distinct recipe options.

Rules:
- Only use "ingredients_missing" for items genuinely NOT in the user's provided list.
- Respect the dietary restriction strictly (e.g. if "vegan", no animal products anywhere, including in missing ingredients).
- nutrition_estimate is a reasonable per-serving estimate, not a lookup - just estimate sensibly.
- Steps should be clear, numbered instructions (as plain strings, no numbering prefix needed).
- "hindi_name": ALWAYS provide this field for every single recipe, no exceptions. If the dish is Indian, give its authentic Hindi name in Devanagari script. If the dish is NOT Indian, translate or transliterate the dish title into natural Hindi in Devanagari script anyway. Never return null, never leave this field empty.
- Respond with ONLY valid JSON. No markdown, no code fences, no commentary before or after.

Required JSON shape:
{
  "recipes": [
    {
      "title": "string",
      "hindi_name": "string (never null, always in Devanagari script)",
      "cook_time_mins": number,
      "servings": number,
      "ingredients_have": ["string"],
      "ingredients_missing": ["string"],
      "steps": ["string"],
      "nutrition_estimate": {
        "calories": number,
        "protein_g": number,
        "carbs_g": number,
        "fat_g": number
      }
    }
  ]
}`;

async function generateRecipes(ingredients, restriction) {
  const userPrompt = `Ingredients available: ${ingredients.join(", ")}
Dietary restriction: ${restriction || "none"}

Generate 3 recipe options following the rules exactly. Remember: hindi_name is mandatory for all 3, even non-Indian dishes.`;

  const attemptCall = async () => {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);
    return RecipeResponseSchema.parse(parsed);
  };

  try {
    return await attemptCall();
  } catch (err) {
    console.warn("First attempt failed, retrying once:", err.message);
    return await attemptCall();
  }
}

module.exports = { generateRecipes };