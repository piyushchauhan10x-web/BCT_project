const Groq = require("groq-sdk");
const { RecipeResponseSchema } = require("../schemas/recipeSchema");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const STAPLE_ITEMS = [
  "salt",
  "water",
  "mustard oil",
  "oil",
  "turmeric",
  "coriander powder",
  "chilli powder",
  "chili powder",
  "red chilli powder",
  "haldi",
  "dhaniya powder",
  "mirch powder",
];

function isStaple(name) {
  const n = name.toLowerCase();
  return STAPLE_ITEMS.some((s) => n.includes(s));
}

function stripStaplesFromMissing(recipes) {
  return recipes.map((r) => ({
    ...r,
    ingredients_missing: r.ingredients_missing.filter((item) => !isStaple(item.name)),
  }));
}

const SYSTEM_PROMPT = `You are a recipe generation engine. Given a list of ingredients a user has, a dietary restriction, and desired servings, generate exactly 3 distinct recipe options.

Assume these staple items are ALWAYS available in the user's home and NEVER list them in "ingredients_missing": salt, water, mustard oil / cooking oil, turmeric, coriander powder, chilli/chili powder. You may still mention them in steps and in ingredients_have with quantity if the recipe uses them.

Rules:
- Scale ALL ingredient quantities and nutrition_estimate to the user's requested servings.
- "ingredients_have" and "ingredients_missing" must each be a list of objects: {"name": string, "quantity": string}. quantity should be a practical cooking measurement (e.g. "2 medium", "1 tsp", "200 g", "1 cup").
- Only put an ingredient in "ingredients_missing" if it is genuinely NOT in the user's provided list AND is not one of the staple items above.
- Respect the dietary restriction strictly (e.g. if "vegan", no animal products anywhere, including in missing ingredients).
- nutrition_estimate is a reasonable estimate for the full recipe at the requested servings, not a lookup - just estimate sensibly.
- Steps should be clear, numbered instructions (as plain strings, no numbering prefix needed).
- "hindi_name": ALWAYS provide this field for every single recipe, no exceptions, in Devanagari script. Translate/transliterate if the dish isn't Indian.
- Respond with ONLY valid JSON. No markdown, no code fences, no commentary before or after.

Required JSON shape:
{
  "recipes": [
    {
      "title": "string",
      "hindi_name": "string",
      "cook_time_mins": number,
      "servings": number,
      "ingredients_have": [{"name": "string", "quantity": "string"}],
      "ingredients_missing": [{"name": "string", "quantity": "string"}],
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

async function generateRecipes(ingredients, restriction, servings) {
  const servingsCount = servings && servings > 0 ? servings : 2;

  const userPrompt = `Ingredients available: ${ingredients.join(", ")}
Dietary restriction: ${restriction || "none"}
Desired servings: ${servingsCount}

Generate 3 recipe options following the rules exactly. Scale quantities and nutrition to ${servingsCount} servings. hindi_name is mandatory for all 3.`;

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
    const validated = RecipeResponseSchema.parse(parsed);
    validated.recipes = stripStaplesFromMissing(validated.recipes);
    return validated;
  };

  try {
    return await attemptCall();
  } catch (err) {
    console.warn("First attempt failed, retrying once:", err.message);
    return await attemptCall();
  }
}

module.exports = { generateRecipes };