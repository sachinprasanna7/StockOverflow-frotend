import type React from "react"

interface CardProps {
  className?: string
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ className = "", children }) => {
  return <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
}

export const CardHeader: React.FC<CardProps> = ({ className = "", children }) => {
  return <div className={`p-6 pb-4 ${className}`}>{children}</div>
}

export const CardTitle: React.FC<CardProps> = ({ className = "", children }) => {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
}

export const CardDescription: React.FC<CardProps> = ({ className = "", children }) => {
  return <p className={`text-sm text-gray-600 mt-1.5 ${className}`}>{children}</p>
}

export const CardContent: React.FC<CardProps> = ({ className = "", children }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}
