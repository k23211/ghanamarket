"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data: prod } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (prod) {
        setProduct(prod);
        const { data: sellerData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", prod.seller_id)
          .single();
        setSeller(sellerData);
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
          <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>Ghana</span>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#f5a623" }}>Market</span>
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

        {/* Seller Info */}
        <div style={{
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: 14,
          padding: "14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
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
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14 }}>
              {seller?.full_name || "Seller"}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#555" }}>
              ✅ Verified Seller
            </p>
          </div>
          {/* FIX: View Profile is now a real <a> link instead of a <span> */}
          <a
            href={`/profile/${product.seller_id}`}
            style={{ fontSize: 10, color: "#f5a623", fontWeight: 700, textDecoration: "none" }}
          >
            View Profile →
          </a>
        </div>
      </section>

      {/* Action Buttons */}
      <div style={{
        position: "fixed",
        bottom: 70,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        padding: "12px 16px",
        background: "linear-gradient(to top, #0d0d0d 80%, transparent)",
        display: "flex",
        gap: 10,
        boxSizing: "border-box",
        zIndex: 30,
      }}>
        {seller?.phone && (
          <a
            href={`tel:${seller.phone}`}
            style={{
              flex: 1,
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              padding: "14px",
              borderRadius: 14,
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            📞 Call Seller
          </a>
        )}
        {/* FIX: Replaced WhatsApp wa.me link with in-app chat route */}
        <a
          href={`/chat/${product.seller_id}?product=${product.id}`}
          style={{
            flex: 2,
            background: "#f5a623",
            color: "#000",
            fontWeight: 800,
            fontSize: 14,
            padding: "14px",
            borderRadius: 14,
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          💬 Chat with Seller
        </a>
      </div>

      <div style={{ paddingBottom: 160 }} />
      <BottomNav />
    </main>
  );
}
