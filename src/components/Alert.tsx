import { useEffect } from "react";

interface Props {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Alert({ message, type = "success", onClose, duration = 5000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-md fixed top-6 right-6 z-50 transition-opacity duration-500`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}