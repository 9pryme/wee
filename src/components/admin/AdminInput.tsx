'use client'
import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string
  error?: string
  variant?: 'input' | 'select'
  options?: { value: string, label: string }[]
}

export function AdminInput({ 
  label,
  type = 'text',
  error,
  className = '',
  variant = 'input',
  options = [],
  ...props 
}: AdminInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const isSelect = variant === 'select'

  const baseInputStyles = `
    w-full px-4 py-2
    border-2 border-black rounded-[12px]
    font-montserrat text-base
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[#2ECEB0] focus:border-transparent
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${className}
  `

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {isSelect ? (
          <div className="relative">
            <select
              className={`${baseInputStyles} appearance-none pr-10`}
              {...props}
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
        ) : (
          <>
            <input
              type={isPassword && showPassword ? 'text' : type}
              placeholder={isPassword ? '•••••••••••' : 'Enter your email'}
              className={baseInputStyles}
              {...props}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}