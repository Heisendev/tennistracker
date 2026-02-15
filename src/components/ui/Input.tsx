interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

const Input = ({ id, label, ...rest }: InputProps) => {
  return (
    <>
      <label htmlFor={id} className="flex items-center gap-2">
        {label}
      </label>
      <input
        type="text"
        id={id}
        className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        {...rest}
      />
    </>
  );
};
export default Input;
