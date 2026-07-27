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
    <div className="space-y-4">
      <h1 className="text-3xl font-medium tracking-tight text-slate-900 dark:text-slate-100">
        Helpdesk
      </h1>
      <p className="text-sm">
        API status:{' '}
        <span className="rounded-md bg-violet-500/10 px-2 py-1 font-mono text-violet-700 dark:text-violet-300">
          {status}
        </span>
      </p>
    </div>
  )
}
