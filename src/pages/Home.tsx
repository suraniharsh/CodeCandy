import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { snippetService, type Snippet } from '../services/snippetService';
import { SnippetCard } from '../components';
import { AnimatedPage, containerVariants, itemVariants } from '../components/AnimatedPage';
import { SEO } from '../components/SEO';

export function Home() {
  const [recentSnippets, setRecentSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSnippets = async () => {
      try {
        const snippets = await snippetService.getAllSnippets();
        setRecentSnippets(snippets.slice(0, 6));
      } catch (error) {
        console.error('Error loading snippets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSnippets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-dark-300">Loading snippets...</div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="CodeCandy - Your Personal Code Snippet Manager"
        description="Save, organize, and share your code snippets with syntax highlighting, collections, and instant search. The modern way to manage your code snippets."
      />
      <AnimatedPage className="p-4 sm:p-6">
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-wrap gap-5 items-center justify-between mb-4">
            <div>
              <motion.h1 variants={itemVariants} className="text-3xl font-bold text-dark-100 mb-2">
                Welcome to CodeCandy
              </motion.h1>
              <motion.p variants={itemVariants} className="text-dark-300">
                Your personal code snippet manager. Save, organize, and share your code snippets.
              </motion.p>
            </div>
            <motion.div variants={itemVariants}>
              <Link
                to="/create"
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-smooth flex items-center shadow-lg hover:shadow-xl"
              >
                <FiPlus className="mr-2" />
                New Snippet
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={containerVariants}>
          <div className="flex flex-wrap-reverse gap-3 items-center justify-between mb-4">
            <motion.h2 variants={itemVariants} className="text-xl font-semibold text-dark-200">
              Recent Snippets
            </motion.h2>
            {recentSnippets.length > 0 && (
              <motion.div variants={itemVariants}>
                <Link
                  to="/search"
                  className="text-primary-400 hover:text-primary-300 transition-smooth"
                >
                  View all snippets
                </Link>
              </motion.div>
            )}
          </div>

          {recentSnippets.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="bg-dark-800 rounded-lg border border-dark-700 p-8 text-center"
            >
              <p className="text-dark-400 mb-4">No snippets yet. Create your first snippet to get started!</p>
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-smooth"
              >
                <FiPlus className="mr-2" />
                Create Snippet
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recentSnippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatedPage>
    </>
  );
}

export default Home; 