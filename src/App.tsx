import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar, Sidebar } from './components';
import { Home, Collections, Favorites, Search, SnippetView, Login, Profile, CreateSnippet, Settings, About } from './pages';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Loader } from './components/Loader';

const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 }
};

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return window.innerWidth >= 768;
  });
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useKeyboardShortcuts();

  useEffect(() => {
    // Shorter loading time and wait for initial render
    const minLoadTime = 800; // Minimum time to show loader
    const startTime = Date.now();

    const hideLoader = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };

    // Hide loader when everything is ready
    Promise.all([
      // Add any initialization promises here
      new Promise(resolve => setTimeout(resolve, 0)) // Placeholder for actual initialization
    ]).then(hideLoader);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Listen for window resize to update sidebar state
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100 flex">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1">
        <Navbar onSidebarToggle={setIsSidebarOpen} />
        <motion.main
          initial={false}
          animate={{
            marginLeft: isSidebarOpen ? 240 : 72
          }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="pt-16 min-h-screen"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="p-4 md:p-6 max-w-7xl mx-auto"
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/create" element={<Collections />} />
                <Route path="/collections/:id" element={<Collections />} />
                <Route path="/create" element={<CreateSnippet />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/search" element={<Search />} />
                <Route path="/snippet/:id" element={<SnippetView />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
      <Toaster position="bottom-right" theme="dark" richColors />
      <KeyboardShortcuts />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <AppContent />
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
