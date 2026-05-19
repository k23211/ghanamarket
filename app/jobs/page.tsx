"use client"

import JobsList from "@/app/components/JobsList"
import JobForm from "@/app/components/JobForm"
import BottomNav from "@/app/components/BottomNav"

export default function JobsPage() {
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
            <JobForm onPosted={() => window.location.reload()} />
          </div>

          <div style={{ background: '#111', borderRadius: 12, padding: 12 }}>
            <h3 style={{ margin: '0 0 8px' }}>Latest jobs</h3>
            <JobsList />
          </div>
        </div>
      </section>

      <div style={{ paddingBottom: 100 }} />
      <BottomNav />
    </main>
  )
}
