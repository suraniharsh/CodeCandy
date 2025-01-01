import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiLoader } from 'react-icons/fi';
import { snippetService, type Snippet } from '../services/snippetService';
import { SnippetCard } from '../components';

const SNIPPETS_PER_PAGE = 12;

function Search() {
  const [query, setQuery] = useState('');
  const [allSnippets, setAllSnippets] = useState<Snippet[]>([]);
  const [displayedSnippets, setDisplayedSnippets] = useState<Snippet[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, _setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const observer = useRef<IntersectionObserver>();

  // Load all snippets initially
  useEffect(() => {
    const loadAllSnippets = async () => {
      try {
        setInitialLoading(true);
        const snippets = await snippetService.getAllSnippets();
        setAllSnippets(snippets);
        updateDisplayedSnippets(snippets, 1);
      } catch (error) {
        console.error('Error loading snippets:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadAllSnippets();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1); // Reset page when query changes
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Filter snippets based on search query
  useEffect(() => {
    const searchTerm = debouncedQuery.toLowerCase();
    const filteredSnippets = allSnippets.filter(snippet =>
      snippet.title.toLowerCase().includes(searchTerm) ||
      snippet.description.toLowerCase().includes(searchTerm) ||
      snippet.code.toLowerCase().includes(searchTerm) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    updateDisplayedSnippets(filteredSnippets, 1);
  }, [debouncedQuery, allSnippets]);

  // Update displayed snippets based on current page
  const updateDisplayedSnippets = (snippets: Snippet[], currentPage: number) => {
    const endIndex = currentPage * SNIPPETS_PER_PAGE;
    const hasMoreSnippets = endIndex < snippets.length;
    setHasMore(hasMoreSnippets);
    setDisplayedSnippets(snippets.slice(0, endIndex));
  };

  // Infinite scroll setup
  const lastSnippetRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          updateDisplayedSnippets(allSnippets, nextPage);
          return nextPage;
        });
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, allSnippets]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Search Snippets</h1>
        <p className="text-dark-300">
          Search through your code snippets by title, description, or tags.
        </p>
      </div>

      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search snippets..."
          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth pl-12"
        />
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
      </div>

      <div className="space-y-4">
        {initialLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : displayedSnippets.length > 0 ? (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedSnippets.map((snippet, index) => (
                <motion.div
                  key={snippet.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  ref={index === displayedSnippets.length - 1 ? lastSnippetRef : null}
                >
                  <SnippetCard snippet={snippet} />
                </motion.div>
              ))}
            </div>
            {hasMore && (
              <div className="text-center py-8">
                <FiLoader className="w-6 h-6 text-primary-500 animate-spin mx-auto" />
              </div>
            )}
          </AnimatePresence>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-dark-400">No snippets found matching "{query}"</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-dark-400">Start typing to search through your snippets</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search; 