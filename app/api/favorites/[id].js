import connectToDatabase from '../../../lib/mongodb';
import Favorite from '../../../models/Favorite';

export default async function handler(req, res) {
  const { id } = req.query;

  await connectToDatabase();

  if (req.method === 'DELETE') {
    try {
      await Favorite.findByIdAndDelete(id);
      res.status(200).json({ message: 'Favorite deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete favorite' });
    }
  }
}
