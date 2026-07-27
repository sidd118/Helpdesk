import { Outlet } from 'react-router-dom'
import { authClient } from '../lib/auth-client'
import Navbar from './Navbar'

export type LayoutContext = {
  session: ReturnType<typeof authClient.useSession>['data']
}

export default function Layout() {
  const { data: session } = authClient.useSession()

  return (
    <div className="flex min-h-svh flex-col bg-white text-slate-600 dark:bg-slate-950 dark:text-slate-400">
      <Navbar session={session} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <Outlet context={{ session } satisfies LayoutContext} />
      </main>
    </div>
  )
}
