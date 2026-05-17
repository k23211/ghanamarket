"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

// ── Data ────────────────────────────────────────────────────────────────────

const categories = [
  { label: "Electronics", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80" },
  { label: "Fashion",     img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e74?w=120&q=80" },
  { label: "Home & Living", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=80" },
  { label: "Beauty",      img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&q=80" },
  { label: "Groceries",   img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&q=80" },
];

const features = [
  { icon: "🛡️", label: "Secure\nPayments" },
  { icon: "🚚", label: "Fast\nDelivery" },
  { icon: "🏅", label: "Quality\nProducts" },
  { icon: "🎧", label: "24/7\nSupport" },
  { icon: "⭐", label: "Top Deals\nEveryday" },
];

const featuredProducts = [
  { name: "iPhone 14 Pro Max",      price: "GH₵ 8,999", rating: 4.8, reviews: 128, img: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=200&q=80" },
  { name: "Samsung Galaxy Watch 6", price: "GH₵ 1,850", rating: 4.6, reviews: 89,  img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&q=80" },
  { name: "Nike Air Force 1 '07",   price: "GH₵ 850",   rating: 4.7, reviews: 96,  img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80" },
  { name: "Dior Sauvage Parfum",    price: "GH₵ 1,200", rating: 4.9, reviews: 72,  img: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&q=80" },
];

// ── Countdown hook ────────────────────────────────────────────────────────

function useCountdown(targetHours = 8, targetMins = 45, targetSecs = 32) {
  const total = useRef(targetHours * 3600 + targetMins * 60 + targetSecs);
  const [time, setTime] = useState(total.current);
  useEffect(() => {
    const id = setInterval(() => setTime(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(time / 3600)).padStart(2, "0");
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");
  return { h, m, s };
}

// ── Stars ────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-xs">
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
}

// ── Main component ───────────────────────────────────────────────────────

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const { h, m, s } = useCountdown();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const toggleWish = (i: number) =>
    setWishlist(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  return (
    <main
      style={{ backgroundColor: "#0d0d0d", color: "#fff", fontFamily: "'Segoe UI', sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}
    >

      {/* ── Top Bar ── */}
      <header style={{ backgroundColor: "#111", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        {/* Hamburger */}
        <button style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", padding: 0 }}>☰</button>

        {/* Logo */}
        <div style={{ marginRight: 8 }}>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>Ghana</span>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#f5a623" }}>Market</span>
          <div style={{ fontSize: 10, color: "#888", marginTop: -2 }}>Buy. Sell. Connect.</div>
        </div>

        {/* Search */}
        <div style={{ flex: 1, background: "#1e1e1e", borderRadius: 24, display: "flex", alignItems: "center", padding: "8px 12px", gap: 6 }}>
          <span style={{ color: "#888", fontSize: 14 }}>🔍</span>
          <span style={{ color: "#555", fontSize: 13 }}>Search for products...</span>
        </div>

        {/* Bell */}
        <div style={{ position: "relative", marginLeft: 6 }}>
          <span style={{ fontSize: 20 }}>🔔</span>
          <span style={{ position: "absolute", top: -4, right: -4, background: "#f5a623", color: "#000", fontSize: 9, fontWeight: 900, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
        </div>

        {/* Cart */}
        <span style={{ fontSize: 20, marginLeft: 6 }}>🛒</span>
      </header>

      {/* ── Delivery + Wallet ── */}
      <div style={{ background: "#111", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#ccc" }}>
          <span>📍</span>
          <span>Deliver to: <strong style={{ color: "#fff" }}>Accra, Ghana</strong> ▾</span>
        </div>
        <button style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "6px 14px", color: "#f5a623", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
          💰 Wallet
        </button>
      </div>

      {/* ── Hero Banner ── */}
      <section style={{ position: "relative", height: 260, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('/hero-bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "brightness(0.75)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.75) 45%, transparent)" }} />

        <div style={{ position: "relative", zIndex: 2, padding: "32px 20px" }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, lineHeight: 1.2, color: "#fff" }}>
            Ghana's<br />
            <span style={{ color: "#f5a623" }}>Trusted<br />Marketplace</span>
          </h2>
          <p style={{ color: "#ccc", fontSize: 13, margin: "8px 0 16px" }}>Everything you need,<br />from trusted sellers.</p>
          <a
            href="/products"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f5a623", color: "#000", fontWeight: 800, fontSize: 14, padding: "10px 22px", borderRadius: 24, textDecoration: "none" }}
          >
            Shop Now →
          </a>
        </div>

        <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 2 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: i === 0 ? 20 : 6, height: 6, borderRadius: 3, background: i === 0 ? "#f5a623" : "#555" }} />
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ background: "#111", padding: "16px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {features.map(f => (
            <div key={f.label} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ background: "#1a1a1a", borderRadius: 12, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 6px" }}>{f.icon}</div>
              <p style={{ fontSize: 10, color: "#ccc", margin: 0, lineHeight: 1.3, whiteSpace: "pre-line" }}>{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shop by Category ── */}
      <section style={{ padding: "16px 16px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Shop by Category</h3>
          <a href="/products" style={{ color: "#f5a623", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>View all →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {categories.map(cat => (
            <a key={cat.label} href={`/products?category=${cat.label.toLowerCase()}`} style={{ textDecoration: "none", textAlign: "center" }}>
              <div style={{ background: "#1a1a1a", borderRadius: 12, overflow: "hidden", height: 64, marginBottom: 5 }}>
                <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <p style={{ fontSize: 10, color: "#ccc", margin: 0 }}>{cat.label}</p>
            </a>
          ))}
          <div style={{ textAlign: "center" }}>
            <div style={{ background: "#1a1a1a", borderRadius: 12, height: 64, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
              <span style={{ fontSize: 22 }}>⊞</span>
            </div>
            <p style={{ fontSize: 10, color: "#ccc", margin: 0 }}>More</p>
          </div>
        </div>
      </section>

      {/* ── Deals of the Day ── */}
      <section style={{ margin: "12px 16px", background: "#0f2818", borderRadius: 16, padding: 16, border: "1px solid #1a3a20" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <span style={{ fontWeight: 800, fontSize: 15 }}>Deals of the Day</span>
            </div>
            <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 14px" }}>Limited time offers. Don't miss out!</p>
            <a href="/products?deals=true" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f5a623", color: "#000", fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 24, textDecoration: "none" }}>
              See All Deals →
            </a>
          </div>

          <div style={{ textAlign: "center", minWidth: 140 }}>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 8 }}>
              <span style={{ position: "absolute", top: 0, left: 0, background: "#f5a623", color: "#000", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 6 }}>-28%</span>
              <div style={{ background: "#1a1a1a", borderRadius: 12, border: "1px dashed #333", padding: "10px 14px" }}>
                <img src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&q=80" alt="AirPods" style={{ width: 70, height: 70, objectFit: "contain" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 6 }}>
              {[{ v: h, l: "HRS" }, { v: m, l: "MINS" }, { v: s, l: "SECS" }].map(({ v, l }) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ background: "#111", borderRadius: 6, padding: "4px 6px", fontWeight: 900, fontSize: 14, minWidth: 30 }}>{v}</div>
                  <div style={{ fontSize: 8, color: "#666", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 12 }}>Apple AirPods Pro<br />(2nd Generation)</p>
            <p style={{ color: "#f5a623", fontWeight: 900, fontSize: 14, margin: "4px 0 2px" }}>GH₵ 1,299</p>
            <p style={{ color: "#555", fontSize: 11, margin: 0, textDecoration: "line-through" }}>GH₵ 1,799</p>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{ padding: "8px 16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Featured Products</h3>
          <a href="/products" style={{ color: "#f5a623", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>View all →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {featuredProducts.map((p, i) => (
            <div key={p.name} style={{ background: "#111", borderRadius: 14, overflow: "hidden", border: "1px solid #1e1e1e" }}>
              <div style={{ position: "relative", background: "#1a1a1a", height: 140 }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  onClick={() => toggleWish(i)}
                  style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 28, height: 28, fontSize: 14, cursor: "pointer", color: wishlist.has(i) ? "#e74c3c" : "#aaa" }}
                >
                  {wishlist.has(i) ? "♥" : "♡"}
                </button>
              </div>
              <div style={{ padding: "10px 10px 12px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#eee", lineHeight: 1.3 }}>{p.name}</p>
                <p style={{ margin: "0 0 5px", fontSize: 14, fontWeight: 900, color: "#f5a623" }}>{p.price}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Stars rating={p.rating} />
                  <span style={{ fontSize: 11, color: "#666" }}>({p.reviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Padding so content doesn't hide behind BottomNav */}
      <div style={{ paddingBottom: 80 }} />
      <BottomNav />

    </main>
  );
}
