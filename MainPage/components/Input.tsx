"use client"

import type React from "react"

interface InputProps {
  placeholder?: string
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: React.FC<InputProps> = ({ placeholder, className = "", value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  )
}
