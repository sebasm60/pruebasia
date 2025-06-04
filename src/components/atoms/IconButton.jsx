export const IconButton = ({
  icon: Icon,
  text,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  const hasText = Boolean(text);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`ring-0 flex items-center ${hasText ? "gap-2 justify-start" : "justify-center"} px-2 py-1.5 rounded-md text-sm transition-all duration-300 ${disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white"} ${!disabled && "hover:bg-blue-700 cursor-pointer"} ${className}`} >
      {Icon && <Icon className="w-4 h-4" />}
      {hasText && <span>{text}</span>}
    </button>
  );
};
