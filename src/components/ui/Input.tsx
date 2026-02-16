import { cva } from "class-variance-authority";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type?: string;
  variant?: "default" | "error" | "submit";
}

const inputStyles = cva(
  "rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
  {
    variants: {
      variant: {
        default: "",
        error: "border-red-500 focus:border-red-500 focus:ring-red-500",
        submit: "bg-(--bg-interactive-primary) hover:bg-(--bg-interactive-primary-hover) text-white py-3 px-4 rounded border border-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);  

const Input = ({ id, label, variant, type = "text", ...rest }: InputProps) => {
  return (
    <>
      {type !== "submit" && (
        <label htmlFor={id} className="flex items-center gap-2">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={inputStyles({ variant })}
        {...rest}
      />
    </>
  );
};
export default Input;
