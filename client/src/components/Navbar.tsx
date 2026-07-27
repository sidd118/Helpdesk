import { Link, useNavigate } from 'react-router-dom'
import { authClient } from '../lib/auth-client'
import type { LayoutContext } from './Layout'

type NavbarProps = {
  session: LayoutContext['session']
}

export default function Navbar({ session }: NavbarProps) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await authClient.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
      <Link
        to="/"
        className="font-medium text-slate-900 dark:text-slate-100"
      >
        Helpdesk
      </Link>
      {session && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-900 dark:text-slate-100">
            {session.user.name}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="cursor-pointer rounded-md border border-slate-200 px-3 py-1.5 text-sm transition-colors hover:border-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:border-slate-800 dark:hover:border-violet-500"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}
