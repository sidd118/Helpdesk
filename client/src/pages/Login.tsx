import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authClient } from '../lib/auth-client'
import './Login.css'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setAuthError(null)

    const { error } = await authClient.signIn.email({ email, password })

    if (error) {
      setAuthError(error.message ?? 'Invalid email or password')
      return
    }

    navigate('/', { replace: true })
  }

  if (isPending) {
    return <p>Loading...</p>
  }

  if (session) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="login-page">
      <h1>Log in</h1>
      <form
        className="login-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            {...register('email')}
          />
          {errors.email && (
            <p className="login-error">{errors.email.message}</p>
          )}
        </div>
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? 'true' : 'false'}
            {...register('password')}
          />
          {errors.password && (
            <p className="login-error">{errors.password.message}</p>
          )}
        </div>
        {authError && <p className="login-error">{authError}</p>}
        <button type="submit" className="login-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
