import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div className="fixed inset-0 bg-dark-900 z-50">
      {/* Logo and loading bar */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-primary-500">CodeCandy</h1>
        </motion.div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-dark-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: 'linear'
            }}
          />
        </div>

        {/* Loading text */}
        <motion.p
          className="mt-4 text-dark-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Loading your snippets...
        </motion.p>
      </div>

      {/* Background grid animation */}
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-8 gap-4 p-8 opacity-5 pointer-events-none">
        {[...Array(32)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-primary-500 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{
              duration: 0.8,
              delay: i * 0.05,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            style={{ aspectRatio: '1' }}
          />
        ))}
      </div>
    </div>
  );
} 