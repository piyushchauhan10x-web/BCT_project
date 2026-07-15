"use client";
import { useState, useEffect } from "react";
import { saveFavorite, getSessionId } from "@/lib/api";

function filterWater(items) {
  return items.filter(function (item) {
    return !item.toLowerCase().includes("water");
  });
}

export default function RecipeModal({ recipe, onClose }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleSave() {
    try {
      await saveFavorite(recipe, getSessionId());
      setSaved(true);
    } catch (err) {
      alert("Could not save this recipe. Try again.");
    }
  }

  const shoppingItems = filterWater(recipe.ingredients_missing);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose} className="absolute -top-2 right-0 w-8 h-8 rounded-full border border-border bg-surface flex items-center justify-center text-text-soft hover:text-lime hover:border-lime transition-colors z-10" aria-label="Close">
          x
        </button>

        <div className="text-center mb-6 px-4">
          <p className="eyebrow mb-1">Recipe</p>
          <h2 className="font-display text-2xl font-semibold text-text">{recipe.title}</h2>
          {recipe.hindi_name ? (
            <p className="text-sm text-violet-light mt-0.5">{recipe.hindi_name}</p>
          ) : null}
          <p className="text-sm text-text-soft mt-1">
            {recipe.cook_time_mins} mins - {recipe.servings} servings
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-4 gap-2 text-center text-xs bg-white/5 border border-border rounded-lg p-3 mb-6">
              <div>
                <b className="text-text text-sm">{recipe.nutrition_estimate.calories}</b>
                <br />
                <span className="text-text-soft">kcal</span>
              </div>
              <div>
                <b className="text-text text-sm">{recipe.nutrition_estimate.protein_g}g</b>
                <br />
                <span className="text-text-soft">protein</span>
              </div>
              <div>
                <b className="text-text text-sm">{recipe.nutrition_estimate.carbs_g}g</b>
                <br />
                <span className="text-text-soft">carbs</span>
              </div>
              <div>
                <b className="text-text text-sm">{recipe.nutrition_estimate.fat_g}g</b>
                <br />
                <span className="text-text-soft">fat</span>
              </div>
            </div>

            <p className="font-medium text-text mb-2">Steps</p>
            <ol className="list-decimal list-inside text-sm space-y-2 text-text-soft">
              {recipe.steps.map(function (step, i) {
                return <li key={i}>{step}</li>;
              })}
            </ol>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="font-medium text-text mb-3">Shopping list</p>
            {shoppingItems.length > 0 ? (
              <ul className="space-y-2">
                {shoppingItems.map(function (item) {
                  return (
                    <li key={item} className="dot-need text-sm text-text-soft capitalize">
                      {item}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-text-soft italic">You already have everything.</p>
            )}
          </div>

        </div>

        <button
          onClick={handleSave}
          disabled={saved}
          className={
            saved
              ? "w-full text-sm py-2.5 rounded-lg border font-medium transition-colors mt-5 bg-lime/15 border-lime/30 text-lime"
              : "w-full text-sm py-2.5 rounded-lg border font-medium transition-colors mt-5 border-border text-text-soft hover:border-violet-light hover:text-violet-light glass"
          }
        >
          {saved ? "Saved" : "Save recipe"}
        </button>

      </div>
    </div>
  );
}