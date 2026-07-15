"use client";
import { useEffect, useState } from "react";
import { getFavorites, deleteFavorite, getSessionId } from "@/lib/api";
import RecipeCard from "@/components/RecipeCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getFavorites(getSessionId()).then(setFavorites).catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    await deleteFavorite(id);
    setFavorites(favorites.filter((f) => f.id !== id));
  };

  return (
    <main className="relative py-16 px-4">
      <div className="glow-orb w-[400px] h-[400px] bg-violet/25 -top-32 left-1/2 -translate-x-1/2" />
      <div className="bg-grid absolute inset-x-0 top-0 h-[500px] -z-0" />

      <div className="relative text-center mb-12">
        <p className="eyebrow mb-3">Saved</p>
        <h1 className="font-display text-4xl font-semibold text-text">Your recipe box</h1>
      </div>

      {favorites.length === 0 ? (
        <p className="relative text-center text-text-soft">
          Nothing saved yet — generate some recipes and hit Save on the ones you like.
        </p>
      ) : (
        <div className="relative grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {favorites.map((f) => (
            <div key={f.id} className="relative">
              <RecipeCard recipe={f} />
              <button
                onClick={() => handleDelete(f.id)}
                className="absolute -top-2 -right-2 text-xs bg-surface border border-border text-violet-light hover:text-lime rounded-full px-2 py-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}