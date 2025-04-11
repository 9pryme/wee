'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminInput } from '@/components/admin/AdminInput'
import { AdminButton } from '@/components/admin/AdminButton'
import { logger } from '@/utils/logger'
import * as crypto from 'crypto'
import Cookies from 'js-cookie'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

interface LoginError {
  message: string
}

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    logger.info('Login attempt:', { email: formData.email })

    try {
      const hashedPassword = hashPassword(formData.password)

      const { data: admin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', formData.email)
        .eq('password', hashedPassword)
        .single()

      if (error) throw error as LoginError
      if (!admin) throw new Error('Invalid email or password') as LoginError

      // Set session cookie
      const session = {
        id: admin.id,
        email: admin.email,
        timestamp: new Date().toISOString()
      }

      // Set cookie to expire in 24 hours
      Cookies.set('adminSession', JSON.stringify(session), { expires: 1 })
      logger.info('Login successful:', { email: admin.email })

      // Redirect to dashboard
      window.location.href = '/admin/dashboard'

    } catch (error: LoginError | unknown) {
      logger.error('Login error:', error)
      setErrors({
        ...errors,
        password: error instanceof Error ? error.message : 'An error occurred'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AdminInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />

          <AdminInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            required
          />

          <AdminButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </AdminButton>
        </form>
      </div>
    </div>
  )
} 