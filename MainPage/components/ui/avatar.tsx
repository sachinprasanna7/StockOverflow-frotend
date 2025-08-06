export const Avatar = ({ className, children }) => {
  return <div className={`avatar ${className}`}>{children}</div>
}

export const AvatarContent = ({ className, children }) => {
  return <div className={`avatar-content ${className}`}>{children}</div>
}

export const AvatarFallback = ({ className, children }) => {
  return <div className={`avatar-fallback ${className}`}>{children}</div>
}
