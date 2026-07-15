const { generateRecipes } = require("../services/groqService");

async function createRecipes(req, res) {
  const { ingredients, restriction } = req.body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "ingredients array required" });
  }

  try {
    const data = await generateRecipes(ingredients, restriction);
    res.json(data);
  } catch (err) {
    console.error("Recipe generation failed:", err.message);
    res.status(502).json({ error: "Recipe generation failed. Please retry." });
  }
}

module.exports = { createRecipes };