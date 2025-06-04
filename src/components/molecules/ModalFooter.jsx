export const ModalFooter = ({
  onCancel,
  cancelText = "Cancelar",
  actions = [],
}) => {
  const getButtonClass = (variant = "primary") => {
    switch (variant) {
      case "secondary":
        return "bg-gray-200 text-gray-800 hover:bg-gray-300";
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700";
      case "primary":
      default:
        return "bg-blue-600 text-white hover:bg-blue-700";
    }
  };


  return (
    <div className="flex justify-end gap-2 mt-6">
      {onCancel && (
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded transition bg-gray-300 text-gray-800 hover:bg-gray-400 flex items-center gap-2"
        >
          Cancelar
        </button>
      )}

      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={`px-4 py-2 rounded transition flex items-center gap-2 ${getButtonClass(action.variant)}`}
        >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.text}
        </button>
      ))}
    </div>
  );
};
