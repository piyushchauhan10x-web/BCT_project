import RecipeCard from "./RecipeCard";

export default function RecipeList({ recipes }) {
  if (!recipes || recipes.length === 0) return null;
  return (
    <div className="grid md:grid-cols-3 gap-5 mt-8 max-w-6xl mx-auto px-4">
      {recipes.map((r, i) => <RecipeCard key={i} recipe={r} index={i} />)}
    </div>
  );
}