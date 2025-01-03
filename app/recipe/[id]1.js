"use client"; // Add this at the top of your component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import

const RecipeDetails = ({ params }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = params;
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        setRecipe(response.data.meals[0]);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
      setLoading(false);
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => router.back()} // Use router.back() to go back to the previous page
        className="text-blue-500 mb-4"
      >
        Back to Recipes
      </button>

      {recipe ? (
        <div className="flex flex-col items-center">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full max-w-md mb-4 rounded-lg"
          />
          <h1 className="text-3xl font-semibold mb-4">{recipe.strMeal}</h1>

          <div className="w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-2">Ingredients:</h2>
            <ul className="list-disc pl-6">
              {Object.keys(recipe)
                .filter((key) => key.includes("strIngredient") && recipe[key])
                .map((ingredientKey, idx) => (
                  <li key={idx}>{recipe[ingredientKey]}</li>
                ))}
            </ul>

            <h2 className="text-xl font-bold mt-4 mb-2">Instructions:</h2>
            <p>{recipe.strInstructions}</p>
          </div>
        </div>
      ) : (
        <div>No recipe found</div>
      )}
    </div>
  );
};

export default RecipeDetails;
