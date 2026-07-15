const { z } = require("zod");

const IngredientItem = z.object({
  name: z.string(),
  quantity: z.string(), // e.g. "2 medium", "1 tsp", "200 g"
});

const RecipeSchema = z.object({
  title: z.string(),
  hindi_name: z.string(),
  cook_time_mins: z.number(),
  servings: z.number(),
  ingredients_have: z.array(IngredientItem),
  ingredients_missing: z.array(IngredientItem),
  steps: z.array(z.string()),
  nutrition_estimate: z.object({
    calories: z.number(),
    protein_g: z.number(),
    carbs_g: z.number(),
    fat_g: z.number(),
  }),
});

const RecipeResponseSchema = z.object({
  recipes: z.array(RecipeSchema).length(3),
});

module.exports = { RecipeResponseSchema };