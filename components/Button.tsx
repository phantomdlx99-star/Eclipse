"use client";

import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void | Promise<void>;
  direction?: "left" | "right" | "none";
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const Button = ({
  label,
  onClick,
  direction = "none",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "flex items-center justify-center gap-2 rounded-xl font-semibold transition-transform active:scale-95 cursor-pointer hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-amber-500/20",
    secondary:
      "bg-secondary text-secondary-foreground border border-gray-600 hover:border-gray-500",
    ghost:
      "bg-transparent text-primary border border-primary hover:bg-primary/10",
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "w-auto";

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick && !isLoading && !disabled) {
      try {
        await onClick();
      } catch (error) {
        console.error("Button action failed:", error);
      }
    }
  };

  const getArrowIcon = () => {
    if (isLoading) {
      return <Loader size={18} className="animate-spin" />;
    }
    if (direction === "left") {
      return <ArrowLeft size={18} />;
    }
    if (direction === "right") {
      return <ArrowRight size={18} />;
    }
    return null;
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className || ""}`}
      {...props}
    >
      {label}
      {getArrowIcon()}
    </button>
  );
};

export default Button;
