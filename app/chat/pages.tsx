"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

export default function ChatListPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      setCurrentUser(user);

      // Get all messages involving this user
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!msgs) { setLoading(false); return; }

      // Group by conversation partner (deduplicate)
      const seen = new Set<string>();
      const unique: any[] = [];
      for (const msg of msgs) {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!seen.has(partnerId)) {
          seen.add(partnerId);
          unique.push({ ...msg, partnerId });
        }
      }

      // Fetch partner profiles
      const partnerIds = unique.map(c => c.partnerId);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", partnerIds);

      const profileMap: Record<string, any> = {};
      profiles?.forEach(p => { profileMap[p.id] = p; });

      // Count unread per partner
      const { data: unread } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("receiver_id", user.id);

      const unreadCount: Record<string, number> = {};
      unread?.forEach(m => {
        unreadCount[m.sender_id] = (unreadCount[m.sender_id] || 0) + 1;
      });

      setConversations(unique.map(c => ({
        ...c,
        partner: profileMap[c.partnerId] || { full_name: "Unknown" },
        unread: unreadCount[c.partnerId] || 0,
      })));

      setLoading(false);
    };
    init();
  }, []);

  return (
    <main style={{
      background: "#0d0d0d",
      color: "#fff",
      fontFamily: "'Segoe UI', sans-serif",
      maxWidth: 480,
      margin: "0 auto",
      minHeight: "100vh",
    }}>

      {/* Header */}
      <header style={{
        background: "#111",
        padding: "14px 16px",
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid #1a1a1a",
      }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>
          <span style={{ color: "#fff" }}>My </span>
          <span style={{ color: "#f5a623" }}>Chats</span>
        </h1>
      </header>

      {/* List */}
      <div style={{ padding: "8px 0", paddingBottom: 80 }}>
        {loading && (
          <div style={{ textAlign: "center", color: "#f5a623", fontWeight: 700, marginTop: 80 }}>Loading...</div>
        )}

        {!loading && conversations.length === 0 && (
          <div style={{ textAlign: "center", color: "#333", fontSize: 14, marginTop: 80 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            No conversations yet.<br />Browse products and chat with sellers!
          </div>
        )}

        {conversations.map((convo) => (
          <a
            key={convo.partnerId}
            href={`/chat/${convo.partnerId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              borderBottom: "1px solid #111",
              background: convo.unread > 0 ? "rgba(245,166,35,0.04)" : "transparent",
              transition: "background 0.2s",
            }}>
              {/* Avatar */}
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#f5a623",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 18, color: "#000", flexShrink: 0,
              }}>
                {convo.partner.full_name?.[0]?.toUpperCase() || "?"}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: "0 0 3px",
                  fontWeight: convo.unread > 0 ? 800 : 600,
                  fontSize: 15,
                  color: convo.unread > 0 ? "#fff" : "#ccc",
                }}>
                  {convo.partner.full_name || "Unknown"}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: 13,
                  color: convo.unread > 0 ? "#aaa" : "#444",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {convo.sender_id === currentUser?.id ? "You: " : ""}{convo.content}
                </p>
              </div>

              {/* Time + unread badge */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: "#444" }}>
                  {new Date(convo.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                {convo.unread > 0 && (
                  <span style={{
                    background: "#f5a623",
                    color: "#000",
                    borderRadius: "50%",
                    width: 20, height: 20,
                    fontSize: 11, fontWeight: 900,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {convo.unread}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}
