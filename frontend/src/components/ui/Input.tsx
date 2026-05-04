// src/components/ui/Input.tsx
interface InputProps {
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  name?: string;
}

const Input = ({
  placeholder,
  type = "text",
  value,
  onChange,
  label,
  name,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-600">{label}</label>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-200 rounded-md px-3 py-2 text-sm 
                   focus:outline-none focus:ring-2 focus:ring-purple-500 
                   focus:border-transparent w-full"
      />
    </div>
  );
};

export default Input;
