"Use client"; // Ensure client-side rendering for hooks

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RecipeDetails({ params }) {
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { id } = params;

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        setRecipe(response.data.meals[0]);
        setLoading(false);

        // Check if the recipe is already in favorites
        const favoritesResponse = await axios.get("/api/favorites");
        const favorites = favoritesResponse.data;
        const isFav = favorites.some((fav) => fav.recipeId === id);
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const handleFavoriteClick = async () => {
    if (isFavorite) {
      // Remove from favorites
      await axios.delete(`/api/favorites/${id}`);
      setIsFavorite(false);
    } else {
      // Add to favorites
      await axios.post("/api/favorites", {
        recipeId: recipe.idMeal,
        recipeName: recipe.strMeal,
        imageUrl: recipe.strMealThumb,
      });
      setIsFavorite(true);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="text-blue-500 mb-4"
      >
        Back to Recipes
      </button>
      <div className="max-w-xl mx-auto">
        {/* Recipe Image */}
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-96 object-cover rounded-lg mb-4"
        />
        {/* Recipe Name */}
        <h2 className="text-3xl font-semibold mb-2">{recipe.strMeal}</h2>

        {/* Recipe Description */}
        <p className="text-lg text-gray-700 mb-4">
          {recipe.strInstructions?.length > 150
            ? `${recipe.strInstructions?.slice(0, 150)}...`
            : recipe.strInstructions}
        </p>

        {/* Ingredients */}
        <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
        <ul className="list-disc pl-6 mb-4">
          {Array.from({ length: 20 }, (_, index) => {
            if (recipe[`strIngredient${index + 1}`]) {
              return (
                <li key={index}>
                  {recipe[`strIngredient${index + 1}`]} -{" "}
                  {recipe[`strMeasure${index + 1}`]}
                </li>
              );
            }
          })}
        </ul>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`${
            isFavorite ? "bg-red-500" : "bg-blue-500"
          } text-white py-2 px-6 rounded-full mb-4`}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
      </div>
    </div>
  );
}
