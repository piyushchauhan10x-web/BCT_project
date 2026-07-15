"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RecipeList from "@/components/RecipeList";

export default function ResultsPage() {
  const [recipes, setRecipes] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("mealplanner_recipes");
    if (!stored) {
      router.push("/");
      return;
    }
    setRecipes(JSON.parse(stored));
  }, [router]);

  if (!recipes) {
    return (
      <main className="relative py-16 min-h-screen flex items-center justify-center">
        <p className="text-text-soft">Loading your recipes...</p>
      </main>
    );
  }

  return (
    <main className="relative py-16 min-h-screen">
      <div className="glow-orb w-[500px] h-[500px] bg-violet/30 -top-40 left-1/2 -translate-x-1/2" />
      <div className="bg-grid absolute inset-x-0 top-0 h-[500px] -z-0" />

      <div className="relative text-center mb-10 px-4">
        <p className="eyebrow mb-3">Your recipes</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-text">
          Here's what you can cook
        </h1>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-sm text-violet-light hover:text-lime transition-colors font-medium"
        >
          ← Start over with new ingredients
        </button>
      </div>

      <div className="relative">
        <RecipeList recipes={recipes} />
      </div>
    </main>
  );
}