interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  bgColor?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  onClick,
  bgColor
}: ButtonProps) {
  const baseStyles = "font-montserrat font-bold text-[18px] text-white transition-all duration-300 rounded-[60px] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  const variants = {
    primary: `${bgColor ? bgColor : 'bg-[#ED323D]'} hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none`,
    secondary: "bg-transparent border-2 border-white hover:bg-white/10"
  }
  const sizes = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4"
  }

  const handleClick = () => {
    window.location.href = '/petition'
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