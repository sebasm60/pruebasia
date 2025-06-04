import { Controller } from "react-hook-form";

export const InputCheck = ({ nameController, controlForm, legend, rules, className }) => {
  return (
    <fieldset className={className}>
      <Controller
        name={nameController}
        control={controlForm}
        rules={rules}
        render={({ field, fieldState }) => (
          <div className="flex items-center">
            <input
              id={nameController}
              type="checkbox"
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              className="appearance-none checked:bg-blue-700 h-5 w-5 focus:outline-none focus:ring-0 cursor-pointer checked:border-transparent rounded border-gray-300 border"
            />
            <label htmlFor={nameController} className="ml-2 text-gray-900 cursor-pointer font-bold select-none mb-0">
              {legend}
            </label>

            {fieldState.error && (
              <span className="text-blue-500 text-sm ml-2 select-none">
                {fieldState.error.message || "Este campo es requerido"}
              </span>
            )}
          </div>
        )}
      />
    </fieldset>
  );
};
