"use client";
import { useState } from "react";

const RESTRICTIONS = ["none", "vegan", "vegetarian", "gluten-free", "keto", "dairy-free"];

export default function IngredientForm({ onSubmit, loading }) {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [restriction, setRestriction] = useState("none");
  const [servings, setServings] = useState(2);

  const commitInput = () => {
    if (!input.trim()) return;
    const parts = input
      .split(",")
      .map((p) => p.trim().toLowerCase())
      .filter((p) => p.length > 0);

    const newOnes = parts.filter((p) => !ingredients.includes(p));
    if (newOnes.length > 0) {
      setIngredients([...ingredients, ...newOnes]);
    }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitInput();
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

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type ingredients separated by commas"
          className="flex-1 min-w-0 border border-border rounded-lg px-3 py-2.5 bg-white/5 text-text placeholder:text-text-soft/60 focus:outline-none focus:ring-2 focus:ring-violet/50"
        />
        <button
          type="button"
          onClick={commitInput}
          disabled={!input.trim()}
          className="shrink-0 w-11 rounded-lg bg-violet/20 border border-violet/30 text-violet-light text-xl font-semibold hover:bg-violet/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Add ingredient"
        >
          +
        </button>
      </div>

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