"use client";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/products", icon: "🛍️", label: "Browse" },
  { href: "/jobs", icon: "💼", label: "Jobs" },
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
      background: "rgba(17, 17, 17, 0.97)",
      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 -14px 30px rgba(0, 0, 0, 0.35)",
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      padding: "12px 14px 18px",
      zIndex: 50,
      backdropFilter: "blur(16px)",
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
              padding: "10px 8px",
              borderRadius: 18,
              textDecoration: "none",
              color: active ? "#f5a623" : "#cfd2dc",
              background: active ? "rgba(245, 166, 35, 0.12)" : "transparent",
              boxShadow: active ? "0 12px 24px rgba(245, 166, 35, 0.14)" : "none",
              transition: "transform 150ms ease, background 150ms ease, color 150ms ease, box-shadow 150ms ease",
            }}>
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>
              {tab.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
