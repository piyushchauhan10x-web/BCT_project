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

// Force servings to match user request exactly, scale nutrition if model got it wrong
function enforceServings(recipes, requestedServings) {
  return recipes.map((r) => {
    const modelServings = r.servings > 0 ? r.servings : requestedServings;
    const ratio = requestedServings / modelServings;

    return {
      ...r,
      servings: requestedServings,
      nutrition_estimate: {
        calories: Math.round(r.nutrition_estimate.calories * ratio),
        protein_g: Math.round(r.nutrition_estimate.protein_g * ratio),
        carbs_g: Math.round(r.nutrition_estimate.carbs_g * ratio),
        fat_g: Math.round(r.nutrition_estimate.fat_g * ratio),
      },
    };
  });
}

const SYSTEM_PROMPT = `You are a recipe generation engine specializing in Indian home cooking. Given a list of ingredients a user has, a dietary restriction, and desired servings, generate exactly 3 distinct recipe options.

Cuisine preference:
- Strongly prefer major, well-known Indian recipes that can be made with the given ingredients (e.g. sabzi, dal, paratha, pulao, curry, poha, chilla, sabudana khichdi, etc.) whenever the ingredients reasonably allow it.
- Only suggest non-Indian dishes if the ingredients genuinely don't fit any common Indian preparation.
- Prioritize dishes that are actually popular and commonly cooked in Indian households, not obscure or invented dishes.

Servings:
- The user will specify an exact number of servings. You MUST set "servings" in your output to EXACTLY that number, no exceptions.
- Scale all ingredient quantities and nutrition_estimate proportionally to match that exact servings count.

Assume these staple items are ALWAYS available in the user's home and NEVER list them in "ingredients_missing": salt, water, mustard oil / cooking oil, turmeric, coriander powder, chilli/chili powder. You may still mention them in steps and in ingredients_have with quantity if the recipe uses them.

Rules:
- "ingredients_have" and "ingredients_missing" must each be a list of objects: {"name": string, "quantity": string}. quantity should be a practical cooking measurement (e.g. "2 medium", "1 tsp", "200 g", "1 cup") scaled to the requested servings.
- Only put an ingredient in "ingredients_missing" if it is genuinely NOT in the user's provided list AND is not one of the staple items above.
- Respect the dietary restriction strictly (e.g. if "vegan", no animal products anywhere, including in missing ingredients).
- Steps should be clear, numbered instructions (as plain strings, no numbering prefix needed).
- "hindi_name": ALWAYS provide this field for every single recipe, no exceptions, in Devanagari script.
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
Exact servings required: ${servingsCount}

Generate 3 recipe options following the rules exactly. "servings" in every recipe object MUST equal ${servingsCount} exactly. Prefer major Indian dishes where the ingredients allow it. hindi_name is mandatory for all 3.`;

  const attemptCall = async () => {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {