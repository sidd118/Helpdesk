import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authClient } from '../lib/auth-client'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const inputClass =
  'rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-violet-500 aria-invalid:border-red-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100'

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
    return (
      <div className="flex min-h-svh items-center justify-center bg-white text-slate-600 dark:bg-slate-950 dark:text-slate-400">
        <p>Loading...</p>
      </div>
    )
  }

  if (session) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-white px-6 py-12 text-slate-600 dark:bg-slate-950 dark:text-slate-400">
      <h1 className="mb-8 text-3xl font-medium tracking-tight text-slate-900 dark:text-slate-100">
        Log in
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full max-w-xs flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm text-slate-900 dark:text-slate-100"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            className={inputClass}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm text-slate-900 dark:text-slate-100"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? 'true' : 'false'}
            className={inputClass}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        {authError && <p className="text-sm text-red-500">{authError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-md border border-violet-500/50 bg-violet-500/10 px-3 py-2 text-slate-900 transition-colors hover:border-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-default disabled:opacity-60 disabled:hover:border-violet-500/50 dark:text-slate-100"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
