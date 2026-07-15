export default function ShoppingList({ recipes }) {
  if (!recipes || recipes.length === 0) return null;

  const missing = [...new Set(recipes.flatMap((r) => r.ingredients_missing))];
  if (missing.length === 0) return null;

  return (
    <div className="glass max-w-xl mx-auto mt-8 rounded-2xl p-5">
      <p className="eyebrow mb-1">Shopping list</p>
      <h4 className="font-display text-lg font-semibold text-text mb-3">Still need to grab</h4>
      <ul className="space-y-1.5">
        {missing.map((item) => (
          <li key={item} className="dot-need text-sm text-text-soft capitalize">{item}</li>
        ))}
      </ul>
    </div>
  );
}