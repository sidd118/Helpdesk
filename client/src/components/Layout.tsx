import { Outlet } from 'react-router-dom'
import { authClient } from '../lib/auth-client'
import Navbar from './Navbar'

export type LayoutContext = {
  session: ReturnType<typeof authClient.useSession>['data']
}

export default function Layout() {
  const { data: session } = authClient.useSession()

  return (
    <>
      <Navbar session={session} />
      <Outlet context={{ session } satisfies LayoutContext} />
    </>
  )
}
