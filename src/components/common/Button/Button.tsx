interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  bgColor?: string;
  href?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  onClick,
  bgColor,
  href
}: ButtonProps) {
  const baseStyles = "font-montserrat font-bold text-[14px] sm:text-[18px] transition-all duration-300 rounded-[40px] sm:rounded-[60px] border-[2px] sm:border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  const variants = {
    primary: `${bgColor ? bgColor : 'bg-[#ED323D]'} text-white hover:translate-y-[1px] sm:hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] sm:active:translate-y-[4px] active:shadow-none`,
    secondary: "bg-transparent border-2 border-black text-black hover:bg-black/10"
  }
  const sizes = {
    sm: "px-3 py-1.5 sm:px-4 sm:py-2",
    md: "px-4 py-2 sm:px-6 sm:py-3",
    lg: "px-6 py-3 sm:px-8 sm:py-4"
  }

  const handleClick = () => {
    if (href) {
      window.location.href = href
    }
    onClick?.()
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}