import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import LoginPanel from '@/components/LoginPanel'
import ThemeToggle from '@/components/ThemeToggle'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()
  const [authError, setAuthError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

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
      <div className="bg-background text-muted-foreground flex min-h-svh items-center justify-center">
        <Spinner className="size-5" />
      </div>
    )
  }

  if (session) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="bg-background text-foreground grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      <LoginPanel />

      <main className="relative flex items-center justify-center px-6 py-12">
        <ThemeToggle className="absolute top-6 right-6" />

        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 w-full max-w-sm motion-safe:duration-500">
          <p className="mb-10 font-mono text-xs tracking-[0.22em] uppercase lg:hidden">
            Helpdesk
          </p>

          <h1 className="text-2xl font-medium tracking-tight">Sign in</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Use the account your admin set up for you.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    {...register('password')}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      onClick={() => setShowPassword((shown) => !shown)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={[errors.password]} />
              </Field>

              {authError && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>Sign in failed</AlertTitle>
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Spinner />}
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </FieldGroup>
          </form>
        </div>
      </main>
    </div>
  )
}
