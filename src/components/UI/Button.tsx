import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-gradient-to-b from-accent to-accent-dim text-white shadow-md shadow-accent/15 hover:shadow-lg hover:shadow-accent/20 hover:brightness-110",
  secondary:
    "bg-surface-light/80 hover:bg-surface-light text-text border border-glass-border hover:border-border",
  ghost:
    "bg-transparent hover:bg-glass-bg text-text-dim hover:text-text",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3.5 text-base",
  lg: "px-8 py-5 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-xl font-semibold transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
