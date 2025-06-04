import { Controller } from "react-hook-form";

export const InputRadio = ({ nameController, controlForm, options, legend, rules, className, classNameOptions = 'flex-row', disabled = false }) => {
  return (
    <fieldset className={`${className} flex flex-row gap-5`}>
      {legend && <h2 className="text-lg  text-black mb-2 select-none">{legend}</h2>}
      <Controller
        name={nameController}
        control={controlForm}
        rules={rules}
        render={({ field, fieldState }) => (
          <div className={`flex gap-2 ${classNameOptions}`}>
            {options.map((option) => (
              <label key={option.value} className={`flex items-center select-none ${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                  disabled={option.disabled}
                  type="radio"
                  id={`${nameController}-${option.value}`}
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={`appearance-none checked:bg-blue-700 h-4 w-4 focus:outline-none focus:ring-0 checked:border-transparent rounded-full border-gray-300 border ${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer '}`}
                />
                <span className="ml-2 text-gray-900 font-medium">{option.label}</span>
              </label>
            ))}
            {fieldState.error && (
              <span className="text-red-500 text-sm select-none">
                {fieldState.error.message || "Este campo es requerido"}
              </span>
            )}
          </div>
        )}
      />
    </fieldset>
  );
};
