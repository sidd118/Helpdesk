import { Outlet } from 'react-router-dom'
import { authClient } from '@/lib/auth-client'
import Navbar from './Navbar'

export type LayoutContext = {
  session: ReturnType<typeof authClient.useSession>['data']
}

export default function Layout() {
  const { data: session } = authClient.useSession()

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <Navbar session={session} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <Outlet context={{ session } satisfies LayoutContext} />
      </main>
    </div>
  )
}
