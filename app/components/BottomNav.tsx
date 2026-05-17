"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const tabs = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/products", icon: "🛍️", label: "Browse" },
  { href: "/seller/dashboard", icon: "➕", label: "Sell" },
  { href: "/chat", icon: "💬", label: "Chats" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("read", false);

      setUnread(count || 0);
    };

    fetchUnread();

    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const filter = "receiver_id=eq." + user.id;

      const channel = supabase
        .channel("unread-badge")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: filter },
          () => setUnread(prev => prev + 1)
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    };

    setup();
  }, []);

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
        const active = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
        const isChat = tab.href === "/chat";
        return (
          <a key={tab.href} href={tab.href} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            textDecoration: "none",
            color: active ? "#f5a623" : "#555",
            position: "relative",
          }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 9, fontWeight: active ? 700 : 400 }}>
              {tab.label}
            </span>

            {isChat && unread > 0 && (
              <span style={{
                position: "absolute",
                top: -2,
                right: -6,
                background: "#f5a623",
                color: "#000",
                borderRadius: "50%",
                width: 16,
                height: 16,
                fontSize: 9,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}