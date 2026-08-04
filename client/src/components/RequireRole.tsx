import { Navigate, Outlet, useOutletContext } from 'react-router-dom'
import { authClient, type Role } from '@/lib/auth-client'
import type { LayoutContext } from './Layout'

type RequireRoleProps = {
  roles: Role[]
}

export default function RequireRole({ roles }: RequireRoleProps) {
  const context = useOutletContext<LayoutContext>()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (!session || !roles.includes(session.user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet context={context} />
}
