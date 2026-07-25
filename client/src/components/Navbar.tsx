import { Link, useNavigate } from 'react-router-dom'
import { authClient } from '../lib/auth-client'
import type { LayoutContext } from './Layout'
import './Navbar.css'

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
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Helpdesk
      </Link>
      {session && (
        <div className="navbar-user">
          <span className="navbar-user-name">{session.user.name}</span>
          <button
            type="button"
            className="navbar-signout"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}
