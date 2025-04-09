"use client"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
  containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", containerClassName, ...props }, ref) => {
    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        {label && (
          <label className="text-base font-montserrat text-black/80">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "w-full px-4 py-3 bg-white rounded-lg border-2 border-black/10",
              "placeholder:text-black/40 font-montserrat text-base text-black",
              "focus:outline-none focus:border-[#2ECEB0] focus:ring-2 focus:ring-[#2ECEB0]/20",
              "transition-all duration-200",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 font-montserrat">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input } 