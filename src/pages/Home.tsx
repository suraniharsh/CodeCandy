import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { snippetService, type Snippet } from '../services/snippetService';
import { SnippetCard } from '../components';

function Home() {
  const [recentSnippets, setRecentSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSnippets = async () => {
      try {
        const snippets = await snippetService.getAllSnippets();
        setRecentSnippets(snippets.slice(0, 6)); // Show only the 6 most recent snippets
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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-dark-100 mb-2">
              Welcome to CodeCandy
            </h1>
            <p className="text-dark-300">
              Your personal code snippet manager. Save, organize, and share your code snippets.
            </p>
          </div>
          <Link
            to="/create"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-smooth flex items-center shadow-lg hover:shadow-xl"
          >
            <FiPlus className="mr-2" />
            New Snippet
          </Link>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-dark-200">
            Recent Snippets
          </h2>
          {recentSnippets.length > 0 && (
            <Link
              to="/search"
              className="text-primary-400 hover:text-primary-300 transition-smooth"
            >
              View all snippets
            </Link>
          )}
        </div>

        {recentSnippets.length === 0 ? (
          <div className="bg-dark-800 rounded-lg border border-dark-700 p-8 text-center">
            <p className="text-dark-400 mb-4">No snippets yet. Create your first snippet to get started!</p>
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-smooth"
            >
              <FiPlus className="mr-2" />
              Create Snippet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSnippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home; 