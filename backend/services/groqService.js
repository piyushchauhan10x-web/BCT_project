const Groq = require("groq-sdk");
const { RecipeResponseSchema } = require("../schemas/recipeSchema");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const STAPLE_ITEMS = [
  "salt", "water", "mustard oil", "oil", "turmeric",
  "coriander powder", "chilli powder", "chili powder",
  "red chilli powder", "haldi", "dhaniya powder", "mirch powder",
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

// ALWAYS force servings, no matter what model returned. No division, no trust.
function enforceServings(recipes, requestedServings) {
  return recipes.map((r) => {
    const modelServings = r.servings && r.servings > 0 ? r.servings : 1;
    const ratio = requestedServings / modelServings;

    return {
      ...r,
      servings: requestedServings, // hard overwrite, always
      nutrition_estimate: {
        calories: Math.max(1, Math.round(r.nutrition_estimate.calories * ratio)),
        protein_g: Math.max(0, Math.round(r.nutrition_estimate.protein_g * ratio)),
        carbs_g: Math.max(0, Math.round(r.nutrition_estimate.carbs_g * ratio)),
        fat_g: Math.max(0, Math.round(r.nutrition_estimate.fat_g * ratio)),
      },
    };
  });
}

const SYSTEM_PROMPT = `You are a recipe generation engine specializing in Indian home cooking. Given a list of ingredients a user has, a dietary restriction, and desired servings, generate exactly 3 distinct recipe options.

Cuisine preference:
- Strongly prefer major, well-known Indian recipes whenever the ingredients reasonably allow it.
- Only suggest non-Indian dishes if the ingredients genuinely don't fit any common Indian preparation.

Servings:
- The user specifies an exact number of servings. Set "servings" in your output to EXACTLY that number.
- Scale all ingredient quantities and nutrition_estimate proportionally to match that exact servings count.

Assume these staples are always available and NEVER list them in "ingredients_missing": salt, water, mustard oil / cooking oil, turmeric, coriander powder, chilli/chili powder.

Rules:
- "ingredients_have" and "ingredients_missing" are lists of {"name": string, "quantity": string}.
- Only put an ingredient in "ingredients_missing" if genuinely absent AND not a staple.
- Respect dietary restriction strictly.
- Steps as plain numbered strings.
- "hindi_name": ALWAYS provide, in Devanagari script.
- Respond with ONLY valid JSON, no markdown, no commentary.

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
  const servingsCount = servings && Number(servings) > 0 ? Number(servings) : 2;

  const userPrompt = `Ingredients available: ${ingredients.join(", ")}
Dietary restriction: ${restriction || "none"}
Exact servings required: ${servingsCount}

Generate 3 recipe options. "servings" MUST equal ${servingsCount} exactly in every recipe object. Prefer major Indian dishes. hindi_name mandatory for all 3.`;

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
    validated.recipes = enforceServings(validated.recipes, servingsCount);
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