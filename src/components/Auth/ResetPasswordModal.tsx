import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResetPasswordModal({ isOpen, onClose }: Props) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await resetPassword(email);
      setMessage("Password reset link has been sent to your email.");
    } catch {
      setError("Failed to send password reset link. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-dark-100 mb-4">Reset Password</h2>
        <p className="text-dark-300 mb-4">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-dark-600 bg-dark-900 text-dark-100"
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
