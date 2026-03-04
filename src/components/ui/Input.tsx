import { cva } from "class-variance-authority";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type?: string;
  variant?: "default" | "error" | "submit";
}

const inputStyles = cva(
  "border",
  {
    variants: {
      variant: {
        default: "px-3 py-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
        error: "px-3 py-2 border-[var(--bg-interactive-danger)] focus:border-[var(--bg-interactive-danger)] focus:ring-[var(--bg-interactive-danger)]",
        submit: "bg-[var(--bg-interactive-primary)] hover:bg-[var(--bg-interactive-primary-hover)] text-white py-3 px-4 border border-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);  

const Input = ({ id, label, variant, className, type = "text", ...rest }: InputProps) => {
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
        className={`${inputStyles({ variant })} ${className}`}
        {...rest}
      />
    </>
  );
};
export default Input;
