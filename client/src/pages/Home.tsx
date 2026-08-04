import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Home() {
  const [status, setStatus] = useState<string>('checking...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('unreachable'))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-medium tracking-tight">Helpdesk</h1>
      <Card>
        <CardHeader>
          <CardTitle>API status</CardTitle>
          <CardDescription>Health of the backend server.</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="bg-muted rounded-md px-2 py-1 font-mono text-sm">
            {status}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
