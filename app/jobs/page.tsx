"use client"

import { useEffect, useMemo, useState } from "react"
import JobsList from "@/app/components/JobsList"
import JobForm from "@/app/components/JobForm"
import BottomNav from "@/app/components/BottomNav"

const types = ["All", "Full-time", "Part-time", "Contract", "Internship"]

export default function JobsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [refresh, setRefresh] = useState(0)
  const jobCountText = useMemo(() => `${typeFilter === 'All' ? 'All jobs' : `${typeFilter} jobs`}`, [typeFilter])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('search') ?? ''
    const type = params.get('type') ?? 'All'
    setSearch(query)
    setTypeFilter(type)
  }, [])

  return (
    <main style={{ background: '#0d0d0d', color: '#fff', fontFamily: 'sans-serif', maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      <section style={{ position: 'relative', height: 160, overflow: 'hidden', backgroundImage: "url('/job.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.8))' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: 20 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Jobs</h1>
          <p style={{ margin: '6px 0 0', color: '#ddd' }}>Find and post jobs directly in GhanaMarket.</p>
        </div>
      </section>

      <section style={{ padding: 16 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ background: '#111', borderRadius: 12, padding: 12 }}>
            <h3 style={{ margin: '0 0 8px' }}>Post a job</h3>
            <JobForm onPosted={() => setRefresh(prev => prev + 1)} />
          </div>

          <div style={{ background: '#111', borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search jobs by title, company, or location"
                  style={{ flex: 1, minWidth: 0, background: '#0d0d0d', color: '#fff', border: '1px solid #222', borderRadius: 12, padding: '12px 14px', fontSize: 13 }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {types.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTypeFilter(type)}
                    style={{
                      background: typeFilter === type ? '#f5a623' : 'rgba(255,255,255,0.08)',
                      color: typeFilter === type ? '#000' : '#fff',
                      border: 'none',
                      padding: '10px 14px',
                      borderRadius: 14,
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div style={{ color: '#aaa', fontSize: 12 }}>{jobCountText} • {search ? `Filtering by "${search}"` : 'Showing all jobs'}</div>
            </div>
            <JobsList search={search} typeFilter={typeFilter} refresh={refresh} />
          </div>
        </div>
      </section>

      <div style={{ paddingBottom: 100 }} />
      <BottomNav />
    </main>
  )
}
