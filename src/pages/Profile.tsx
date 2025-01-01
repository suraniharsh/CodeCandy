import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800 rounded-lg shadow-xl p-6"
      >
        <div className="flex items-center space-x-6 mb-6">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-20 h-20 rounded-full border-2 border-primary-500"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center">
              <FiUser className="w-8 h-8 text-primary-500" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-dark-100">
              {user.displayName || 'Anonymous User'}
            </h1>
            <div className="flex items-center text-dark-400 mt-1">
              <FiMail className="mr-2" />
              {user.email}
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700 pt-6">
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-dark-300 hover:text-dark-100 transition-colors"
          >
            <FiLogOut className="mr-2" />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
} 