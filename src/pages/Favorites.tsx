import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { snippetService, type Snippet } from '../services/snippetService';
import { SnippetCard } from '../components';

function Favorites() {
  const [favorites, setFavorites] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoriteSnippets = await snippetService.getFavoriteSnippets();
      setFavorites(favoriteSnippets);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-dark-300">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-dark-100 mb-6"
      >
        Favorite Snippets
      </motion.h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <FiHeart className="h-12 w-12 mx-auto mb-4 text-dark-400" />
          <p className="text-dark-400">No favorite snippets yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((snippet) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SnippetCard snippet={snippet} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites; 