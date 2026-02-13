import { X, AlertTriangle } from "lucide-react";
import { UserResponse } from "../../api/user/types";

export type ConfirmAction = "toggleStatus" | "permanentDelete";

interface UserConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: UserResponse | null;
  action: ConfirmAction;
  isPending?: boolean;
}

export default function UserConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  action,
  isPending = false,
}: UserConfirmModalProps) {
  if (!isOpen || !user) return null;

  const isToggle = action === "toggleStatus";
  const isActive = user.isActive !== false;
  const newStatus = isActive ? "inactive" : "active";

  const title = isToggle
    ? `Confirm ${isActive ? "Deactivate" : "Activate"} User`
    : "Confirm Permanent Delete";

  const message = isToggle ? (
    <>
      Are you sure you want to {isActive ? "deactivate" : "activate"}{" "}
      <span className="font-semibold text-gray-900">
        {user.firstName} {user.lastName}
      </span>
      ? {isActive ? "They will not be able to log in until reactivated." : "They will be able to log in again."}
    </>
  ) : (
    <>
      Are you sure you want to permanently delete{" "}
      <span className="font-semibold text-gray-900">
        {user.firstName} {user.lastName}
      </span>
      ?
    </>
  );

  const warningText = isToggle
    ? `The user will be marked as ${newStatus}.`
    : "This action cannot be undone. All data associated with this user will be permanently deleted.";

  const confirmLabel = isToggle
    ? (isActive ? "Deactivate User" : "Activate User")
    : "Delete Permanently";

  const headerColor = isToggle
    ? "from-amber-500 to-amber-600"
    : "from-red-500 to-red-600";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${headerColor} px-6 py-4 rounded-t-xl`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="text-white/80 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">{message}</p>
          <p className="text-sm text-gray-500 mb-6">{warningText}</p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                isToggle
                  ? isActive
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isToggle ? "Updating..." : "Deleting..."}
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
