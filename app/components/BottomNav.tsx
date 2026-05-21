"use client";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/products", icon: "🛍️", label: "Browse" },
  { href: "/seller/dashboard", icon: "➕", label: "Sell" },
  { href: "/account", icon: "👤", label: "Account" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 520,
      background: "rgba(10, 10, 10, 0.96)",
      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 -18px 42px rgba(0, 0, 0, 0.35)",
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      padding: "12px 14px 18px",
      zIndex: 50,
      backdropFilter: "blur(18px)",
    }}>
      {tabs.map(tab => {
        const active = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
        return (
          <a
            key={tab.href}
            href={tab.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              minWidth: 68,
              flex: 1,
              padding: "10px 10px",
              borderRadius: 20,
              textDecoration: "none",
              color: active ? "#f5a623" : "#d1d5db",
              background: active ? "rgba(245, 166, 35, 0.15)" : "rgba(255,255,255,0.02)",
              boxShadow: active ? "0 16px 30px rgba(245, 166, 35, 0.16)" : "0 0 0 rgba(0,0,0,0)",
              transition: "transform 180ms ease, background 180ms ease, color 180ms ease, box-shadow 180ms ease",
            }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>
              {tab.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
