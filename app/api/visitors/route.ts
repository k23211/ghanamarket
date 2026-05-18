import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('visitor_counts')
      .select('count')
      .eq('id', 'global')
      .single()

    if (error) {
      return NextResponse.json({ count: 0 })
    }

    return NextResponse.json({ count: data?.count ?? 0 })
  } catch (err) {
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}

export async function POST() {
  try {
    const { data: existing } = await supabase
      .from('visitor_counts')
      .select('count')
      .eq('id', 'global')
      .single()

    if (existing && typeof existing.count === 'number') {
      const { data, error } = await supabase
        .from('visitor_counts')
        .update({ count: existing.count + 1 })
        .eq('id', 'global')
        .select()
        .single()

      if (error) return NextResponse.json({ count: existing.count + 1 })
      return NextResponse.json({ count: data?.count ?? existing.count + 1 })
    }

    const { data, error } = await supabase
      .from('visitor_counts')
      .insert([{ id: 'global', count: 1 }])
      .select()
      .single()

    if (error) return NextResponse.json({ count: 1 })
    return NextResponse.json({ count: data?.count ?? 1 })
  } catch (err) {
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}
