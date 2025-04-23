import { ButtonHTMLAttributes } from 'react'

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AdminButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}: AdminButtonProps) {
  const baseStyles = "font-medium transition-all duration-300 rounded-[60px]"
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  const variantStyles = {
    primary: "bg-black hover:bg-gray-800 text-white",
    secondary: "border border-gray-600 text-gray-600 hover:border-gray-800 hover:text-gray-800"
  }

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} ${disabledStyles}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export type { AdminButtonProps }