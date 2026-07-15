"use client";
import { useState } from "react";
import RecipeModal from "./RecipeModal";

const filterWater = (items) =>
  items.filter((item) => !item.toLowerCase().includes("water"));

export default function RecipeCard({ recipe, index }) {
  const [showModal, setShowModal] = useState(false);
  const missing = filterWater(recipe.ingredients_missing);

  return (
    <>
      <div className="glass relative flex flex-col gap-3 rounded-2xl p-6 pt-5 transition-all">
        <div className="corner-arrow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {typeof index === "number" && (
          <p className="eyebrow">Option {String(index + 1).padStart(2, "0")}</p>
        )}
        <div>
          <h3 className="font-display text-xl font-semibold text-text leading-snug pr-8">
            {recipe.title}
          </h3>
          {recipe.hindi_name && (
            <p className="text-sm text-violet-light mt-0.5">{recipe.hindi_name}</p>
          )}
        </div>

        <div className="text-sm text-text-soft">
          {recipe.cook_time_mins} mins · {recipe.servings} servings
        </div>

        <div className="text-sm">
          <p className="font-medium text-text mb-1">Have</p>
          <p className="text-text-soft leading-relaxed">
            {recipe.ingredients_have.map((item) => (
              <span key={item} className="dot-have inline-flex items-center mr-3">{item}</span>
            ))}
          </p>
        </div>

        {missing.length > 0 && (
          <div className="text-sm">
            <p className="font-medium text-text mb-1">Need</p>
            <p className="text-text-soft leading-relaxed">
              {missing.map((item) => (
                <span key={item} className="dot-need inline-flex items-center mr-3">{item}</span>
              ))}
            </p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 text-center text-xs bg-white/5 border border-border rounded-lg p-3 mt-1">
          <div><b className="text-text text-sm">{recipe.nutrition_estimate.calories}</b><br /><span className="text-text-soft">kcal</span></div>
          <div><b className="text-text text-sm">{recipe.nutrition_estimate.protein_g}g</b><br /><span className="text-text-soft">protein</span></div>
          <div><b className="text-text text-sm">{recipe.nutrition_estimate.carbs_g}g</b><br /><span className="text-text-soft">carbs</span></div>
          <div><b className="text-text text-sm">{recipe.nutrition_estimate.fat_g}g</b><br /><span className="text-text-soft">fat</span></div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="text-sm bg-violet/15 hover:bg-violet/25 border border-violet/30 text-violet-light px-3 py-2.5 rounded-lg font-medium transition-colors mt-1"
        >
          View Recipe
        </button>
      </div>

      {showModal && (
        <RecipeModal recipe={recipe} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}