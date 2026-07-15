const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateRecipes(ingredients, restriction, servings) {
  const res = await fetch(`${API_URL}/api/generate-recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients, restriction, servings: Number(servings) }),
  });
  if (!res.ok) throw new Error("Failed to generate recipes");
  return res.json();
}

export async function saveFavorite(recipe, sessionId) {
  const res = await fetch(`${API_URL}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...recipe, sessionId }),
  });
  if (!res.ok) throw new Error("Failed to save favorite");
  return res.json();
}

export async function getFavorites(sessionId) {
  const res = await fetch(`${API_URL}/api/favorites?sessionId=${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json();
}

export async function deleteFavorite(id) {
  const res = await fetch(`${API_URL}/api/favorites/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete favorite");
}

export function getSessionId() {
  let id = localStorage.getItem("mealplanner_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("mealplanner_session", id);
  }
  return id;
}