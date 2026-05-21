"use client"

import { useEffect, useState } from "react"

type VisitorStats = {
  count: number
  todayCount: number
  monthCount: number
  yesterdayCount: number
  userCount: number
}

export default function VisitorCount({ compact }: { compact?: boolean }) {
  const [stats, setStats] = useState<VisitorStats | null>(null)

  useEffect(() => {
    let mounted = true
    const inc = async () => {
      try {
        const res = await fetch("/api/visitors", { method: "POST" })
        const json = await res.json()
        if (!mounted) return

        setStats({
          count: typeof json.count === "number" ? json.count : 0,
          todayCount: typeof json.todayCount === "number" ? json.todayCount : 0,
          monthCount: typeof json.monthCount === "number" ? json.monthCount : 0,
          yesterdayCount: typeof json.yesterdayCount === "number" ? json.yesterdayCount : 0,
          userCount: typeof json.userCount === "number" ? json.userCount : 0,
        })
      } catch (e) {
        console.error("VisitorCount error", e)
      }
    }
    inc()
    return () => { mounted = false }
  }, [])

  const delta = stats ? stats.count - stats.yesterdayCount : 0
  const percent = stats ? Math.round((delta / Math.max(stats.yesterdayCount, 1)) * 100) : 0

  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#f5a623", lineHeight: 1 }}>{stats?.count ?? "—"}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span style={{ fontSize: 11, color: "#bbb" }}>{stats?.userCount != null ? `${stats.userCount} users` : "users"}</span>
          <span style={{ fontSize: 10, color: "#888" }}>visitors</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: "url('/job.png') center / cover no-repeat, rgba(17,17,17,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 16, boxSizing: "border-box", width: "100%", maxWidth: 420, margin: "0 auto", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Visitor Stats</div>
          <div style={{ color: "#bbb", fontSize: 11, lineHeight: 1.4, maxWidth: 240 }}>
            Real-time visitors and traffic insights across your store.
          </div>
        </div>
        <div style={{ textAlign: "right", minWidth: 100 }}>
          <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Users</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#f5a623" }}>{stats?.userCount ?? "—"}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginTop: 16 }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 12 }}>
          <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2 }}>Online</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#f5a623", marginTop: 6 }}>{stats?.count ?? "—"}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 12 }}>
          <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2 }}>Today</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginTop: 6 }}>{stats?.todayCount ?? 0}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 12 }}>
          <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2 }}>This month</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginTop: 6 }}>{stats?.monthCount ?? 0}</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <div style={{ fontSize: 11, color: "#bbb" }}>vs yesterday</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: delta >= 0 ? "#7fd977" : "#ff7f7f", fontWeight: 700 }}>
          {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)} ({delta >= 0 ? "+" : "-"}{Math.abs(percent)}%)
        </div>
      </div>
    </div>
  )
}
