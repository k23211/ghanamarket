"use client"

import { useEffect, useState } from 'react'

export default function VisitorCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    const inc = async () => {
      try {
        const res = await fetch('/api/visitors', { method: 'POST' })
        const json = await res.json()
        if (mounted) setCount(typeof json.count === 'number' ? json.count : 0)
      } catch (e) {
        console.error('VisitorCount error', e)
      }
    }
    inc()
    return () => { mounted = false }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: '#f5a623' }}>{count === null ? '—' : count}</span>
      <span style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Visitors</span>
    </div>
  )
}
