"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

// ── Category data ────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "All",          icon: "⊞",  img: null },
  { label: "Electronics",  icon: "🎧", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80" },
  { label: "Fashion",      icon: "👗", img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e74?w=120&q=80" },
  { label: "Home & Living",icon: "🛋️", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=80" },
  { label: "Beauty",       icon: "💄", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&q=80" },
  { label: "Groceries",    icon: "🧺", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&q=80" },
  { label: "Food",         icon: "🍲", img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&q=80" },
  { label: "Jewelry",      icon: "💎", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=120&q=80" },
  { label: "Crafts",       icon: "🏺", img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=120&q=80" },
  { label: "Other",        icon: "📦", img: null },
];

// ── Stars ────────────────────────────────────────────────────────────────
function Stars({ n = 5 }: { n?: number }) {
  return (
    <span style={{ color: "#f5a623", fontSize: 11 }}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const [products, setProducts]   = useState<any[]>([]);
  const [filtered, setFiltered]   = useState<any[]>([]);
  const [user, setUser]           = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("All");
  const [wishlist, setWishlist]   = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const { data } = await supabase.from("products").select("*");
      setProducts(data || []);
      setFiltered(data || []);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let r = products;
    if (category !== "All") r = r.filter(p => p.category === category);
    if (search) r = r.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(r);
  }, [search, category, products]);

  const toggleWish = (id: string) =>
    setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const addToCart = async (productId: string) => {
    if (!user) { window.location.href = "/auth"; return; }
    await supabase.from("cart_items").insert({ user_id: user.id, product_id: productId, quantity: 1 });
    window.location.href = "/cart";
  };

  return (
    <main style={{ backgroundColor: "#0d0d0d", color: "#fff", fontFamily: "'Segoe UI', sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>

      {/* Header */}
      <header style={{ background: "#111", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 40 }}>
        <a href="/" style={{ color: "#fff", fontSize: 20, textDecoration: "none" }}>←</a>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 900, fontSize: 17, color: "#fff" }}>Ghana</span>
          <span style={{ fontWeight: 900, fontSize: 17, color: "#f5a623" }}>Market</span>
        </div>
        <a href="/cart" style={{ fontSize: 20, textDecoration: "none" }}>🛒</a>
        {user ? (
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
            style={{ background: "#e74c3c", border: "none", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 20, cursor: "pointer" }}>
            Sign Out
          </button>
        ) : (
          <a href="/auth" style={{ background: "#f5a623", color: "#000", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 20, textDecoration: "none" }}>Sign In</a>
        )}
      </header>

      {/* Search bar */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ background: "#1a1a1a", borderRadius: 24, display: "flex", alignItems: "center", padding: "10px 14px", gap: 8 }}>
          <span style={{ color: "#666", fontSize: 15 }}>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, flex: 1 }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#666", fontSize: 16, cursor: "pointer" }}>✕</button>
          )}
        </div>
      </div>

      {/* Category grid */}
      <section style={{ padding: "16px 16px 8px" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800 }}>Shop by Category</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {CATEGORIES.map(cat => {
            const active = category === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setCategory(cat.label)}
                style={{
                  background: active ? "#f5a623" : "#1a1a1a",
                  border: active ? "none" : "1px solid #2a2a2a",
                  borderRadius: 12,
                  padding: "6px 4px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.2s",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", background: active ? "rgba(0,0,0,0.2)" : "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cat.img ? (
                    <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 22 }}>{cat.icon}</span>
                  )}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: active ? "#000" : "#aaa", textAlign: "center", lineHeight: 1.2 }}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div style={{ margin: "8px 16px", borderTop: "1px solid #1e1e1e" }} />

      {/* Results header */}
      <div style={{ padding: "4px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>
          {category === "All" ? "All Products" : category}
          <span style={{ color: "#555", fontWeight: 400, fontSize: 13 }}> ({filtered.length})</span>
        </h3>
        <button style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 20, padding: "5px 12px", color: "#aaa", fontSize: 11, cursor: "pointer" }}>
          Sort ▾
        </button>
      </div>

      {/* Products grid */}
      <section style={{ padding: "0 16px 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#f5a623", fontWeight: 700 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ color: "#555", fontSize: 14 }}>No products found</p>
            <button onClick={() => { setCategory("All"); setSearch(""); }}
              style={{ marginTop: 12, background: "#f5a623", color: "#000", border: "none", borderRadius: 20, padding: "8px 20px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {filtered.map(product => (
              <div key={product.id} style={{ background: "#111", borderRadius: 14, overflow: "hidden", border: "1px solid #1e1e1e" }}>
                <div style={{ position: "relative", height: 140, background: "#1a1a1a" }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🛍️</div>
                  )}
                  <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.6)", color: "#f5a623", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 10 }}>
                    {product.category}
                  </span>
                  <button onClick={() => toggleWish(product.id)}
                    style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 28, height: 28, fontSize: 13, cursor: "pointer", color: wishlist.has(product.id) ? "#e74c3c" : "#aaa" }}>
                    {wishlist.has(product.id) ? "♥" : "♡"}
                  </button>
                </div>

                <div style={{ padding: "10px 10px 12px" }}>
                  <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 600, color: "#eee", lineHeight: 1.3 }}>{product.name}</p>
                  {product.description && (
                    <p style={{ margin: "0 0 5px", fontSize: 10, color: "#555", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                      {product.description}
                    </p>
                  )}
                  <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 900, color: "#f5a623" }}>GH₵ {product.price}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                    <Stars />
                    <span style={{ fontSize: 10, color: "#555" }}>(0)</span>
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    style={{ width: "100%", background: "#f5a623", color: "#000", border: "none", borderRadius: 10, padding: "8px 0", fontWeight: 800, fontSize: 12, cursor: "pointer" }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={{ paddingBottom: 80 }} />
      <BottomNav />
    </main>
  );
}
