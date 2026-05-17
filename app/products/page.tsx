"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["All", "Fashion", "Food", "Jewelry", "Crafts", "Beauty", "Electronics", "Home & Living", "Groceries", "Other"];

function Stars({ n = 5 }: { n?: number }) {
  return <span style={{ color: "#f5a623", fontSize: 11 }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

function BottomNav({ active }: { active: string }) {
  const items = [
    { icon: "🏠", label: "Home",       href: "/" },
    { icon: "⊞", label: "Categories", href: "/categories" },
    { icon: null, label: "Sell",       href: "/seller/dashboard", isCta: true },
    { icon: "💬", label: "Messages",   href: "#" },
    { icon: "👤", label: "Profile",    href: "#" },
  ];
  return (
    <nav style={{ position: "sticky", bottom: 0, background: "#111", borderTop: "1px solid #1e1e1e", display: "flex", justifyContent: "space-around", padding: "10px 0 14px", zIndex: 50 }}>
      {items.map(item => (
        <a key={item.label} href={item.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          {item.isCta ? (
            <div style={{ background: "#f5a623", borderRadius: "50%", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginTop: -18, boxShadow: "0 0 0 4px #0d0d0d", color: "#000" }}>＋</div>
          ) : (
            <span style={{ fontSize: 20 }}>{item.icon}</span>
          )}
          <span style={{ fontSize: 10, color: active === item.label ? "#f5a623" : "#555", fontWeight: active === item.label ? 700 : 400 }}>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered]  = useState<any[]>([]);
  const [user, setUser]          = useState<any>(null);
  const [loading, setLoading]    = useState(true);
  const [search, setSearch]      = useState("");
  const [category, setCategory]  = useState("All");
  const [wishlist, setWishlist]  = useState<Set<string>>(new Set());

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

    // Read ?category= from URL
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) setCategory(cat.charAt(0).toUpperCase() + cat.slice(1));
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

  const switchToSeller = async () => {
    if (!user) { window.location.href = "/auth"; return; }
    await supabase.from("profiles").update({ role: "seller" }).eq("id", user.id);
    window.location.href = "/seller/dashboard";
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
          <>
            <button onClick={switchToSeller}
              style={{ background: "#f5a623", border: "none", color: "#000", fontSize: 11, fontWeight: 800, padding: "5px 10px", borderRadius: 20, cursor: "pointer" }}>
              🏪 Sell
            </button>
            <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
              style={{ background: "#e74c3c", border: "none", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 20, cursor: "pointer" }}>
              Sign Out
            </button>
          </>
        ) : (
          <a href="/auth" style={{ background: "#f5a623", color: "#000", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 20, textDecoration: "none" }}>Sign In</a>
        )}
      </header>

      {/* Search */}
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

      {/* Category filter pills */}
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
        {CATEGORIES.map(cat => {
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                flexShrink: 0,
                background: active ? "#f5a623" : "#1a1a1a",
                border: active ? "none" : "1px solid #2a2a2a",
                borderRadius: 20,
                padding: "7px 16px",
                color: active ? "#000" : "#aaa",
                fontSize: 12,
                fontWeight: active ? 800 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div style={{ padding: "14px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>
          {category === "All" ? "All Products" : category}
          <span style={{ color: "#555", fontWeight: 400, fontSize: 13 }}> ({filtered.length})</span>
        </h3>
        <button style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 20, padding: "5px 12px", color: "#aaa", fontSize: 11, cursor: "pointer" }}>
          Sort ▾
        </button>
      </div>

      {/* Products */}
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
                {/* Image */}
                <div style={{ position: "relative", height: 140, background: "#1a1a1a" }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🛍️</div>
                  )}
                  {/* Category badge */}
                  <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.65)", color: "#f5a623", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 10 }}>
                    {product.category}
                  </span>
                  {/* Wishlist */}
                  <button onClick={() => toggleWish(product.id)}
                    style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 28, height: 28, fontSize: 13, cursor: "pointer", color: wishlist.has(product.id) ? "#e74c3c" : "#aaa" }}>
                    {wishlist.has(product.id) ? "♥" : "♡"}
                  </button>
                </div>

                {/* Info */}
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
                    style={{ width: "100%", background: "#f5a623", color: "#000", border: "none", borderRadius: 10, padding: "8px 0", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav active="Categories" />
    </main>
  );
}
