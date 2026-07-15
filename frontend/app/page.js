"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import IngredientForm from "@/components/IngredientForm";
import { generateRecipes } from "@/lib/api";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleGenerate = async (ingredients, restriction) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateRecipes(ingredients, restriction);
      sessionStorage.setItem("mealplanner_recipes", JSON.stringify(data.recipes));
      router.push("/results");
    } catch (err) {
      setError("Couldn't generate recipes just now. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative py-16 min-h-screen">
      <div className="glow-orb w-[500px] h-[500px] bg-violet/35 -top-40 left-1/2 -translate-x-1/2" />
      <div className="glow-orb w-[300px] h-[300px] bg-violet-light/15 top-10 right-10" />
      <div className="bg-grid absolute inset-x-0 top-0 h-[600px] -z-0" />

      <div className="relative text-center mb-12 px-4">
        <p className="eyebrow mb-3">AI Meal Planner</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-text tracking-tight">
          Turn your pantry <br className="hidden md:block" /> into dinner
        </h1>
        <p className="text-text-soft mt-3 max-w-md mx-auto">
          List what you've got. Get three recipes, a nutrition estimate, and a shopping list.
        </p>
      </div>

      <div className="relative">
        <IngredientForm onSubmit={handleGenerate} loading={loading} />
        {error && (
          <p className="text-center text-violet-light mt-4 text-sm font-medium">{error}</p>
        )}
      </div>
    </main>
  );
}