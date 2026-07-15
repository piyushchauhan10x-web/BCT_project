const supabase = require("../config/db");

async function saveFavorite(req, res) {
  const { sessionId, ...recipe } = req.body;
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });

  const { data, error } = await supabase
    .from("favorites")
    .insert({
      title: recipe.title,
      cook_time_mins: recipe.cook_time_mins,
      servings: recipe.servings,
      ingredients_have: recipe.ingredients_have,
      ingredients_missing: recipe.ingredients_missing,
      steps: recipe.steps,
      nutrition_estimate: recipe.nutrition_estimate,
      session_id: sessionId,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: "Failed to save favorite" });
  res.status(201).json(data);
}

async function getFavorites(req, res) {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });

  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: "Failed to fetch favorites" });
  res.json(data);
}

async function deleteFavorite(req, res) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error: "Failed to delete favorite" });
  res.status(204).send();
}

module.exports = { saveFavorite, getFavorites, deleteFavorite };