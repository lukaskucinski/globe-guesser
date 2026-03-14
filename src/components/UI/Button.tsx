import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-gradient-to-b from-accent to-accent-dim text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:brightness-110",
  secondary:
    "bg-surface-light/80 hover:bg-surface-light text-text border border-white/[0.06] hover:border-white/[0.1]",
  ghost:
    "bg-transparent hover:bg-white/[0.04] text-text-dim hover:text-text",
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
