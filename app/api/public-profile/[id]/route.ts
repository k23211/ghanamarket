import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(request: Request) {
  const url = new URL(request.url)
  const match = url.pathname.match(/\/api\/public-profile\/([^\/]+)/)
  const sellerId = match?.[1]

  if (!sellerId) {
    return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, location, avatar_url, created_at')
    .eq('id', sellerId)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
