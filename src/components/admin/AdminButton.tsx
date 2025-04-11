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
  const baseStyles = "font-montserrat font-bold text-[18px] text-black transition-all duration-300 rounded-[60px] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  
  const sizeStyles = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4"
  }

  const variantStyles = {
    primary: "bg-[#2ECEB0] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none",
    secondary: "bg-transparent border-2 border-white hover:bg-white/10"
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