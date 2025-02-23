import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiTag, FiHeart, FiShare2, FiTrash2 } from 'react-icons/fi';
import { snippetService, type Snippet } from '../services/snippetService';
import { useAuth } from '../contexts/AuthContext';
import { CodePreview } from '../components';
import { toast } from 'react-hot-toast';

export default function SnippetView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadSnippet();
  }, [id]);

  useEffect(() => {
    if (!id || !user) return;
    checkFavoriteStatus();
  }, [id, user]);

  const loadSnippet = async () => {
    try {
      setLoading(true);
      if (!id) return;
      const loadedSnippet = await snippetService.getSnippetById(id);
      if (!loadedSnippet) {
        toast.error('Snippet not found');
        navigate('/');
        return;
      }
      setSnippet(loadedSnippet);
    } catch (error) {
      console.error('Error loading snippet:', error);
      toast.error('Failed to load snippet');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!id || !user) return;
    const status = await snippetService.isFavorite(id);
    setIsFavorite(status);
  };

  const handleToggleFavorite = async () => {
    if (!id || !user) {
      toast.error('Please sign in to favorite snippets');
      return;
    }
    try {
      const newStatus = await snippetService.toggleFavorite(id);
      setIsFavorite(newStatus);
      toast.success(newStatus ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    }
  };

  const handleShare = async () => {
    if (!snippet) return;
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch (error) {
      console.error('Error sharing snippet:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleDelete = async () => {
    if (!snippet || !user) return;
    if (!window.confirm('Are you sure you want to delete this snippet?')) return;

    try {
      await snippetService.deleteSnippet(snippet.id);
      toast.success('Snippet deleted');
      navigate('/');
    } catch (error) {
      console.error('Error deleting snippet:', error);
      toast.error('Failed to delete snippet');
    }
  };

  const handleSaveCode = async (newCode: string) => {
    if (!snippet) return;
    
    try {
      // For both local and authenticated users
      await snippetService.updateSnippet({
        ...snippet,
        code: newCode
      });
      toast.success('Snippet saved successfully');
      
      // Update local snippet state
      setSnippet(prev => prev ? { ...prev, code: newCode } : null);
    } catch (error) {
      console.error('Error saving snippet:', error);
      toast.error('Failed to save snippet');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!snippet) {
    return null;
  }

  // Allow editing for local snippets by anyone, but database snippets only by their owners
  const isOwner = snippet.id.startsWith('local_') || (user && user.uid === snippet.userId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-dark-800 rounded-lg border border-dark-700 shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-dark-100 mb-2">
                {snippet.title}
              </h1>
              <p className="text-dark-400 mb-4">
                {snippet.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-dark-400">
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  {snippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full bg-primary-900/20 text-primary-400"
                    >
                      <FiTag className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user && (
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-lg transition-smooth ${
                    isFavorite
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-400/10'
                      : 'text-dark-400 hover:text-dark-100 hover:bg-dark-700/50'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <FiHeart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              )}
              <button
                onClick={handleShare}
                className="p-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-700/50 transition-smooth"
                title="Share snippet"
              >
                <FiShare2 className="h-5 w-5" />
              </button>
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-smooth"
                  title="Delete snippet"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <CodePreview
              initialCode={snippet.code}
              language={snippet.language}
              onSave={isOwner ? handleSaveCode : undefined}
              readOnly={!isOwner}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
} 