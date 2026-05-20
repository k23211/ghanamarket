"use client"

import { useEffect, useState } from 'react'

type VisitorStats = {
  count: number
}

export default function VisitorCount({ compact }: { compact?: boolean }) {
  const [stats, setStats] = useState<VisitorStats | null>(null)

  useEffect(() => {
    let mounted = true
    const inc = async () => {
      try {
        const res = await fetch('/api/visitors', { method: 'POST' })
        const json = await res.json()
        if (!mounted) return

        setStats({
          count: typeof json.count === 'number' ? json.count : 0,
        })
      } catch (e) {
        console.error('VisitorCount error', e)
      }
    }
    inc()
    return () => { mounted = false }
  }, [])

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#f5a623', lineHeight: 1 }}>{stats?.count == null ? '—' : stats.count}</div>
        <div style={{ fontSize: 11, color: '#bbb' }}>visitors</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 22, padding: '24px 22px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
        <div style={{ fontSize: 44, fontWeight: 900, color: '#f5a623', lineHeight: 1 }}>
          {stats?.count == null ? '—' : stats.count}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: '#aaa', letterSpacing: 0.5 }}>Total Visitors</div>
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: '#666', textAlign: 'center' }}>
        Updated on each visit to the home page
      </div>
    </div>
  )
}
