import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export function Login() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-4"
      >
        <div className="bg-dark-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center text-dark-100 mb-8">
            Sign in to CodeCandy
          </h2>

          <div className="space-y-4">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center px-4 py-2 border border-dark-600 rounded-md shadow-sm text-dark-100 bg-dark-700 hover:bg-dark-600 transition-colors"
            >
              <FaGoogle className="mr-2" />
              Continue with Google
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 