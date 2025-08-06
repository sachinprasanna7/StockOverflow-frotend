"use client"

import type React from "react"

interface ButtonProps {
  variant?: "default" | "ghost"
  size?: "default" | "sm"
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  onClick,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  }

  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}
