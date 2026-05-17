"use client";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { icon: "🏠", label: "Home",       href: "/" },
    { icon: "⊞", label: "Categories", href: "/categories" },
    { icon: null, label: "Sell",       href: "/seller/dashboard", isCta: true },
    { icon: "💬", label: "Messages",   href: "#" },
    { icon: "👤", label: "Profile",    href: "#" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

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
      padding: "10px 0 18px",
      zIndex: 100,
    }}>
      {items.map(item => (
        <a
          key={item.label}
          href={item.href}
          style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
        >
          {item.isCta ? (
            <div style={{
              background: "#f5a623",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              marginTop: -20,
              boxShadow: "0 0 0 4px #0d0d0d",
              color: "#000",
              fontWeight: 900,
            }}>＋</div>
          ) : (
            <span style={{ fontSize: 22 }}>{item.icon}</span>
          )}
          <span style={{
            fontSize: 10,
            color: isActive(item.href) ? "#f5a623" : "#555",
            fontWeight: isActive(item.href) ? 700 : 400,
          }}>
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
}