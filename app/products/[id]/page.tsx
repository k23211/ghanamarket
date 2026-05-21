"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data: prod } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user || null);

      if (prod) {
        setProduct(prod);
        const sellerRes = await fetch(`/api/public-profile/${prod.seller_id}`)
        if (sellerRes.ok) {
          const sellerData = await sellerRes.json()
          setSeller(sellerData)
        } else {
          setSeller(null)
        }
      }
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5a623", fontWeight: 700, fontSize: 16 }}>
      Loading...
    </div>
  );

  if (!product) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>
      Product not found.
    </div>
  );

  return (
    <main style={{
      backgroundColor: "#0d0d0d",
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
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid #1a1a1a",
      }}>
        <a href="/products" style={{ color: "#f5a623", fontSize: 20, textDecoration: "none" }}>←</a>
        <div>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>Ven</span>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#f5a623" }}>doxa</span>
        </div>
      </header>

      {/* Product Image */}
      <div style={{ height: 280, background: "#1a1a1a", position: "relative", overflow: "hidden" }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>
            🛍️
          </div>
        )}
        {product.category && (
          <span style={{
            position: "absolute", top: 14, left: 14,
            background: "rgba(0,0,0,0.65)",
            color: "#f5a623",
            fontSize: 11, fontWeight: 700,
            padding: "4px 12px", borderRadius: 12,
          }}>
            {product.category}
          </span>
        )}
      </div>

      {/* Product Info */}
      <section style={{ padding: "20px 16px 0" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>
          {product.name}
        </h1>
        <p style={{ margin: "0 0 16px", fontSize: 26, fontWeight: 900, color: "#f5a623" }}>
          GH₵ {Number(product.price).toLocaleString()}
        </p>

        {/* Details Row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Condition", value: "New" },
            { label: "Category", value: product.category || "—" },
            { label: "Stock", value: product.stock || "—" },
          ].map(d => (
            <div key={d.label} style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: 10,
              padding: "8px 14px",
              flex: 1,
              minWidth: 80,
            }}>
              <div style={{ fontSize: 9, color: "#555", marginBottom: 2 }}>{d.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#eee" }}>{d.value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        {product.description && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "#aaa" }}>Description</h3>
            <p style={{ margin: 0, fontSize: 14, color: "#ccc", lineHeight: 1.6 }}>
              {product.description}
            </p>
          </div>
        )}

        {/* Seller Info (inline) */}
        <div style={{
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: 14,
          padding: "14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#f5a623",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 900,
            color: "#000",
            flexShrink: 0,
          }}>
            {seller?.full_name?.[0]?.toUpperCase() || "S"}
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14 }}>
              {seller?.full_name || "Seller"}
            </p>
            {seller?.location && <div style={{ marginTop: 8, fontSize: 12, color: '#aaa' }}>📍 {seller.location}</div>}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {seller?.phone && (
              <>
                <a
                  href={`tel:${seller.phone}`}
                  style={{ fontSize: 13, background: '#f5a623', color: '#000', padding: '8px 12px', borderRadius: 10, fontWeight: 800, textDecoration: 'none' }}
                >
                  📞 Call
                </a>
                <a
                  href={`https://wa.me/${seller.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 13, background: '#1a3a1a', color: '#4caf50', padding: '8px 12px', borderRadius: 10, fontWeight: 800, textDecoration: 'none' }}
                >
                  💬 WhatsApp
                </a>
                <div style={{ marginLeft: 8, fontSize: 12, color: '#ddd' }}>{seller.phone}</div>
              </>
            )}
          </div>
        </div>
      </section>

      <div style={{ paddingBottom: 100 }} />
      <BottomNav />
    </main>
  );
}
