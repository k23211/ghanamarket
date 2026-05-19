"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BottomNav from '@/app/components/BottomNav'
import ApplicationForm from '@/app/components/ApplicationForm'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string | undefined
  const [job, setJob] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applicationsCount, setApplicationsCount] = useState<number | null>(null)
  const [refreshApplications, setRefreshApplications] = useState(0)

  useEffect(() => {
    if (!id) return
    let mounted = true

    const load = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`)
        const json = await res.json()
        if (!mounted) return
        if (json.job) {
          setJob(json.job)
        } else {
          setError(json.error || 'Job not found')
        }
      } catch (err) {
        setError('Unable to load job')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [id])

  useEffect(() => {
    if (!id) return
    let mounted = true

    const loadApplications = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}/applications`)
        const json = await res.json()
        if (!mounted) return
        setApplicationsCount(Array.isArray(json.applications) ? json.applications.length : 0)
      } catch (err) {
        if (!mounted) return
        setApplicationsCount(0)
      }
    }

    loadApplications()
    return () => { mounted = false }
  }, [id, refreshApplications])

  return (
    <main style={{ background: '#0d0d0d', color: '#fff', fontFamily: 'sans-serif', maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      <section style={{ background: '#111', padding: 16, borderBottom: '1px solid #1a1a1a' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 12, color: '#f5a623', padding: '8px 12px', cursor: 'pointer' }}>
          ← Back
        </button>
      </section>

      <section style={{ padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#f5a623' }}>Loading job…</div>
        ) : error ? (
          <div style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</div>
        ) : job ? (
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ background: '#111', borderRadius: 16, padding: 18, border: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>{job.title}</h1>
                  <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 13 }}>{job.company}</p>
                  <p style={{ margin: '8px 0 0', color: '#777', fontSize: 12 }}>{job.location || 'Remote'}</p>
                </div>
                <span style={{ background: '#1a1a1a', color: '#f5a623', fontSize: 11, fontWeight: 700, padding: '6px 10px', borderRadius: 12 }}>{job.type || 'Full-time'}</span>
              </div>
            </div>

            {job.description && (
              <div style={{ background: '#111', borderRadius: 16, padding: 18, border: '1px solid #1e1e1e' }}>
                <h2 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800 }}>Description</h2>
                <p style={{ margin: 0, color: '#ddd', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{job.description}</p>
              </div>
            )}

            <div style={{ background: '#111', borderRadius: 16, padding: 18, border: '1px solid #1e1e1e' }}>
              <h2 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800 }}>Posted by</h2>
              <p style={{ margin: 0, color: '#ddd' }}>{job.poster_name || 'Anonymous'}</p>
              <p style={{ margin: '8px 0 0', color: '#777', fontSize: 12 }}>{new Date(job.created_at).toLocaleString()}</p>
            </div>

            <div style={{ background: '#111', borderRadius: 16, padding: 18, border: '1px solid #1e1e1e' }}>
              <h2 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800 }}>Apply for this job</h2>
              <p style={{ margin: '0 0 16px', color: '#aaa', fontSize: 13 }}>
                {applicationsCount === null ? 'Loading application count…' : `${applicationsCount} application${applicationsCount === 1 ? '' : 's'} submitted`}
              </p>
              <ApplicationForm jobId={id!} onApplied={() => setRefreshApplications(prev => prev + 1)} />
            </div>
          </div>
        ) : null}
      </section>

      <div style={{ paddingBottom: 100 }} />
      <BottomNav />
    </main>
  )
}
