"use client"

import { useEffect, useState } from 'react'

type Job = {
  id: string
  title: string
  company: string
  location?: string
  type?: string
  description?: string
  created_at?: string
}

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/jobs')
        const json = await res.json()
        if (!mounted) return
        setJobs(json.jobs || [])
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <div style={{ color: '#f5a623', textAlign: 'center' }}>Loading jobs…</div>
  if (jobs.length === 0) return <div style={{ color: '#888', textAlign: 'center' }}>No jobs posted yet.</div>

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {jobs.map(j => (
        <div key={j.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{j.title}</div>
              <div style={{ fontSize: 12, color: '#aaa' }}>{j.company} · {j.location || 'Remote'}</div>
            </div>
            <div style={{ fontSize: 11, color: '#f5a623', fontWeight: 800 }}>{j.type || 'Full-time'}</div>
          </div>
          {j.description && <p style={{ marginTop: 8, color: '#ddd', fontSize: 13 }}>{j.description}</p>}
        </div>
      ))}
    </div>
  )
}
