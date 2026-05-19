"use client"

import { useEffect, useMemo, useState } from 'react'

type Job = {
  id: string
  title: string
  company: string
  location?: string
  type?: string
  description?: string
  created_at?: string
}

export default function JobsList({ search = '', typeFilter = 'All', refresh = 0 }: { search?: string; typeFilter?: string; refresh?: number }) {
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
  }, [refresh])

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const searchText = `${job.title} ${job.company} ${job.location || ''}`.toLowerCase()
      const matchesSearch = searchText.includes(search.toLowerCase())
      const matchesType = typeFilter === 'All' || job.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [jobs, search, typeFilter])

  if (loading) return <div style={{ color: '#f5a623', textAlign: 'center' }}>Loading jobs…</div>
  if (filteredJobs.length === 0) return <div style={{ color: '#888', textAlign: 'center' }}>No jobs match your search.</div>

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {filteredJobs.map(j => (
        <a key={j.id} href={`/jobs/${j.id}`} style={{ textDecoration: 'none' }}>
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 12, transition: 'transform 150ms ease', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{j.title}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>{j.company} · {j.location || 'Remote'}</div>
              </div>
              <div style={{ fontSize: 11, color: '#f5a623', fontWeight: 800 }}>{j.type || 'Full-time'}</div>
            </div>
            {j.description && <p style={{ marginTop: 8, color: '#ddd', fontSize: 13, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{j.description}</p>}
          </div>
        </a>
      ))}
    </div>
  )
}
