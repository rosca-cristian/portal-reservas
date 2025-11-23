import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { useAuthStore } from '@/stores/authStore'
import type { RegisterRequest, LoginResponse } from '@/types/api'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'faculty']),
  major: z.string().optional(),
  department: z.string().optional(),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'student' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiClient.post<{ data: LoginResponse }>('/auth/register', data as RegisterRequest)

      setAuth(response.data.data.user, response.data.data.token)
      navigate('/spaces')
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, #D4E6FF 0%, #C4B5FD 50%, #8BDBDB 100%)',
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      <div
        className="w-full max-w-md"
        style={{
          background: 'linear-gradient(145deg, #F0F9FF, #F0FFF9)',
          borderRadius: '40px',
          padding: '3rem',
          boxShadow: `
            20px 20px 40px rgba(133, 196, 219, 0.3),
            -20px -20px 40px rgba(255, 255, 255, 0.9)
          `
        }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-extrabold mb-3"
            style={{
              color: '#0d3d56',
              textShadow: `
                2px 2px 4px rgba(255,255,255,0.8),
                -1px -1px 2px rgba(13, 61, 86, 0.2)
              `
            }}
          >
            ✨ Join SpaceFlow
          </h1>
          <p
            className="text-lg font-semibold"
            style={{ color: '#16213e' }}
          >
            Create your account
          </p>
        </div>

        {error && (
          <div
            className="mb-6 p-4 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
              color: '#8B0000',
              fontWeight: '700',
              boxShadow: `
                8px 8px 16px rgba(255, 150, 150, 0.4),
                -8px -8px 16px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(255,255,255,0.4)
              `
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ClayInput
            label="👤 Full Name"
            {...register('name')}
            type="text"
            id="name"
            placeholder="John Doe"
            error={errors.name?.message}
          />

          <ClayInput
            label="📧 Email"
            {...register('email')}
            type="email"
            id="email"
            placeholder="email@university.edu"
            error={errors.email?.message}
          />

          <ClayInput
            label="🔒 Password"
            {...register('password')}
            type="password"
            id="password"
            placeholder="At least 6 characters"
            error={errors.password?.message}
          />

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-bold mb-2"
              style={{
                color: '#1a1a2e',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              🎓 Role
            </label>
            <div
              style={{
                background: 'linear-gradient(145deg, #ffffff, #ececec)',
                borderRadius: '30px',
                padding: '4px',
                boxShadow: `
                  8px 8px 16px rgba(163, 177, 198, 0.4),
                  -8px -8px 16px rgba(255, 255, 255, 0.9),
                  inset 2px 2px 4px rgba(255,255,255,0.5)
                `
              }}
            >
              <select
                {...register('role')}
                id="role"
                className="w-full px-6 py-3 bg-transparent border-none rounded-3xl focus:outline-none font-semibold"
                style={{
                  color: '#1a1a2e',
                  fontSize: '1rem'
                }}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
          </div>

          {selectedRole === 'student' && (
            <ClayInput
              label="📚 Major (Optional)"
              {...register('major')}
              type="text"
              id="major"
              placeholder="Computer Science"
            />
          )}

          {selectedRole === 'faculty' && (
            <ClayInput
              label="🏛️ Department (Optional)"
              {...register('department')}
              type="text"
              id="department"
              placeholder="Computer Science"
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-4 rounded-3xl font-bold text-lg transition-all duration-300 mt-6"
            style={{
              background: isLoading
                ? 'linear-gradient(145deg, #D3D3D3, #B0B0B0)'
                : 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              boxShadow: isLoading
                ? 'inset 4px 4px 8px rgba(0,0,0,0.2), inset -4px -4px 8px rgba(139,219,219,0.3)'
                : `
                  8px 8px 16px rgba(133, 196, 219, 0.4),
                  -8px -8px 16px rgba(255, 255, 255, 0.9)
                `,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = `
                  12px 12px 24px rgba(139, 219, 219, 0.6),
                  -12px -12px 24px rgba(255, 255, 255, 0.95),
                  inset 2px 2px 4px rgba(255,255,255,0.4)
                `
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = `
                  8px 8px 16px rgba(133, 196, 219, 0.4),
                  -8px -8px 16px rgba(255, 255, 255, 0.9)
                `
              }
            }}
            onMouseDown={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = `
                  inset 4px 4px 8px rgba(0,0,0,0.2),
                  inset -4px -4px 8px rgba(139,219,219,0.3)
                `
              }
            }}
            onMouseUp={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = `
                  12px 12px 24px rgba(139, 219, 219, 0.6),
                  -12px -12px 24px rgba(255, 255, 255, 0.95),
                  inset 2px 2px 4px rgba(255,255,255,0.4)
                `
              }
            }}
          >
            {isLoading ? '⏳ Creating account...' : '🚀 Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm font-semibold" style={{ color: '#16213e' }}>
            Already have an account?{' '}
            <a
              href="/login"
              className="font-bold transition-colors"
              style={{
                color: '#0d3d56',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8BDBDB'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#0d3d56'}
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Clay Input Component
const ClayInput = ({ label, error, ...props }: any) => {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-sm font-bold mb-2"
        style={{
          color: '#1a1a2e',
          textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
        }}
      >
        {label}
      </label>
      <div
        style={{
          background: 'linear-gradient(145deg, #ffffff, #ececec)',
          borderRadius: '30px',
          padding: '4px',
          boxShadow: `
            8px 8px 16px rgba(163, 177, 198, 0.4),
            -8px -8px 16px rgba(255, 255, 255, 0.9),
            inset 2px 2px 4px rgba(255,255,255,0.5)
          `
        }}
      >
        <input
          {...props}
          className="w-full px-6 py-3 bg-transparent border-none rounded-3xl focus:outline-none font-semibold"
          style={{
            color: '#1a1a2e',
            fontSize: '1rem'
          }}
        />
      </div>
      {error && (
        <p
          className="mt-2 text-sm font-bold"
          style={{ color: '#FF6B6B' }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
