"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type ApplicationFormProps = {
  jobId: string
  onApplied?: () => void
}

export default function ApplicationForm({ jobId, onApplied }: ApplicationFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    let mounted = true
    const loadUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!mounted || !user) return
        setName((user.user_metadata?.full_name as string) || user.email || '')
        setEmail(user.email || '')
      } catch (err) {
        // ignore
      }
    }
    loadUser()
    return () => { mounted = false }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('')
    if (!name || !email) {
      setStatus('Name and email are required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicant_name: name, applicant_email: email, message })
      })
      const json = await res.json()
      if (json.application) {
        setMessage('')
        setStatus('Application submitted successfully')
        onApplied && onApplied()
      } else {
        setStatus(json.error || 'Unable to submit application')
      }
    } catch (err) {
      setStatus('Server error submitting application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        style={inputStyle}
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email"
        style={inputStyle}
      />
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Message to employer (optional)"
        style={{ ...inputStyle, minHeight: 100 }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <button
          type="submit"
          disabled={loading}
          style={{ background: '#f5a623', color: '#000', border: 'none', borderRadius: 10, padding: '10px 16px', fontWeight: 800, cursor: 'pointer' }}
        >
          {loading ? 'Sending…' : 'Apply now'}
        </button>
        <span style={{ color: '#aaa', fontSize: 13 }}>{status}</span>
      </div>
    </form>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#0d0d0d',
  border: '1px solid #222',
  borderRadius: 10,
  padding: 12,
  color: '#fff',
  fontSize: 13,
}
