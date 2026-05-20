"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

const PRODUCT_CATEGORIES = ["Products", "Service", "Other"];

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editingUploading, setEditingUploading] = useState(false);
  const [editingSaving, setEditingSaving] = useState(false);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Products",
    stock: "1",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      setUser(user);

      const [{ data: prof }, { data: prods }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("products").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
      ]);

      setProfile(prof || null);
      setMyProducts(prods || []);
      setLoading(false);
    };
    init();
  }, []);

  const resetProductForm = () => {
    setProductForm({ name: "", description: "", price: "", category: "Products", stock: "1" });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleProductImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleProductEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price) return alert("Name and price are required");
    setSaving(true);
    let image_url = null;

    if (imageFile) {
      setUploading(true);
      const ext = imageFile.name.split('.').pop();
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
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      category: productForm.category,
      stock: Number(productForm.stock),
      image_url,
    }).select().single();

    if (!error && data) {
      setMyProducts(prev => [data, ...prev]);
      resetProductForm();
      setShowProductForm(false);
    }
    setSaving(false);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price || ''),
      category: product.category || PRODUCT_CATEGORIES[0],
      stock: String(product.stock || 1),
    });
    setEditImagePreview(product.image_url || null);
    setEditImageFile(null);
    setShowProductForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelProductEdit = () => {
    setEditingProduct(null);
    setEditImageFile(null);
    setEditImagePreview(null);
    resetProductForm();
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    if (!productForm.name || !productForm.price) return alert('Name and price are required');
    setEditingSaving(true);
    let image_url = editingProduct.image_url || null;

    if (editImageFile) {
      setEditingUploading(true);
      const ext = editImageFile.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('products').upload(path, editImageFile, { upsert: true });
      if (!upErr) {
        const { data } = supabase.storage.from('products').getPublicUrl(path);
        image_url = data?.publicUrl || image_url;
      }
      setEditingUploading(false);
    }

    const { data, error } = await supabase.from('products').update({
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      category: productForm.category,
      stock: Number(productForm.stock),
      image_url,
    }).eq('id', editingProduct.id).select().single();

    if (!error && data) {
      setMyProducts(prev => prev.map(p => p.id === data.id ? data : p));
      handleCancelProductEdit();
    } else {
      alert('Could not update product.');
    }
    setEditingSaving(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    setMyProducts(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5a623", fontWeight: 700, fontSize: 16 }}>
      Loading...
    </div>
  );

  return (
    <main style={{ backgroundColor: "#0d0d0d", color: "#fff", fontFamily: "'Segoe UI', sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>

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

      <section style={{ position: "relative", height: 160, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/banner2.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(13,13,13,0.95))" }} />
        <div style={{ position: "absolute", bottom: 16, left: 16, zIndex: 2 }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Welcome back, <span style={{ color: "#f5a623" }}>{profile?.full_name?.split(" ")[0] || "Seller"}</span></p>
          <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>Manage your products and services</p>
        </div>
      </section>

      <section style={{ display: "flex", gap: 10, padding: "16px 16px 0" }}>
        {[
          { label: "Products", value: myProducts.length },
        ].map((stat) => (
          <div key={stat.label} style={{ flex: 1, background: "#111", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid #1e1e1e" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#f5a623" }}>{stat.value}</div>
            <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </section>

      <section style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Products</h2>
            <span style={{ fontSize: 12, color: '#555' }}>{myProducts.length} items</span>
          </div>

          {editingProduct && (
            <section style={{ marginBottom: 20, background: '#111', borderRadius: 16, padding: 16, border: '1px solid #1e1e1e' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Edit Product</h3>
              <label style={{ display: 'block', marginBottom: 12, cursor: 'pointer' }}>
                <div style={{ height: 140, background: '#1a1a1a', borderRadius: 12, border: '2px dashed #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {editImagePreview ? (
                    <img src={editImagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#555' }}>
                      <div style={{ fontSize: 28 }}>📷</div>
                      <div style={{ fontSize: 11, marginTop: 4 }}>Tap to replace photo</div>
                    </div>
                  )}
                </div>
                <input type='file' accept='image/*' onChange={handleProductEditImage} style={{ display: 'none' }} />
              </label>

              {[{ key: 'name', label: 'Product Name', placeholder: 'e.g. Wireless Headphones' }, { key: 'price', label: 'Price (GH₵)', placeholder: 'e.g. 250', type: 'number' }, { key: 'stock', label: 'Stock Quantity', placeholder: 'e.g. 5', type: 'number' }].map((field) => (
                <div key={field.key} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={(productForm as any)[field.key]}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13 }}
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Description</label>
                <textarea
                  placeholder='Describe your product...'
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, resize: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleUpdateProduct}
                  disabled={editingSaving}
                  style={{ flex: 1, background: editingSaving ? '#333' : '#f5a623', color: editingSaving ? '#666' : '#000', fontWeight: 800, fontSize: 14, padding: 14, borderRadius: 12, border: 'none', cursor: editingSaving ? 'not-allowed' : 'pointer' }}
                >
                  {editingUploading ? 'Uploading image...' : editingSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={handleCancelProductEdit} style={{ flex: 1, background: '#222', color: '#fff', borderRadius: 12, border: '1px solid #2a2a2a', padding: 14 }}>Cancel</button>
              </div>
            </section>
          )}

          <section style={{ marginBottom: 20, background: '#111', borderRadius: 16, padding: 16, border: '1px solid #1e1e1e' }}>
            <button
              onClick={() => { setEditingProduct(null); setShowProductForm((prev) => !prev); resetProductForm(); }}
              style={{ width: '100%', background: '#f5a623', color: '#000', fontWeight: 800, fontSize: 14, padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer' }}
            >
              {showProductForm ? '✕ Cancel Product' : '+ Add New Product'}
            </button>

            {showProductForm && (
              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', marginBottom: 12, cursor: 'pointer' }}>
                  <div style={{ height: 140, background: '#1a1a1a', borderRadius: 12, border: '2px dashed #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {imagePreview ? (
                      <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#555' }}>
                        <div style={{ fontSize: 28 }}>📷</div>
                        <div style={{ fontSize: 11, marginTop: 4 }}>Tap to upload photo</div>
                      </div>
                    )}
                  </div>
                  <input type='file' accept='image/*' onChange={handleProductImage} style={{ display: 'none' }} />
                </label>

                {[
                  { key: 'name', label: 'Product Name', placeholder: 'e.g. Wireless Headphones' },
                  { key: 'price', label: 'Price (GH₵)', placeholder: 'e.g. 250', type: 'number' },
                  { key: 'stock', label: 'Stock Quantity', placeholder: 'e.g. 5', type: 'number' },
                ].map((field) => (
                  <div key={field.key} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      value={(productForm as any)[field.key]}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13 }}
                  >
                    {PRODUCT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Description</label>
                  <textarea
                    placeholder='Describe your product...'
                    value={productForm.description}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  onClick={handleAddProduct}
                  disabled={saving}
                  style={{ width: '100%', background: saving ? '#333' : '#f5a623', color: saving ? '#666' : '#000', fontWeight: 800, fontSize: 14, padding: 14, borderRadius: 12, border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {uploading ? 'Uploading image...' : saving ? 'Saving...' : 'Post Product'}
                </button>
              </div>
            )}
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myProducts.length === 0 ? (
              <div style={{ background: '#111', borderRadius: 16, padding: '40px 20px', textAlign: 'center', border: '1px dashed #2a2a2a' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
                <p style={{ color: '#555', fontSize: 13, margin: 0 }}>No products yet. Add your first one!</p>
              </div>
            ) : myProducts.map((product) => (
              <div key={product.id} style={{ background: '#111', borderRadius: 14, border: '1px solid #1e1e1e', display: 'flex', gap: 12, padding: 10, alignItems: 'center' }}>
                <div style={{ width: 70, height: 70, borderRadius: 10, overflow: 'hidden', background: '#1a1a1a', flexShrink: 0 }}>
                  {product.image_url ? (
                    <img src={product.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🛍️</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 13, color: '#eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                  <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 900, color: '#f5a623' }}>GH₵ {Number(product.price).toLocaleString()}</p>
                  <span style={{ background: '#1a2a0a', color: '#5d0', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>Active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => handleEditProduct(product)}
                    style={{ background: '#0a2a2a', border: '1px solid #153a3a', color: '#7ff', fontSize: 11, padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    style={{ background: '#1a0a0a', border: '1px solid #2a1a1a', color: '#f55', fontSize: 11, padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        </section>

      <div style={{ paddingBottom: 120 }} />
      <BottomNav />
    </main>
  );
}
