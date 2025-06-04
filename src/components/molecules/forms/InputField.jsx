import { forwardRef } from "react";
import { Controller } from "react-hook-form";

export const InputField = forwardRef(
  (
    {
      formatAsCurrency = false,
      onIconClick,
      label,
      disabled,
      type = "text",
      defaultValue = '',
      controlForm,
      nameController,
      rules,
      onChange,
      className = '',
      icon,
      error,
      isTextarea = false,
      rows = 4,
      onKeyDown,
      showCurrencySymbol = false,
      value, // para uso sin react-hook-form
    },
    ref
  ) => {
    const isControlled = controlForm && nameController;

    const formatCurrency = (val) => {
      const num = Number(val);
      if (isNaN(num)) return "";
      return new Intl.NumberFormat("es-CO", {
        style: "decimal",
        minimumFractionDigits: 0,
      }).format(num);
    };

    const inputPaddingClass = () => {
      if (formatAsCurrency) return "pl-1 pr-1 text-right";
      if (icon) return "pl-2 pr-8";
      return "pl-1 pr-1";
    };

    const renderInput = (fieldValue, handleChange) => {
      const displayValue =
        formatAsCurrency && fieldValue
          ? showCurrencySymbol
            ? `$${formatCurrency(fieldValue)}`
            : formatCurrency(fieldValue)
          : fieldValue;

      const baseProps = {
        ref,
        disabled,
        placeholder: '',
        inputMode: formatAsCurrency || type === 'number' ? 'numeric' : 'text',
        className: `appearance-none peer w-full py-[7px] text-md bg-transparent outline-none placeholder-transparent rounded-md transition-all text-gray-900
          ${disabled ? "text-blue-600 cursor-not-allowed" : ""}
          ${inputPaddingClass()}`,
        onKeyDown,
        value: displayValue,
        onChange: (e) => {
          let newValue = e.target.value;
          if (formatAsCurrency || type === 'number') {
            newValue = newValue.replace(/[^\d]/g, '');
          }
          const maxLen = rules?.maxLength?.value ?? Infinity;
          if (newValue.length <= maxLen) {
            handleChange(newValue);
            onChange?.(e);
          }
        },
        type: formatAsCurrency ? 'text' : type,
      };

      if (isTextarea) {
        return (
          <textarea
            {...baseProps}
            rows={rows}
            onChange={(e) => {
              const val = e.target.value;
              if (!rules?.maxLength || val.length <= +rules?.maxLength) {
                handleChange(val);
                onChange?.(e);
              }
            }}
          />
        );
      }

      return <input {...baseProps} />;
    };

    return (
      <div className={`flex flex-col ${className}`}>
        <div
          className={`relative w-full border-[1px] group rounded-lg ${disabled
            ? "border-gray-300 border-dashed"
            : "border-gray-400 focus-within:border-blue-600 hover:border-blue-600 focus-within:border-2"
            } ${error ? "border-red-500 animate-shake" : ""}`}
        >
          {isControlled ? (
            <Controller
              name={nameController}
              control={controlForm}
              defaultValue={defaultValue}
              rules={rules}
              render={({ field }) => renderInput(field.value ?? '', field.onChange)}
            />
          ) : (
            renderInput(value ?? '', onChange || (() => { }))
          )}

          {!formatAsCurrency && type !== "number" && icon && (
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-black cursor-pointer"
              onClick={onIconClick}
            >
              {icon}
            </span>
          )}

          <label
            className="rounded-full select-none pointer-events-none absolute left-2 -top-2 text-[10px] text-gray-400  peer-focus:px-1 px-1 bg-white transition-all peer-placeholder-shown:text-[14px] peer-placeholder-shown:top-[6px] peer-placeholder-shown:text-gray-400 peer-focus:-top-[9px] peer-focus:text-[10px] peer-focus:text-gray-500"
          >
            {label}
          </label>
        </div>

        <div className="flex justify-between items-center mt-1">
          <div>
            {error && (
              <span className="block text-sm text-red-500 select-none">{error}</span>
            )}
          </div>
          {rules?.maxLength && isControlled && (
            <Controller
              name={nameController}
              control={controlForm}
              render={({ field }) => (
                <span className="block text-sm text-gray-500 self-end select-none">
                  {`${field?.value?.length || 0}/${rules?.maxLength?.value}`}
                </span>
              )}
            />
          )}
        </div>
      </div>
    );
  }
);
