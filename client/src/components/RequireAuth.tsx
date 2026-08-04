import { Navigate, Outlet } from 'react-router-dom'
import { authClient } from '@/lib/auth-client'

export default function RequireAuth() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="bg-background text-muted-foreground flex min-h-svh items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
