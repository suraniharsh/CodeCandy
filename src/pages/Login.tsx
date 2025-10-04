import React, { useState } from 'react';
import { FiGithub, FiMail } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ErrorFallback } from '../components/ErrorFallback';
import { toast } from 'react-hot-toast';
import EmailLoginForm from '../components/Auth/EmailLoginForm';
import EmailRegisterForm from '../components/Auth/EmailRegisterForm';

function Login() {
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const [view, setView] = useState<'social' | 'email-login' | 'email-register'>('social');
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      if (!isOnline) {
        toast.error('Please check your internet connection');
        return;
      }
      setError(null);
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err as Error);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      if (!isOnline) {
        toast.error('Please check your internet connection');
        return;
      }
      setError(null);
      await signInWithGithub();
      navigate('/');
    } catch (err) {
      console.error('Github sign-in error:', err);
      setError(err as Error);
    }
  };

  if (view === 'email-login') {
    return (
      <EmailLoginForm
        onSwitchToRegister={() => setView('email-register')}
        onBack={() => setView('social')}
      />
    );
  }

  if (view === 'email-register') {
    return (
      <EmailRegisterForm
        onSwitchToLogin={() => setView('email-login')}
        onBack={() => setView('social')}
      />
    );
  }

  if (error) {
    return (
      <ErrorFallback
        error={error}
        resetErrorBoundary={() => setError(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="bg-dark-800 rounded-lg border border-dark-700 shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-100 mb-2">Welcome Back</h1>
          <p className="text-dark-300">Sign in to continue to CodeCandy</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={!isOnline}
            className="w-full flex items-center justify-center space-x-2 p-3 border border-dark-600 rounded-lg text-dark-100 hover:bg-dark-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={handleGithubSignIn}
            disabled={!isOnline}
            className="w-full flex items-center justify-center space-x-2 p-3 border border-dark-600 rounded-lg text-dark-100 hover:bg-dark-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiGithub className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </button>

          <button
            onClick={() => setView('email-login')}
            className="w-full p-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600"
          >
            Continue with Email
          </button>
        </div>

        {!isOnline && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm text-center">
              You appear to be offline. Please check your internet connection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login; 