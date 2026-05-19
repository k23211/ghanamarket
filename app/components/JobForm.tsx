"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function JobForm({ onPosted }: { onPosted?: () => void }) {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('Full-time')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('')
    if (!title || !company) { setStatus('Title and company are required'); return }
    setLoading(true)

    // try to get logged-in user's name
    let poster_name: string | null = null
    let poster_id: string | null = null
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        poster_name = (user.user_metadata?.full_name as string) || (user.email as string)
        poster_id = user.id
      }
    } catch (e) {
      // ignore
    }

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, company, location, type, description, poster_name, poster_id })
      })
      const json = await res.json()
      if (json.job) {
        setTitle('')
        setCompany('')
        setLocation('')
        setType('Full-time')
        setDescription('')
        setStatus('Job posted')
        onPosted && onPosted()
      } else {
        setStatus(json.error || 'Unable to post job')
      }
    } catch (err) {
      setStatus('Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Job title" style={inputStyle} />
      <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" style={inputStyle} />
      <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location (city or remote)" style={inputStyle} />
      <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Contract</option>
        <option>Internship</option>
      </select>
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" style={{ ...inputStyle, minHeight: 80 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} style={{ background: '#f5a623', color: '#000', border: 'none', padding: '10px 14px', borderRadius: 10, fontWeight: 800 }}>{loading ? 'Posting…' : 'Post Job'}</button>
        <div style={{ alignSelf: 'center', color: '#aaa' }}>{status}</div>
      </div>
    </form>
  )
}

const inputStyle: React.CSSProperties = { background: '#0d0d0d', border: '1px solid #222', borderRadius: 10, padding: 10, color: '#fff', fontSize: 13 }
