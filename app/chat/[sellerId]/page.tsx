"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ChatPage() {
  const { sellerId } = useParams();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch current user, seller info, and product info
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      setCurrentUser(user);

      const { data: sellerData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sellerId)
        .single();
      setSeller(sellerData);

      if (productId) {
        const { data: productData } = await supabase
          .from("products")
          .select("id, name, price, image_url")
          .eq("id", productId)
          .single();
        setProduct(productData);
      }

      setLoading(false);
    };
    init();
  }, [sellerId, productId]);

  // Fetch messages and subscribe to realtime
  useEffect(() => {
    if (!currentUser) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${sellerId}),and(sender_id.eq.${sellerId},receiver_id.eq.${currentUser.id})`
        )
        .order("created_at", { ascending: true });
      setMessages(data || []);
    };

    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel(`chat-${currentUser.id}-${sellerId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${currentUser.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUser, sellerId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text || !currentUser) return;

    setNewMessage("");

    const { data, error } = await supabase.from("messages").insert({
      sender_id: currentUser.id,
      receiver_id: sellerId,
      product_id: productId || null,
      content: text,
    }).select().single();

    if (!error && data) {
      setMessages((prev) => [...prev, data]);
    }
  };

  if (loading) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5a623", fontWeight: 700 }}>
      Loading...
    </div>
  );

  return (
    <main style={{
      background: "#0d0d0d",
      color: "#fff",
      fontFamily: "'Segoe UI', sans-serif",
      maxWidth: 480,
      margin: "0 auto",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Header */}
      <header style={{
        background: "#111",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid #1a1a1a",
      }}>
        <a href="/chat" style={{ color: "#f5a623", fontSize: 20, textDecoration: "none" }}>←</a>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "#f5a623",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 900, fontSize: 16, color: "#000", flexShrink: 0,
        }}>
          {seller?.full_name?.[0]?.toUpperCase() || "S"}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{seller?.full_name || "Seller"}</p>
          <p style={{ margin: 0, fontSize: 11, color: "#555" }}>Tap to view profile</p>
        </div>
        <a href={`/profile/${sellerId}`} style={{ color: "#f5a623", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
          Profile →
        </a>
      </header>

      {/* Product context banner */}
      {product && (
        <div style={{
          background: "#111",
          borderBottom: "1px solid #1a1a1a",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          {product.image_url && (
            <img src={product.image_url} alt={product.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
          )}
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>Enquiring about</p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{product.name}</p>
          </div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: "#f5a623" }}>
            GH₵ {Number(product.price).toLocaleString()}
          </p>
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        paddingBottom: 90,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#333", fontSize: 13, marginTop: 60 }}>
            No messages yet. Say hello! 👋
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUser?.id;
          return (
            <div key={msg.id} style={{
              display: "flex",
              justifyContent: isMine ? "flex-end" : "flex-start",
            }}>
              <div style={{
                maxWidth: "75%",
                background: isMine ? "#f5a623" : "#1a1a1a",
                color: isMine ? "#000" : "#fff",
                borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "10px 14px",
                fontSize: 14,
                lineHeight: 1.5,
                border: isMine ? "none" : "1px solid #2a2a2a",
              }}>
                <p style={{ margin: 0 }}>{msg.content}</p>
                <p style={{
                  margin: "4px 0 0",
                  fontSize: 10,
                  color: isMine ? "rgba(0,0,0,0.5)" : "#444",
                  textAlign: "right",
                }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        background: "#111",
        borderTop: "1px solid #1a1a1a",
        padding: "12px 16px",
        display: "flex",
        gap: 10,
        boxSizing: "border-box",
        zIndex: 40,
      }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          style={{
            flex: 1,
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 24,
            padding: "11px 16px",
            color: "#fff",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            background: "#f5a623",
            border: "none",
            borderRadius: "50%",
            width: 44,
            height: 44,
            fontSize: 18,
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ➤
        </button>
      </div>
    </main>
  );
}
