import { useEffect, useState } from 'react'

export default function Home() {
  const [status, setStatus] = useState<string>('checking...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('unreachable'))
  }, [])

  return (
    <div>
      <h1>Helpdesk</h1>
      <p>API status: {status}</p>
    </div>
  )
}
