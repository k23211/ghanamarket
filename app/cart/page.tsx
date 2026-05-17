"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      setUser(user);

      const { data } = await supabase
        .from("cart_items")
        .select("*, products(*)")
        .eq("user_id", user.id);

      setCartItems(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const removeItem = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.products?.price || 0) * item.quantity;
  }, 0);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d" }}>
      <p style={{ color: "#f5a623", fontWeight: 700 }}>Loading...</p>
    </div>
  );

  return (
    <main style={{ backgroundColor: "#0d0d0d", color: "#fff", fontFamily: "'Segoe UI', sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>

      {/* Header */}
      <header style={{ background: "#111", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 40, borderBottom: "1px solid #1e1e1e" }}>
        <a href="/" style={{ color: "#fff", fontSize: 20, textDecoration: "none" }}>←</a>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 900, fontSize: 17, color: "#fff" }}>Ghana</span>
          <span style={{ fontWeight: 900, fontSize: 17, color: "#f5a623" }}>Market</span>
        </div>
        <a href="/products" style={{ color: "#f5a623", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Continue Shopping →
        </a>
      </header>

      <div style={{ padding: "20px 16px" }}>
        <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 900 }}>My Cart 🛒</h2>

        {cartItems.length === 0 ? (
          <div style={{ background: "#111", borderRadius: 20, padding: 40, textAlign: "center", border: "1px solid #1e1e1e" }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>🛒</p>
            <p style={{ color: "#555", marginBottom: 16 }}>Your cart is empty</p>
            <a href="/products" style={{ display: "inline-block", background: "#f5a623", color: "#000", padding: "10px 24px", borderRadius: 24, fontWeight: 800, textDecoration: "none" }}>
              Shop Now
            </a>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ background: "#111", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 14, border: "1px solid #1e1e1e" }}>
                  <div style={{ background: "#1a1a1a", borderRadius: 12, width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                    🛍️
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 14, color: "#eee" }}>{item.products?.name}</p>
                    <p style={{ margin: "0 0 3px", color: "#f5a623", fontWeight: 900, fontSize: 15 }}>GH₵ {item.products?.price}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#555" }}>Qty: {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ background: "rgba(231,76,60,0.15)", border: "none", color: "#e74c3c", fontWeight: 700, fontSize: 12, padding: "6px 12px", borderRadius: 20, cursor: "pointer" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: "#111", borderRadius: 20, padding: 20, border: "1px solid #1e1e1e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <p style={{ color: "#aaa", fontWeight: 500, margin: 0 }}>Total</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: "#f5a623", margin: 0 }}>GH₵ {total}</p>
              </div>
              <a href="/checkout" style={{ display: "block", width: "100%", background: "#f5a623", color: "#000", fontWeight: 800, padding: "14px 0", borderRadius: 14, textAlign: "center", textDecoration: "none", fontSize: 15 }}>
                Proceed to Checkout →
              </a>
            </div>
          </>
        )}
      </div>

      <div style={{ paddingBottom: 80 }} />
      <BottomNav />
    </main>
  );
}
