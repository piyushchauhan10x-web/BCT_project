"use client";
import { useState } from "react";

const RESTRICTIONS = ["none", "vegan", "vegetarian", "gluten-free", "keto", "dairy-free"];

export default function IngredientForm({ onSubmit, loading }) {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [restriction, setRestriction] = useState("none");
  const [servings, setServings] = useState(2);

  const addIngredient = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      const parts = input
        .split(",")
        .map((p) => p.trim().toLowerCase())
        .filter((p) => p.length > 0);

      const newOnes = parts.filter((p) => !ingredients.includes(p));
      if (newOnes.length > 0) {
        setIngredients([...ingredients, ...newOnes]);
      }
      setInput("");
    }
  };

  const removeIngredient = (item) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const handleSubmit = () => {
    if (ingredients.length === 0) return;
    onSubmit(ingredients, restriction, servings);
  };

  return (
    <div className="glass relative max-w-xl mx-auto p-7 rounded-2xl">
      <p className="eyebrow mb-1">Your pantry</p>
      <h2 className="font-display text-2xl font-semibold text-text mb-4">
        What's in your kitchen?
      </h2>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addIngredient}
        placeholder="Type ingredients separated by commas, press Enter"
        className="w-full border border-border rounded-lg px-3 py-2.5 mb-3 bg-white/5 text-text placeholder:text-text-soft/60 focus:outline-none focus:ring-2 focus:ring-violet/50"
      />

      <div className="flex flex-wrap gap-2 mb-5 min-h-[2rem]">
        {ingredients.length === 0 && (
          <span className="text-sm text-text-soft/60 italic">Nothing added yet.</span>
        )}
        {ingredients.map((item) => (
          <span
            key={item}
            className="bg-violet/15 text-violet-light px-3 py-1 rounded-full text-sm flex items-center gap-2 font-medium border border-violet/20"
          >
            {item}
            <button
              onClick={() => removeIngredient(item)}
              className="text-violet-light/70 hover:text-lime transition-colors font-bold leading-none"
              aria-label={`Remove ${item}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <label className="block text-sm font-medium text-text mb-2">Servings</label>
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => setServings((s) => Math.max(1, s - 1))}
          className="w-9 h-9 rounded-lg border border-border text-text hover:border-violet-light hover:text-violet-light transition-colors"
        >
          −
        </button>
        <span className="text-text font-semibold text-lg w-8 text-center">{servings}</span>
        <button
          type="button"
          onClick={() => setServings((s) => Math.min(12, s + 1))}
          className="w-9 h-9 rounded-lg border border-border text-text hover:border-violet-light hover:text-violet-light transition-colors"
        >
          +
        </button>
      </div>

      <label className="block text-sm font-medium text-text mb-2">Dietary restriction</label>
      <select
        value={restriction}
        onChange={(e) => setRestriction(e.target.value)}
        className="w-full border border-border rounded-lg px-3 py-2.5 mb-5 bg-white/5 text-text focus:outline-none focus:ring-2 focus:ring-violet/50"
      >
        {RESTRICTIONS.map((r) => (
          <option key={r} value={r} className="bg-surface">{r}</option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading || ingredients.length === 0}
        className="w-full bg-violet hover:bg-violet-light hover:text-bg text-white py-3 rounded-lg font-semibold tracking-wide transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {loading ? "Cooking up ideas..." : "Generate Recipes →"}
      </button>
    </div>
  );
}