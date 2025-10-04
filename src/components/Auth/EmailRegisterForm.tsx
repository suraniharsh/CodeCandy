import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import VerificationModal from './VerificationModal';

interface Props {
  onSwitchToLogin: () => void;
  onBack: () => void;
}

export default function EmailRegisterForm({ onSwitchToLogin, onBack }: Props) {
  const { signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const startTime = Date.now();

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signUpWithEmail(email, password);

      const elapsed = Date.now() - startTime;
      const remaining = 2000 - elapsed;
      if (remaining > 0) {
        await new Promise((res) => setTimeout(res, remaining));
      }

      setShowVerificationModal(true);
    } catch (err) {
      setError('Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="w-full max-w-sm p-6 bg-dark-800 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-100 mb-2">Register</h1>
          <p className="text-dark-300">Fill in your details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-dark-600 bg-dark-900 text-dark-100"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-dark-600 bg-dark-900 text-dark-100"
          />
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            placeholder="Repeat Password"
            className="w-full p-3 rounded-lg border border-dark-600 bg-dark-900 text-dark-100"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-dark-700 text-dark-100 rounded-lg hover:bg-dark-600 transition-smooth flex justify-center"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : ("Register"

            )}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm text-dark-300">
          <button onClick={onBack} className="hover:underline">← Back</button>
          <button onClick={onSwitchToLogin} className="hover:underline">
            Already have an account? Login
          </button>
        </div>
      </div>

      {showVerificationModal && (
        <VerificationModal onClose={onSwitchToLogin} />
      )}
    </div>
  );
}
