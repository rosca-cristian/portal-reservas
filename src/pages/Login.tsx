import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { login as loginService } from '@/lib/auth/authService'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { setAuth, setLoading, setError, isLoading, error } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await loginService(data.email, data.password)

      setAuth(response.user, response.token)
      navigate('/spaces')
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed')
    } finally {
      setLoading(false)
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
        {/* Logo/Title */}
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
            SpaceFlow
          </h1>
          <p
            className="text-lg font-semibold"
            style={{ color: '#16213e' }}
          >
            Sign in to reserve spaces
          </p>
        </div>

        {/* Error Message */}
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold mb-2"
              style={{
                color: '#1a1a2e',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              📧 Email
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
                {...register('email')}
                type="email"
                id="email"
                className="w-full px-6 py-3 bg-transparent border-none rounded-3xl focus:outline-none font-semibold"
                placeholder="juanperez@demo.com"
                style={{
                  color: '#1a1a2e',
                  fontSize: '1rem'
                }}
              />
            </div>
            {errors.email && (
              <p
                className="mt-2 text-sm font-bold"
                style={{ color: '#FF6B6B' }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold mb-2"
              style={{
                color: '#1a1a2e',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              🔒 Password
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
                {...register('password')}
                type="password"
                id="password"
                className="w-full px-6 py-3 bg-transparent border-none rounded-3xl focus:outline-none font-semibold"
                placeholder="Enter password"
                style={{
                  color: '#1a1a2e',
                  fontSize: '1rem'
                }}
              />
            </div>
            {errors.password && (
              <p
                className="mt-2 text-sm font-bold"
                style={{ color: '#FF6B6B' }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-4 rounded-3xl font-bold text-lg transition-all duration-300"
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
            {isLoading ? '⏳ Logging in...' : '✨ Login'}
          </button>
        </form>

        {/* Test Credentials */}
        <div
          className="mt-8 p-5 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            boxShadow: `
              10px 10px 20px rgba(163, 177, 198, 0.5),
              -10px -10px 20px rgba(255, 255, 255, 0.9),
              inset 0 0 0 rgba(255,255,255,0)
            `
          }}
        >
          <p
            className="text-sm font-bold mb-3"
            style={{
              color: '#1a1a2e',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            🔑 Test Credentials
          </p>
          <div className="space-y-2 text-sm font-semibold" style={{ color: '#4A5568' }}>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#8BDBDB' }}></span>
              <span>Student: juanperez@demo.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#C4B5FD' }}></span>
              <span>Faculty: juanfaculty@demo.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#A8E6D4' }}></span>
              <span>Admin: admin@demo.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#A8E6FF' }}></span>
              <span>Password: password</span>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm font-semibold" style={{ color: '#16213e' }}>
            Don't have an account?{' '}
            <a
              href="/register"
              className="font-bold transition-colors"
              style={{
                color: '#0d3d56',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8BDBDB'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#0d3d56'}
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
