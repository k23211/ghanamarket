"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

export default function SellerProfilePage() {
  const { id } = useParams();
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      setSeller(prof);

      const { data: prods } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", id)
        .order("created_at", { ascending: false });
      setProducts(prods || []);
      setLoading(false);
    };
    if (id) fetchSeller();
  }, [id]);

  if (loading) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5a623", fontWeight: 700 }}>
      Loading...
    </div>
  );

  if (!seller) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
      Seller not found.
    </div>
  );

  return (
    <main style={{ backgroundColor: "#0d0d0d", color: "#fff", fontFamily: "'Segoe UI', sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>

      {/* Header */}
      <header style={{ background: "#111", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 40, borderBottom: "1px solid #1a1a1a" }}>
        <button onClick={() => window.history.back()} style={{ background: "none", border: "none", color: "#f5a623", fontSize: 20, cursor: "pointer" }}>←</button>
        <div>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>Ghana</span>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#f5a623" }}>Market</span>
        </div>
      </header>

      {/* Banner */}
      <section style={{ position: "relative", height: 140, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/banner2.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(13,13,13,0.98))" }} />
      </section>

      {/* Seller Info */}
      <section style={{ padding: "0 16px", marginTop: -40, position: "relative", zIndex: 2, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "#f5a623", border: "3px solid #0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#000", flexShrink: 0 }}>
            {seller?.full_name?.[0]?.toUpperCase() || "S"}
          </div>
          <div style={{ paddingBottom: 6 }}>
            <h2 style={{ margin: "0 0 2px", fontSize: 18, fontWeight: 900 }}>{seller?.full_name || "Seller"}</h2>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "#888" }}>
              📍 {seller?.location || "Ghana"} · ✅ Verified Seller
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Listings", value: products.length },
            { label: "Active", value: products.length },
            { label: "Sold", value: 0 },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: "#111", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid #1e1e1e" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#f5a623" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Contact */}
        {seller?.phone && (
          <a href={`tel:${seller.phone}`} style={{ display: "block", width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fff", fontWeight: 700, fontSize: 14, padding: "13px", borderRadius: 14, textAlign: "center", textDecoration: "none", marginBottom: 20, boxSizing: "border-box" }}>
            📞 Call {seller.full_name?.split(" ")[0] || "Seller"}
          </a>
        )}
      </section>

      {/* Seller's Products */}
      <section style={{ padding: "0 16px" }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 800 }}>
          {seller?.full_name?.split(" ")[0] || "Seller"}'s Listings
        </h2>

        {products.length === 0 ? (
          <div style={{ background: "#111", borderRadius: 16, padding: "40px 20px", textAlign: "center", border: "1px dashed #2a2a2a" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
            <p style={{ color: "#555", fontSize: 13, margin: 0 }}>No listings yet</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {products.map(p => (
              <a key={p.id} href={`/products/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#111", borderRadius: 14, overflow: "hidden", border: "1px solid #1e1e1e" }}>
                  <div style={{ height: 130, background: "#1a1a1a" }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🛍️</div>
                    )}
                  </div>
                  <div style={{ padding: "10px 10px 12px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#eee", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#f5a623" }}>GH₵ {Number(p.price).toLocaleString()}</p>
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
