// src/components/ui/Button.tsx
import { type ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyle = {
  primary: "bg-purple-600 text-white hover:bg-purple-700",
  secondary: "bg-purple-300 text-purple-600 hover:bg-purple-400",
};

const sizeStyle = {
  lg: "py-3 px-6 text-lg rounded-xl",
  md: "py-2 px-4 text-md rounded-md",
  sm: "py-1 px-3 text-sm rounded-sm",
};

const Button = (props: ButtonProps) => {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={`
        ${variantStyle[props.variant]} 
        ${sizeStyle[props.size]} 
        flex items-center justify-center gap-2 font-bold
        transition-colors cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${props.fullWidth ? "w-full" : ""}
      `}
    >
      {props.startIcon && <span>{props.startIcon}</span>}
      <span>{props.text}</span>
      {props.endIcon && <span>{props.endIcon}</span>}
    </button>
  );
};

export default Button;
