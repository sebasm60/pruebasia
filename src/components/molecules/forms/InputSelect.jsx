import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { Controller } from "react-hook-form";
import CustomValueContainer from 'src/reusable/CustomControl';

export const InputSelect = ({
  placeholder,
  options = [],
  loadOptions,
  defaultValue,
  controlForm,
  nameController,
  rules,
  onChange,
  isLoading,
  className,
  error,
  value,
  setValue,
  disabled,
}) => {

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: '#FFF',
      borderColor: state.isFocused ? "#2563eb" : base.borderColor,
      borderRadius: '5px',
      padding: '0',
      boxShadow: 'none',
      display: 'flex',
      height: '36px',
      minHeight: '36px',
      alignItems: 'center',
      '&:hover': {
        borderColor: '#2563eb',
      },
    }),
    singleValue: (base) => ({ ...base, padding: '0' }),
    valueContainer: (base) => ({ ...base, overflow: "visible" }),
    input: (base) => ({ ...base, padding: '0', margin: '0' }),
    dropdownIndicator: (base) => ({ ...base, cursor: "pointer" }),
    indicatorSeparator: (base) => ({ ...base, padding: '0', backgroundColor: '#2563eb' }),
    placeholder: (base, state) => ({
      ...base,
      position: "absolute",
      top: state.hasValue || state.selectProps.inputValue ? "-16.5px" : "50%",
      left: "-5px",
      transform: state.hasValue || state.selectProps.inputValue ? "scale(0.85)" : "translateY(-50%)",
      transition: "top 0.2s, transform 0.2s, font-size 0.2s",
      backgroundColor: "white",
      padding: "0 3px",
      color: "#919397",
      fontSize: state.hasValue || state.selectProps.inputValue ? "12px" : "16px",
      borderRadius: '25px',
    }),
    clearIndicator: (base) => ({ ...base, cursor: "pointer" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const sharedProps = {
    isLoading,
    placeholder,
    menuPosition: 'fixed',
    styles: customStyles,
    isClearable: true,
    menuPortalTarget: document.body,
    components: {
      ValueContainer: CustomValueContainer,
    },
  };

  const SelectComponent = loadOptions ? AsyncSelect : Select;

  return (
    <div className={`relative w-full text-gray-900 font-light ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-default'}`}>
      {controlForm && nameController ? (
        <Controller
          name={nameController}
          control={controlForm}
          defaultValue={defaultValue}
          rules={rules}
          render={({ field }) => {
            const selectedValue = loadOptions ? field.value ? { label: field?.value?.label, value: field?.value?.value } : null : options.find(option => option?.value === field.value) || null;
            return (
              <SelectComponent
                {...sharedProps}
                id={nameController}
                value={selectedValue}
                isDisabled={disabled}
                options={!loadOptions ? options : undefined}
                loadOptions={loadOptions}
                defaultOptions={!!loadOptions}
                cacheOptions={!!loadOptions}
                onChange={(selectedOption) => {
                  const newValue = selectedOption ? loadOptions ? selectedOption : selectedOption.value : null;
                  field.onChange(newValue);
                  onChange?.(selectedOption);
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            );
          }}
        />
      ) : (
        <SelectComponent
          {...sharedProps}
          isDisabled={disabled}
          value={
            loadOptions
              ? value
                ? { label: value.label, value }
                : null
              : options.find(option => option?.value === value) || null
          }
          options={!loadOptions ? options : undefined}
          loadOptions={loadOptions}
          defaultOptions={!!loadOptions}
          cacheOptions={!!loadOptions}
          onChange={(selectedOption) => {
            const newValue = selectedOption ? selectedOption.value : null;
            setValue?.(newValue);
            onChange?.(selectedOption);
          }}
        />
      )}
      {error && (
        <span className="block text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};
