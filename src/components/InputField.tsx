import { FieldError, UseFormRegister } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  className?: string
  name: string;
  register?: UseFormRegister<any>;
  value?: string;
  error?: FieldError | string; // Allow string type
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  disabled?: boolean;
};

const InputField = ({
  label,
  type = "text",
  name,
  className,
  register,
  value,
  error,
  inputProps,
  disabled,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-[48%] lg:w-[23%]">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <input
        type={type}
        {...(register && !disabled ? register(name) : {})}
        defaultValue={value}
        className="ring-[1.5px] ring-gray-300 focus:ring-blue-400 p-2 rounded-md text-sm w-full transition-all ease-in-out duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
        {...inputProps}
        disabled={disabled}
      />
      {error && (
        <p className="text-xs text-red-400">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
};

export default InputField;
