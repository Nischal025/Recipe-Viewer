import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("favorite_recipes");

    if (req.method === "GET") {
      // Fetch all favorite recipes
      const favorites = await collection.find({}).toArray();
      return res.status(200).json(favorites);
    }

    if (req.method === "POST") {
      // Add a new favorite recipe
      const { recipeId, recipeName, imageUrl } = req.body;
      const newFavorite = {
        recipeId,
        recipeName,
        imageUrl,
      };

      await collection.insertOne(newFavorite);
      return res.status(201).json(newFavorite);
    }

    if (req.method === "DELETE") {
      // Delete a favorite recipe by ID
      const { id } = req.query;
      await collection.deleteOne({ recipeId: id });
      return res.status(204).end();
    }

    res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  } finally {
    await client.close();
  }
}

export default handler;
