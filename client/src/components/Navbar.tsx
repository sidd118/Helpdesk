import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import type { LayoutContext } from './Layout'
import ThemeToggle from './ThemeToggle'

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
    <nav className="border-border flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-1">
        <Link to="/" className="mr-3 font-medium">
          Helpdesk
        </Link>
        {session?.user.role === 'ADMIN' && (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/users">Users</Link>
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {session && (
          <>
            <span className="text-muted-foreground text-sm">
              {session.user.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}
