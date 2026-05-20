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
    <div style={{ background: "url('/job.png') center / cover no-repeat, #111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 20, boxSizing: "border-box", width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Visitor Stats</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, color: "#aaa" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: 999, background: "#163b15", color: "#81d35e", fontWeight: 700 }}>Live</span>
            Real-time overview of visitors
          </div>
        </div>
        <div style={{ minWidth: 120, textAlign: "right" }}>
          <div style={{ fontSize: 13, color: "#aaa" }}>Total users</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#f5a623" }}>{stats?.userCount ?? "—"}</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 20, marginTop: 20 }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180, background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 18 }}>
            <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2 }}>Visitors online</div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#f5a623", marginTop: 6 }}>{stats?.count ?? "—"}</div>
            <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>Total visitors tracked</div>
          </div>

          <div style={{ flex: 1, minWidth: 180, background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 18, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2 }}>Today</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{stats?.todayCount ?? 0}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2 }}>This month</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{stats?.monthCount ?? 0}</div>
              </div>
            </div>
            <div style={{ height: 68, borderRadius: 16, background: "linear-gradient(180deg, rgba(245,166,35,0.16), rgba(255,255,255,0.03))", display: "flex", alignItems: "flex-end", gap: 6, padding: "10px 12px" }}>
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} style={{ flex: 1, height: `${30 + index * 8}%`, borderRadius: 999, background: "#f5a623" }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "#aaa" }}>vs yesterday</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: delta >= 0 ? "#7fd977" : "#ff7f7f", fontWeight: 700 }}>
            {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)} ({delta >= 0 ? "+" : "-"}{Math.abs(percent)}%)
          </div>
        </div>
      </div>
    </div>
  )
}
