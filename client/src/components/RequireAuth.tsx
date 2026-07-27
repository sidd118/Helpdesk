import { Navigate, Outlet } from 'react-router-dom';
import { authClient } from '../lib/auth-client';

export default function RequireAuth() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-white text-slate-600 dark:bg-slate-950 dark:text-slate-400">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
