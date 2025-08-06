"use client"

import type React from "react"

interface CheckboxProps {
  className?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export const Checkbox: React.FC<CheckboxProps> = ({ className = "", checked = false, onChange }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
    />
  )
}
