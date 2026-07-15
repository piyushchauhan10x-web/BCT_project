const { z } = require("zod");

const RecipeSchema = z.object({
  title: z.string(),
  hindi_name: z.string(),
  cook_time_mins: z.number(),
  servings: z.number(),
  ingredients_have: z.array(z.string()),
  ingredients_missing: z.array(z.string()),
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