import { FieldError, UseFormRegister } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  name: string;
  register?: UseFormRegister<any>;
  defaultValue?: string;
  error?: FieldError | string; // Allow string type
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  disabled?: boolean;
};

const InputField = ({
  label,
  type = "text",
  name,
  register,
  defaultValue,
  error,
  inputProps,
  disabled,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...(register && !disabled ? register(name) : {})}
        defaultValue={defaultValue}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...inputProps}
        disabled={disabled}
      />
      {error && <p className="text-xs text-red-400">{typeof error === 'string' ? error : error.message}</p>}
    </div>
  );
};

export default InputField;