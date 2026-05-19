import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params
    const id = resolved.id
    const { data, error } = await supabase
      .from('job_applications')
      .select('id, applicant_name, applicant_email, message, created_at')
      .eq('job_id', id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) return NextResponse.json({ applications: [] })
    return NextResponse.json({ applications: data || [] })
  } catch (err) {
    return NextResponse.json({ applications: [] }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolved = await params
    const id = resolved.id
    const body = await request.json()
    const { applicant_name, applicant_email, message } = body

    if (!applicant_name || !applicant_email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const payload = {
      job_id: id,
      applicant_name,
      applicant_email,
      message: message || null,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('job_applications').insert([payload]).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ application: data })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
