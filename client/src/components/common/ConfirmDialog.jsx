import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

/**
 * Reusable premium confirmation dialog — replaces window.confirm()
 *
 * Props:
 *   open       – boolean
 *   title      – string
 *   message    – string
 *   confirmText – string (default "Delete")
 *   danger     – boolean (red confirm button vs primary)
 *   onConfirm  – fn
 *   onCancel   – fn
 */
export default function ConfirmDialog({
  open, title, message,
  confirmText = "Delete", danger = true,
  onConfirm, onCancel,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[fadeIn_.15s_ease]">
        {/* Icon + close */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? "bg-red-100" : "bg-primary/10"}`}>
            <FaExclamationTriangle className={`text-xl ${danger ? "text-red-500" : "text-primary"}`} />
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <FaTimes />
          </button>
        </div>

        {/* Text */}
        <h3 className="font-bold text-gray-800 text-lg mb-1">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 h-11 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
