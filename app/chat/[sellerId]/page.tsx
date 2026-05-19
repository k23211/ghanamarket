"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ChatPage() {
  const { sellerId } = useParams();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const [seller, setSeller] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }

      const { data: sellerData, error: sellerError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sellerId)
        .single();

      if (sellerError || !sellerData) {
        setError("Seller not found");
        setLoading(false);
        return;
      }

      setSeller(sellerData);

      if (productId) {
        const { data: productData } = await supabase
          .from("products")
          .select("id, name, price, image_url")
          .eq("id", productId)
          .single();
        setProduct(productData);
      }

      setLoading(false);
    };
    init();
  }, [sellerId, productId]);

  useEffect(() => {
    if (!seller) return;
    if (!seller.phone) {
      setError("Seller has no WhatsApp number available.");
      return;
    }

    const cleanPhone = String(seller.phone).replace(/[^0-9]/g, "");
    const text = product
      ? `Hello, I am interested in your product \"${product.name}\".`
      : `Hello, I would like to contact you about your listing.`;

    setWhatsappUrl(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`);
  }, [seller, product]);

  useEffect(() => {
    if (whatsappUrl) {
      window.location.href = whatsappUrl;
    }
  }, [whatsappUrl]);

  if (loading) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5a623", fontWeight: 700 }}>
      Loading WhatsApp...
    </div>
  );

  return (
    <main style={{
      background: "#0d0d0d",
      color: "#fff",
      fontFamily: "'Segoe UI', sans-serif",
      maxWidth: 480,
      margin: "0 auto",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
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
        <a href="/chat" style={{ color: "#f5a623", fontSize: 20, textDecoration: "none" }}>←</a>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "#f5a623",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 900, fontSize: 16, color: "#000", flexShrink: 0,
        }}>
          {seller?.full_name?.[0]?.toUpperCase() || "S"}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{seller?.full_name || "Seller"}</p>
          <p style={{ margin: 0, fontSize: 11, color: "#555" }}>Opening WhatsApp...</p>
        </div>
        <a href={`/profile/${sellerId}`} style={{ color: "#f5a623", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
          Profile →
        </a>
      </header>
      <div style={{ padding: 24, textAlign: "center", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6 }}>
          You are being redirected to WhatsApp to contact the seller.
        </p>
        {error && <p style={{ color: "#ff6b6b", marginTop: 16 }}>{error}</p>}
        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noreferrer" style={{ marginTop: 24, background: "#25D366", color: "#000", padding: "14px 18px", borderRadius: 14, textDecoration: "none", fontWeight: 700 }}>
            Open WhatsApp
          </a>
        )}
      </div>
    </main>
  );
}
