import { FieldError, UseFormRegister } from "react-hook-form";

type SelectFieldProps = {
  label: string;
  className?: string,
  name: string;
  register: UseFormRegister<any>;
  options: { value: string; label: string }[];
  defaultValue?: string;
  error?: FieldError;
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
};

const SelectField = ({
  label,
  name,
  className,
  register,
  options,
  defaultValue,
  error,
  selectProps,
}: SelectFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-[48%] lg:w-[23%]">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <select
        {...register(name)}
        defaultValue={defaultValue}
        className="ring-[1.5px] ring-gray-300 focus:ring-blue-400 p-2 rounded-md text-sm w-full transition-all ease-in-out duration-150"
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error?.message && (
        <p className="text-xs text-red-400">{error.message}</p>
      )}
    </div>
  );
};

export default SelectField;
