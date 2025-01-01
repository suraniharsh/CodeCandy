import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiHeart } from 'react-icons/fi';
import type { Snippet } from '../services/snippetService';

const cardVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.02 }}
      className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden hover:border-dark-600 transition-colors"
    >
      <Link to={`/snippet/${snippet.id}`} className="block p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-dark-100 truncate">
            {snippet.title}
          </h3>
          {snippet.isFavorite && (
            <FiHeart className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
        </div>
        
        <p className="text-dark-300 text-sm mb-4 line-clamp-2">
          {snippet.description || 'No description provided'}
        </p>
        
        <div className="flex items-center text-dark-400 text-xs">
          <FiClock className="w-3.5 h-3.5 mr-1" />
          <span>
            {new Date(snippet.createdAt).toLocaleDateString()}
          </span>
        </div>
      </Link>
    </motion.div>
  );
} 