"use client"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  className?: string
  containerClassName?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        {label && (
          <label className="text-base font-montserrat text-black/80">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "w-full px-4 py-3 bg-white rounded-lg border-2 border-black/10",
              "font-montserrat text-base text-black appearance-none",
              "focus:outline-none focus:border-[#2ECEB0] focus:ring-2 focus:ring-[#2ECEB0]/20",
              "transition-all duration-200",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          >
            <option value="">Select bank</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
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

Select.displayName = "Select"

export { Select } 