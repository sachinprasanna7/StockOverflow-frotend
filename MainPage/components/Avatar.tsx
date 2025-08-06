import type React from "react"

interface AvatarProps {
  className?: string
  children: React.ReactNode
}

export const Avatar: React.FC<AvatarProps> = ({ className = "", children }) => {
  return <div className={`inline-flex items-center justify-center rounded-full ${className}`}>{children}</div>
}

export const AvatarFallback: React.FC<AvatarProps> = ({ className = "", children }) => {
  return <span className={`flex items-center justify-center w-full h-full ${className}`}>{children}</span>
}
