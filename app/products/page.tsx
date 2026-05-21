"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Beauty", "Food", "Vehicles", "Other"];

function Stars({ n = 0 }: { n?: number }) {
  const count = Math.max(0, Math.min(5, Math.round(n)));
  return (
    <span style={{ color: "#f5a623", fontSize: 10 }}>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setFiltered(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, activeCategory, products]);

  return (
    <main style={{
      background: "linear-gradient(rgba(13,13,13,0.65), rgba(13,13,13,0.75)), url('/browse.png') center / cover no-repeat",
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
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontWeight: 900, fontSize: 20, color: "#fff" }}>Ven</span>
          <span style={{ fontWeight: 900, fontSize: 20, color: "#f5a623" }}>doxa</span>
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#777" }}>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "#121212",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "12px 14px 12px 40px",
              color: "#fff",
              fontSize: 14,
              boxSizing: "border-box",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            }}
          />
        </div>
      </header>

      {/* Category Filter */}
      <section style={{ padding: "12px 0 0", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 16px 12px", scrollbarWidth: "none" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                background: activeCategory === cat ? "rgba(245,166,35,0.18)" : "rgba(255,255,255,0.04)",
                color: activeCategory === cat ? "#f5a623" : "#d1d5db",
                fontWeight: activeCategory === cat ? 800 : 600,
                fontSize: 12,
                padding: "9px 16px",
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: activeCategory === cat ? "0 12px 28px rgba(245,166,35,0.12)" : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ padding: "16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
            {activeCategory === "All" ? "All Products" : activeCategory}
          </h2>
          <span style={{ fontSize: 12, color: "#555" }}>{filtered.length} items</span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#f5a623", fontWeight: 700 }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: "#121212",
            borderRadius: 20,
            padding: "50px 20px",
            textAlign: "center",
            border: "1px dashed rgba(255,255,255,0.08)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ color: "#555", fontSize: 14, margin: "0 0 8px" }}>No products found</p>
            <p style={{ color: "#777", fontSize: 13, margin: 0 }}>No results? Try another search or category.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {filtered.map(product => (
              <a
                key={product.id}
                href={`/products/${product.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{
                  background: "#121212",
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 18px 42px rgba(0,0,0,0.18)",
                }}>
                  <div style={{ height: 150, background: "#1a1a1a", position: "relative" }}>
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
                        background: "rgba(0,0,0,0.65)",
                        color: "#f5a623",
                        fontSize: 9, fontWeight: 700,
                        padding: "3px 8px", borderRadius: 10,
                      }}>
                        {product.category}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "10px 10px 12px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#eee", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <div style={{ paddingBottom: 100 }} />
      <BottomNav />
    </main>
  );
}
