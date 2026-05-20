import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return { dailyId: `daily-${year}-${month}-${day}`, monthlyId: `monthly-${year}-${month}` }
}

async function fetchCounts() {
  const { dailyId, monthlyId } = formatDate(new Date())
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const { dailyId: yesterdayId } = formatDate(yesterday)
  const ids = ['global', dailyId, monthlyId, yesterdayId]

  const { data } = await supabase
    .from('visitor_counts')
    .select('id, count')
    .in('id', ids)

  const rowMap = ((data || []) as Array<{ id: string; count: number }>).reduce<Record<string, number>>((acc, row) => {
    acc[row.id] = row.count
    return acc
  }, {})

  const { count: userCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true })

  return {
    count: rowMap['global'] ?? 0,
    todayCount: rowMap[dailyId] ?? 0,
    monthCount: rowMap[monthlyId] ?? 0,
    yesterdayCount: rowMap[yesterdayId] ?? 0,
    userCount: userCount ?? 0,
  }
}

export async function GET() {
  try {
    return NextResponse.json(await fetchCounts())
  } catch (err) {
    return NextResponse.json({ count: 0, todayCount: 0, monthCount: 0, yesterdayCount: 0, userCount: 0 }, { status: 500 })
  }
}

export async function POST() {
  try {
    const { dailyId, monthlyId } = formatDate(new Date())
    const counts = await fetchCounts()
    const rows = [
      { id: 'global', count: counts.count + 1 },
      { id: dailyId, count: counts.todayCount + 1 },
      { id: monthlyId, count: counts.monthCount + 1 },
    ]

    const { error } = await supabase
      .from('visitor_counts')
      .upsert(rows, { onConflict: 'id' })

    if (error) {
      return NextResponse.json({
        count: counts.count + 1,
        todayCount: counts.todayCount + 1,
        monthCount: counts.monthCount + 1,
        yesterdayCount: counts.yesterdayCount,
        userCount: counts.userCount,
      })
    }

    return NextResponse.json({
      count: rows[0].count,
      todayCount: rows[1].count,
      monthCount: rows[2].count,
      yesterdayCount: counts.yesterdayCount,
      userCount: counts.userCount,
    })
  } catch (err) {
    return NextResponse.json({ count: 0, todayCount: 0, monthCount: 0, yesterdayCount: 0, userCount: 0 }, { status: 500 })
  }
}
