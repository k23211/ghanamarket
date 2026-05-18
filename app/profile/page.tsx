"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", location: "" });

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      setUser(user);

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // Merge auth metadata as fallback for missing profile fields
      const meta = user.user_metadata || {};
      const merged = {
        full_name: prof?.full_name || meta.full_name || meta.name || "",
        phone: prof?.phone || meta.phone || "",
        location: prof?.location || meta.location || "",
      };

      setProfile({ ...prof, ...merged });
      setAvatarUrl(prof?.avatar_url || null);
      setForm(merged);

      const { data: prods } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
      setMyProducts(prods || []);
      setLoading(false);
    };
    init();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name,
      phone: form.phone,
      location: form.location,
      updated_at: new Date().toISOString(),
    });
    setProfile((prev: any) => ({ ...prev, ...form }));
    setEditing(false);
    setSaving(false);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file || !user) return;
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `avatars/${user.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl + `?t=${Date.now()}`; // bust cache

      await supabase.from("profiles").upsert({
        id: user.id,
        avatar_url: data.publicUrl,
        updated_at: new Date().toISOString(),
      });

      setAvatarUrl(publicUrl);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  if (loading) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5a623", fontWeight: 700 }}>
      Loading...
    </div>
  );

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName[0]?.toUpperCase() || "U";

  return (
    <main style={{ backgroundColor: "#0d0d0d", color: "#fff", fontFamily: "'Segoe UI', sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>

      {/* Header */}
      <header style={{ background: "#111", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1a1a1a", position: "sticky", top: 0, zIndex: 40 }}>
        <div>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>Ghana</span>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#f5a623" }}>Market</span>
        </div>
        <button onClick={handleSignOut} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#aaa", fontSize: 11, fontWeight: 600, padding: "6px 14px", borderRadius: 20, cursor: "pointer" }}>
          Sign Out
        </button>
      </header>

      {/* Hero Banner */}
      <section style={{ position: "relative", height: 140, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/banner2.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(13,13,13,0.98))" }} />
      </section>

      {/* Avatar + Name */}
      <section style={{ padding: "0 16px", marginTop: -40, position: "relative", zIndex: 2, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 14 }}>

          {/* Avatar with upload options */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 76, height: 76, borderRadius: "50%", border: "3px solid #0d0d0d", overflow: "hidden", background: "#f5a623", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#000" }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : initials}
            </div>

            {/* Camera icon overlay */}
            <div style={{ position: "absolute", bottom: 0, right: 0, display: "flex", gap: 3 }}>
              {/* Gallery button */}
              <button
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingAvatar}
                title="Choose from gallery"
                style={{ width: 24, height: 24, borderRadius: "50%", background: "#f5a623", border: "2px solid #0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11 }}
              >
                🖼️
              </button>
              {/* Camera button */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                disabled={uploadingAvatar}
                title="Take a photo"
                style={{ width: 24, height: 24, borderRadius: "50%", background: "#f5a623", border: "2px solid #0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11 }}
              >
                📷
              </button>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={e => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              style={{ display: "none" }}
              onChange={e => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
            />
          </div>

          <div style={{ paddingBottom: 6 }}>
            <h2 style={{ margin: "0 0 2px", fontSize: 18, fontWeight: 900 }}>{displayName}</h2>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: "#888" }}>
              {user?.email}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#666" }}>
              {profile?.location || "Ghana"} · Member since {profile?.created_at ? new Date(profile.created_at).getFullYear() : new Date().getFullYear()}
            </p>
            {uploadingAvatar && (
              <p style={{ margin: "4px 0 0", fontSize: 10, color: "#f5a623" }}>Uploading photo...</p>
            )}
          </div>
        </div>

        {/* Registration info card */}
        <div style={{ background: "#111", borderRadius: 14, padding: "12px 16px", border: "1px solid #1e1e1e", marginBottom: 16 }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Account Info</p>
          {[
            { label: "Email", value: user?.email },
            { label: "Phone", value: profile?.phone || "—" },
            { label: "Location", value: profile?.location || "—" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, marginBottom: 6, borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: 12, color: "#666" }}>{item.label}</span>
              <span style={{ fontSize: 12, color: "#ddd", fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Listings", value: myProducts.length },
            { label: "Active", value: myProducts.length },
            { label: "Sold", value: 0 },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: "#111", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid #1e1e1e" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#f5a623" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => setEditing(!editing)}
          style={{ width: "100%", background: editing ? "#1a1a1a" : "#f5a623", color: editing ? "#aaa" : "#000", fontWeight: 800, fontSize: 13, padding: "12px", borderRadius: 12, border: editing ? "1px solid #2a2a2a" : "none", cursor: "pointer", marginBottom: 16 }}
        >
          {editing ? "✕ Cancel" : "✏️ Edit Profile"}
        </button>

        {/* Edit Form */}
        {editing && (
          <div style={{ background: "#111", borderRadius: 16, padding: 16, border: "1px solid #1e1e1e", marginBottom: 16 }}>
            {[
              { key: "full_name", label: "Full Name", placeholder: "Your full name" },
              { key: "phone", label: "Phone Number", placeholder: "e.g. 0244123456" },
              { key: "location", label: "Location", placeholder: "e.g. Accra, Ghana" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>{f.label}</label>
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
            ))}
            <button
              onClick={saveProfile}
              disabled={saving}
              style={{ width: "100%", background: saving ? "#333" : "#f5a623", color: saving ? "#666" : "#000", fontWeight: 800, fontSize: 14, padding: 12, borderRadius: 12, border: "none", cursor: saving ? "not-allowed" : "pointer" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </section>

      {/* My Listings */}
      <section style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>My Listings</h2>
          <a href="/seller/dashboard" style={{ color: "#f5a623", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Manage →</a>
        </div>

        {myProducts.length === 0 ? (
          <div style={{ background: "#111", borderRadius: 16, padding: "40px 20px", textAlign: "center", border: "1px dashed #2a2a2a" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
            <p style={{ color: "#555", fontSize: 13, margin: "0 0 14px" }}>No listings yet</p>
            <a href="/seller/dashboard" style={{ background: "#f5a623", color: "#000", fontWeight: 800, fontSize: 12, padding: "10px 20px", borderRadius: 20, textDecoration: "none" }}>
              + Add Product
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {myProducts.map(p => (
              <a key={p.id} href={`/products/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#111", borderRadius: 14, border: "1px solid #1e1e1e", display: "flex", gap: 12, padding: 10, alignItems: "center" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 10, overflow: "hidden", background: "#1a1a1a", flexShrink: 0 }}>
                    {p.image_url ? (
                      <img src={p.image_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🛍️</div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 900, color: "#f5a623" }}>GH₵ {Number(p.price).toLocaleString()}</p>
                    <span style={{ background: "#1a2a0a", color: "#5d0", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8 }}>Active</span>
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
