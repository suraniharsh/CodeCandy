interface Props {
  onClose: () => void;
}

export default function VerificationModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-dark-800 p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
        <h2 className="text-xl font-bold text-dark-100 mb-4">Verify your email</h2>
        <p className="text-dark-300 mb-6">
          We sent you a verification link. Please check your inbox and confirm your email.
          After verifying, you can log in.
        </p>
        <button
          onClick={onClose}
          className="w-full p-3 bg-dark-700 text-dark-100 rounded-lg hover:bg-dark-600"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
