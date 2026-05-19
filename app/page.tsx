"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";
import VisitorCount from "@/app/components/VisitorCount";

// ── Stars ─────────────────────────────────────────────────────────────────
function Stars({ n = 5 }: { n?: number }) {
  return (
    <span style={{ color: "#f5a623", fontSize: 11 }}>
      {"★".repeat(Math.min(n, 5))}{"☆".repeat(Math.max(0, 5 - n))}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [jobSearch, setJobSearch] = useState('');
  const [jobCategory, setJobCategory] = useState('All');

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
            <span style={{ fontWeight: 900, fontSize: 20, color: "#fff" }}>Ghana</span>
            <span style={{ fontWeight: 900, fontSize: 20, color: "#f5a623" }}>Market</span>
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
            style={{ background: "#f5a623", color: "#000", fontSize: 12, fontWeight: 800, padding: "7px 16px", borderRadius: 20, textDecoration: "none" }}
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
            Ghana's <span style={{ color: "#f5a623" }}>Trusted</span><br />Marketplace
          </h1>
          <p style={{ margin: 0, color: "#aaa", fontSize: 13 }}>
            Buy and sell with confidence across Ghana
          </p>
        </div>
      </section>

      {/* ── Job Section ── */}
      <section style={{ marginTop: 16, padding: "0 16px" }}>
        <div style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 24,
          minHeight: 260,
          backgroundImage: "url('/job.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)" }} />
          <div style={{ position: "relative", zIndex: 2, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12, color: "#f5a623", fontSize: 12, fontWeight: 700 }}>
                <span style={{ width: 22, height: 22, borderRadius: 999, background: "rgba(245,166,35,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>💼</span>
                Jobs for Everyone
              </div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>Find your next opportunity with GhanaMarket Jobs</h2>
              <p style={{ margin: "12px 0 0", color: "#ddd", fontSize: 13, maxWidth: 380 }}>Explore verified roles across Ghana, from field work to tech, healthcare, and more.</p>
            </div>
            <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: "12px 14px", alignItems: "center" }}>
                <input
                  value={jobSearch}
                  onChange={e => setJobSearch(e.target.value)}
                  type="text"
                  placeholder="Search jobs by title, company or keyword..."
                  style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 13 }}
                />
                <button
                  type="button"
                  onClick={() => router.push(`/jobs?search=${encodeURIComponent(jobSearch)}&type=${encodeURIComponent(jobCategory)}`)}
                  style={{ background: "#f5a623", color: "#000", border: "none", borderRadius: 14, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}
                >
                  Search
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["All", "Full-time", "Part-time", "Contract", "Internship"].map(label => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setJobCategory(label)
                      router.push(`/jobs?search=${encodeURIComponent(jobSearch)}&type=${encodeURIComponent(label)}`)
                    }}
                    style={{
                      background: jobCategory === label ? "#f5a623" : "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 14,
                      color: jobCategory === label ? "#000" : "#fff",
                      fontSize: 12,
                      padding: "10px 14px",
                      cursor: "pointer"
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section style={{ background: "#111", padding: "14px 16px", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {[
            { icon: "🛡️", label: "Secure Pay" },
            { icon: "🚚", label: "Fast Delivery" },
            { icon: "🏅", label: "Quality" },
            { icon: "🎧", label: "24/7 Support" },
          ].map(f => (
            <div key={f.label} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{f.icon}</div>
              <p style={{ fontSize: 9, color: "#666", margin: 0 }}>{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "20px 16px", marginTop: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, background: 'linear-gradient(180deg, #151212 0%, #0d0d0d 100%)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 24, padding: 20, boxShadow: '0 20px 45px rgba(0,0,0,0.17)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#fff' }}>Visitor Stats</p>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: '#ccc' }}>See total, daily, and monthly visits at a glance.</p>
            </div>
            <div style={{ color: '#f5a623', fontSize: 11, fontWeight: 700 }}>Live updates on each page load</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: 16, background: '#0b0b0b', borderRadius: 20, border: '1px solid rgba(255,255,255,0.04)' }}>
            <VisitorCount />
          </div>
        </div>
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
              <div key={product.id} style={{
                background: "#111",
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid #1e1e1e",
              }}>
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
                  <Stars />
                </div>
              </div>
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
              style={{ flexShrink: 0, background: "#f5a623", color: "#000", fontWeight: 800, fontSize: 12, padding: "10px 16px", borderRadius: 20, textDecoration: "none" }}
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
