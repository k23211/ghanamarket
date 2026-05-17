"use client";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/products", icon: "🛍️", label: "Browse" },
  { href: "/seller/dashboard", icon: "➕", label: "Sell" },
  { href: "/profile", icon: "👤", label: "Profile" },
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
      maxWidth: 480,
      background: "#111",
      borderTop: "1px solid #1e1e1e",
      display: "flex",
      justifyContent: "space-around",
      padding: "10px 0 20px",
      zIndex: 50,
    }}>
      {tabs.map(tab => {
        const active = pathname === tab.href;
        return (
          <a key={tab.href} href={tab.href} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            textDecoration: "none",
            color: active ? "#f5a623" : "#555",
          }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 9, fontWeight: active ? 700 : 400 }}>
              {tab.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}