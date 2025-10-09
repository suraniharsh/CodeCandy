import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ResetPasswordModal from "./ResetPasswordModal";
import { useNavigate } from "react-router-dom";
import Alert from "../Alert";

interface Props {
  onSwitchToRegister: () => void;
  onBack: () => void;
}

export default function EmailLoginForm({ onSwitchToRegister, onBack }: Props) {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const startTime = Date.now();

    try {
      await signInWithEmail(email, password);

      const elapsed = Date.now() - startTime;
      const remaining = 2000 - elapsed;
      if (remaining > 0) {
        await new Promise((res) => setTimeout(res, remaining));
      }

      setShowSuccessAlert(true);

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="w-full max-w-sm p-6 bg-dark-800 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-100 mb-2">Log In</h1>
          <p className="text-dark-300">Enter your email address and password</p>
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
          <p className="text-sm text-right text-dark-300 mt-1 mb-4">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="hover:underline"
            >
              Forgot password?
            </button>
          </p>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-dark-700 text-dark-100 rounded-lg hover:bg-dark-600 transition-smooth flex justify-center"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm text-dark-300">
          <button onClick={onBack} className="hover:underline">← Back</button>
          <button onClick={onSwitchToRegister} className="hover:underline">
            Don't have an account? Register
          </button>
        </div>
      </div>

      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />

      {showSuccessAlert && (
        <Alert
          message="Login successful"
          type="success"
          onClose={() => setShowSuccessAlert(false)}
          duration={5000}
        />
      )}
    </div>
  );
}
