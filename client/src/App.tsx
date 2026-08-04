import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import RequireRole from './components/RequireRole'
import Home from './pages/Home'
import Login from './pages/Login'
import Users from './pages/Users'

function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route element={<RequireRole roles={['ADMIN']} />}>
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' replace />}/>
      </Routes>
  )
}

export default App
