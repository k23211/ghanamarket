"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

const CATEGORIES = ["Electronics", "Fashion", "Home", "Beauty", "Food", "Vehicles", "Other"];

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "Electronics", stock: "1",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      setUser(user);
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      const { data: prods } = await supabase.from("products").select("*").eq("seller_id", user.id).order("created_at", { ascending: false });
      setMyProducts(prods || []);
      setLoading(false);
    };
    init();
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return alert("Name and price are required");
    setSaving(true);
    let image_url = null;

    if (imageFile) {
      setUploading(true);
      const ext = imageFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("products").upload(path, imageFile);
      if (!upErr) {
        const { data } = supabase.storage.from("products").getPublicUrl(path);
        image_url = data.publicUrl;
      }
      setUploading(false);
    }

    const { data, error } = await supabase.from("products").insert({
      seller_id: user.id,
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      image_url,
    }).select().single();

    if (!error && data) {
      setMyProducts(prev => [data, ...prev]);
      setForm({ name: "", description: "", price: "", category: "Electronics", stock: "1" });
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    setMyProducts(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5a623", fontWeight: 700, fontSize: 16 }}>
      Loading...
    </div>
  );

  return (
    <main style={{ backgroundColor: "#0d0d0d", color: "#fff", fontFamily: "'Segoe UI', sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>

      {/* Header */}
      <header style={{ background: "#111", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1a1a1a", position: "sticky", top: 0, zIndex: 40 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>
            <span style={{ color: "#fff" }}>Ghana</span>
            <span style={{ color: "#f5a623" }}>Market</span>
          </div>
          <div style={{ fontSize: 10, color: "#555" }}>Seller Dashboard</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#aaa" }}>Hi, <strong style={{ color: "#f5a623" }}>{profile?.full_name?.split(" ")[0] || "Seller"}</strong></span>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", height: 160, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/banner2.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(13,13,13,0.95))" }} />
        <div style={{ position: "absolute", bottom: 16, left: 16, zIndex: 2 }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Welcome back, <span style={{ color: "#f5a623" }}>{profile?.full_name?.split(" ")[0] || "Seller"}</span></p>
          <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>Manage your listings below</p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ display: "flex", gap: 10, padding: "16px 16px 0" }}>
        {[
          { label: "Total Listings", value: myProducts.length },
          { label: "Active", value: myProducts.length },
          { label: "Sold Items", value: 0 },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: "#111", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid #1e1e1e" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#f5a623" }}>{s.value}</div>
            <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Add Product Button */}
      <section style={{ padding: "16px 16px 0" }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ width: "100%", background: "#f5a623", color: "#000", fontWeight: 800, fontSize: 14, padding: "14px", borderRadius: 14, border: "none", cursor: "pointer" }}
        >
          {showForm ? "✕ Cancel" : "+ Add New Product"}
        </button>
      </section>

      {/* Add Product Form */}
      {showForm && (
        <section style={{ margin: "16px 16px 0", background: "#111", borderRadius: 16, padding: 16, border: "1px solid #1e1e1e" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 800 }}>New Product</h3>

          <label style={{ display: "block", marginBottom: 12, cursor: "pointer" }}>
            <div style={{ height: 140, background: "#1a1a1a", borderRadius: 12, border: "2px dashed #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {imagePreview ? (
                <img src={imagePreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ textAlign: "center", color: "#555" }}>
                  <div style={{ fontSize: 28 }}>📷</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>Tap to upload photo</div>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
          </label>

          {[
            { key: "name", label: "Product Name", placeholder: "e.g. Wireless Headphones" },
            { key: "price", label: "Price (GH₵)", placeholder: "e.g. 250", type: "number" },
            { key: "stock", label: "Stock Quantity", placeholder: "e.g. 5", type: "number" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>{f.label}</label>
              <input
                type={f.type || "text"}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Category</label>
            <select
              value={form.category}
              onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
              style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13 }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Description</label>
            <textarea
              placeholder="Describe your product..."
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, resize: "none", boxSizing: "border-box" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{ width: "100%", background: saving ? "#333" : "#f5a623", color: saving ? "#666" : "#000", fontWeight: 800, fontSize: 14, padding: 14, borderRadius: 12, border: "none", cursor: saving ? "not-allowed" : "pointer" }}
          >
            {uploading ? "Uploading image..." : saving ? "Saving..." : "Post Product"}
          </button>
        </section>
      )}

      {/* My Listings */}
      <section style={{ padding: "20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>My Listings</h2>
          <span style={{ fontSize: 12, color: "#555" }}>{myProducts.length} products</span>
        </div>

        {myProducts.length === 0 ? (
          <div style={{ background: "#111", borderRadius: 16, padding: "40px 20px", textAlign: "center", border: "1px dashed #2a2a2a" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
            <p style={{ color: "#555", fontSize: 13, margin: 0 }}>No products yet. Add your first one!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {myProducts.map(p => (
              <div key={p.id} style={{ background: "#111", borderRadius: 14, border: "1px solid #1e1e1e", display: "flex", gap: 12, padding: 10, alignItems: "center" }}>
                <div style={{ width: 70, height: 70, borderRadius: 10, overflow: "hidden", background: "#1a1a1a", flexShrink: 0 }}>
                  {p.image_url ? (
                    <img src={p.image_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🛍️</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 13, color: "#eee", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 900, color: "#f5a623" }}>GH₵ {Number(p.price).toLocaleString()}</p>
                  <span style={{ background: "#1a2a0a", color: "#5d0", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8 }}>Active</span>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{ background: "#1a0a0a", border: "1px solid #2a1a1a", color: "#f55", fontSize: 11, padding: "6px 10px", borderRadius: 8, cursor: "pointer", flexShrink: 0 }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={{ paddingBottom: 100 }} />
      <BottomNav />
    </main>
  );
}