"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";
import VisitorCount from "@/app/components/VisitorCount";

// ── Stars ─────────────────────────────────────────────────────────────────
const TOP_CATEGORIES = [
  { label: "Electronics", icon: "📱" },
  { label: "Fashion", icon: "👗" },
  { label: "Home", icon: "🏠" },
  { label: "Food", icon: "🍲" },
  { label: "Vehicles", icon: "🚗" },
  { label: "Beauty", icon: "💄" },
];

function Stars({ n = 0 }: { n?: number }) {
  const count = Math.max(0, Math.min(5, Math.round(n)));
  return (
    <span style={{ color: "#f5a623", fontSize: 11 }}>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }

      const { data: prods } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      setProducts(prods || []);
      setLoadingProducts(false);
    };
    init();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <main style={{
      backgroundColor: "#0d0d0d",
      color: "#fff",
      fontFamily: "'Segoe UI', sans-serif",
      maxWidth: 480,
      margin: "0 auto",
      minHeight: "100vh",
    }}>

      {/* ── Header ── */}
      <header style={{
        background: "#111",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid #1a1a1a",
      }}>
        <div style={{ flex: 1 }}>
          <div>
            <span style={{ fontWeight: 900, fontSize: 20, color: "#fff" }}>Ven</span>
            <span style={{ fontWeight: 900, fontSize: 20, color: "#f5a623" }}>doxa</span>
          </div>
          <div style={{ fontSize: 10, color: "#555", marginTop: -2 }}>Buy. Sell. Connect.</div>
        </div>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#aaa" }}>
              Hi, <strong style={{ color: "#f5a623" }}>{profile?.full_name?.split(" ")[0] || "there"}</strong>
            </span>
            <button
              onClick={handleSignOut}
              style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#aaa", fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 20, cursor: "pointer" }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <a
            href="/auth"
            style={{
              background: "linear-gradient(135deg, #f5a623, #ffd54f)",
              color: "#111",
              fontSize: 12,
              fontWeight: 800,
              padding: "10px 18px",
              borderRadius: 22,
              textDecoration: "none",
              boxShadow: "0 16px 30px rgba(245, 166, 35, 0.18)",
            }}
          >
            Sign In
          </a>
        )}
      </header>

      {/* ── Hero Banner ── */}
      <section style={{ position: "relative", height: 320, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(13,13,13,0.95) 100%)",
        }} />
        <div style={{ position: "absolute", bottom: 28, left: 20, right: 20, zIndex: 2 }}>
          <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, lineHeight: 1.2 }}>
            Agriquex: <span style={{ color: "#f5a623" }}>Trusted</span><br />Marketplace
          </h1>
          <p style={{ margin: 0, color: "#aaa", fontSize: 13 }}>
            Buy and sell with confidence across Ghana
          </p>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section style={{ background: "#111", padding: "14px 16px", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {[
            { icon: "🛡️", label: "Secure Pay" },
            { icon: "🚚", label: "Fast Delivery" },
            { icon: "🏅", label: "Quality" },
            { icon: "🎧", label: "24/7 Support", action: true },
          ].map(f => (
            <button
              key={f.label}
              type="button"
              onClick={() => {
                if (f.action) {
                  window.dispatchEvent(new Event('openAgriquexHelp'));
                }
              }}
              style={{
                textAlign: "center",
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: f.action ? 'pointer' : 'default',
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>{f.icon}</div>
              <p style={{ fontSize: 9, color: f.action ? '#f5a623' : '#666', margin: 0 }}>{f.label}</p>
            </button>
          ))}
        </div>
      </section>

      <section style={{ background: "#111", padding: "16px", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Top categories</h2>
          <a href="/products" style={{ color: "#f5a623", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Browse all</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
          {TOP_CATEGORIES.map(cat => (
            <a
              key={cat.label}
              href="/products"
              style={{
                display: "block",
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18,
                padding: "16px 10px",
                textAlign: "center",
                color: "#fff",
                textDecoration: "none",
                boxShadow: "0 18px 40px rgba(0,0,0,0.14)",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{cat.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{cat.label}</div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ padding: "16px 16px", marginTop: 12 }}>
        <VisitorCount />
      </section>

      {/* ── Latest Products ── */}
      <section style={{ padding: "20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Latest Products</h2>
          <a href="/products" style={{ color: "#f5a623", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            View all →
          </a>
        </div>

        {loadingProducts ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#f5a623", fontWeight: 700 }}>
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div style={{
            background: "#111",
            borderRadius: 16,
            padding: "40px 20px",
            textAlign: "center",
            border: "1px dashed #2a2a2a",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
            <p style={{ color: "#555", fontSize: 14, margin: "0 0 16px" }}>No products yet</p>
            {user && (
              <a
                href="/seller/dashboard"
                style={{ background: "#f5a623", color: "#000", fontWeight: 800, fontSize: 13, padding: "10px 22px", borderRadius: 20, textDecoration: "none" }}
              >
                + Add a Product
              </a>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {products.map(product => (
              <a
                key={product.id}
                href={`/products/${product.id}`}
                style={{
                  background: "#111",
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid #1e1e1e",
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  cursor: "pointer",
                  transition: "transform 0.2s, border-color 0.2s",
                  boxShadow: "0 18px 42px rgba(0,0,0,0.18)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#f5a623";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#1e1e1e";
                }}
              >
                <div style={{ height: 140, background: "#1a1a1a", position: "relative" }}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                      🛍️
                    </div>
                  )}
                  {product.category && (
                    <span style={{
                      position: "absolute", top: 8, left: 8,
                      background: "rgba(0,0,0,0.6)", color: "#f5a623",
                      fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 10,
                    }}>
                      {product.category}
                    </span>
                  )}
                </div>
                <div style={{ padding: "10px 10px 12px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#eee", lineHeight: 1.3 }}>
                    {product.name}
                  </p>
                  <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 900, color: "#f5a623" }}>
                    GH₵ {Number(product.price).toLocaleString()}
                  </p>
                  {product.rating != null ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <Stars n={Number(product.rating)} />
                      <span style={{ fontSize: 10, color: "#aaa" }}>
                        {Number(product.rating).toFixed(1)}
                        {product.review_count ? ` · ${product.review_count} reviews` : ""}
                      </span>
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: 10, color: "#666" }}>No rating yet</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* ── Join CTA (only shown to non-logged-in users) ── */}
      {!user && (
        <section style={{ margin: "0 16px 24px" }}>
          <div style={{
            background: "linear-gradient(135deg, #1a1200, #2a1f00)",
            border: "1px solid #3a2c00",
            borderRadius: 16,
            padding: "20px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}>
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 14 }}>Start Selling Today</p>
              <p style={{ margin: 0, color: "#888", fontSize: 12 }}>Join thousands of sellers across Ghana</p>
            </div>
            <a
              href="/auth"
              style={{
                flexShrink: 0,
                background: "linear-gradient(135deg, #f5a623, #ffc95e)",
                color: "#111",
                fontWeight: 800,
                fontSize: 12,
                padding: "10px 18px",
                borderRadius: 24,
                textDecoration: "none",
                boxShadow: "0 18px 32px rgba(245, 166, 35, 0.2)",
              }}
            >
              Join Now
            </a>
          </div>
        </section>
      )}

      <div style={{ paddingBottom: 100 }} />
      <BottomNav />
    </main>
  );
}
