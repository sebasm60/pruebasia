import { FaTimes } from "react-icons/fa";

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-6xl",
  full: "w-full h-full",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = "md",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className={`relative bg-white rounded-xl shadow-lg w-auto max-h-[90vh] flex flex-col ${sizeClasses[size]}`}>

        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full p-2 shadow hover:bg-red-700 transition-all z-10"
          aria-label="Cerrar modal"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {title && (
          <h2 className="text-xl font-semibold mb-4 px-6 pt-6 text-gray-900">
            {title}
          </h2>
        )}

        <div className="overflow-y-auto px-6 pb-6">{children}</div>

        {actions && <div className="flex justify-end gap-2 px-6 pb-6">{actions}</div>}
      </div>
    </div>
  );
};
