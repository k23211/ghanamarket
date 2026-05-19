"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/app/components/BottomNav";

const PRODUCT_CATEGORIES = ["Electronics", "Fashion", "Home", "Beauty", "Food", "Vehicles", "Other"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("products");
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
    category: "Electronics",
    stock: "1",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobSaving, setJobSaving] = useState(false);
  const [jobUpdating, setJobUpdating] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    description: "",
  });

  const [applications, setApplications] = useState<any[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [jobLoadError, setJobLoadError] = useState<string | null>(null);

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

      let { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .eq("poster_id", user.id)
        .order("created_at", { ascending: false });

      if ((!jobs || jobs.length === 0) && prof?.full_name) {
        const fallback = await supabase
          .from("jobs")
          .select("*")
          .eq("poster_name", prof.full_name)
          .order("created_at", { ascending: false });

        if (!fallback.error && fallback.data && fallback.data.length > 0) {
          jobs = fallback.data;
          jobsError = null;
        }
      }

      setJobLoadError(jobsError?.message || null);
      setMyJobs(jobs || []);
      await loadApplications(jobs || []);
      setLoading(false);
    };
    init();
  }, []);

  const loadApplications = async (jobs: any[]) => {
    setApplicationsLoading(true);
    const jobIds = jobs.map((job) => job.id);
    if (jobIds.length === 0) {
      setApplications([]);
      setApplicationsLoading(false);
      return;
    }

    const { data } = await supabase
      .from("job_applications")
      .select("*")
      .in("job_id", jobIds)
      .order("created_at", { ascending: false });

    setApplications(data || []);
    setApplicationsLoading(false);
  };

  const resetProductForm = () => {
    setProductForm({ name: "", description: "", price: "", category: "Electronics", stock: "1" });
    setImageFile(null);
    setImagePreview(null);
  };

  const resetJobForm = () => {
    setJobForm({ title: "", company: "", location: "", type: "Full-time", description: "" });
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

  const handleAddJob = async () => {
    if (!jobForm.title || !jobForm.company) return alert('Job title and company are required');
    setJobSaving(true);

    const { data, error } = await supabase.from('jobs').insert({
      poster_id: user.id,
      poster_name: profile?.full_name || user.email || null,
      title: jobForm.title,
      company: jobForm.company,
      location: jobForm.location || null,
      type: jobForm.type || null,
      description: jobForm.description || null,
      created_at: new Date().toISOString(),
    }).select().single();

    if (!error && data) {
      const nextJobs = [data, ...myJobs];
      setMyJobs(nextJobs);
      await loadApplications(nextJobs);
      resetJobForm();
      setShowJobForm(false);
    }
    setJobSaving(false);
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      type: job.type || 'Full-time',
      description: job.description || '',
    });
    setShowJobForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelJobEdit = () => {
    setEditingJob(null);
    resetJobForm();
  };

  const handleUpdateJob = async () => {
    if (!editingJob) return;
    if (!jobForm.title || !jobForm.company) return alert('Job title and company are required');
    setJobUpdating(true);

    const { data, error } = await supabase.from('jobs').update({
      title: jobForm.title,
      company: jobForm.company,
      location: jobForm.location || null,
      type: jobForm.type || null,
      description: jobForm.description || null,
    }).eq('id', editingJob.id).select().single();

    if (!error && data) {
      const updatedJobs = myJobs.map((job) => job.id === data.id ? data : job);
      setMyJobs(updatedJobs);
      await loadApplications(updatedJobs);
      handleCancelJobEdit();
    } else {
      alert('Could not update job.');
    }
    setJobUpdating(false);
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    await supabase.from('jobs').delete().eq('id', id);
    setMyJobs(prev => prev.filter((job) => job.id !== id));
    setApplications(prev => prev.filter((app) => app.job_id !== id));
  };

  if (loading) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5a623", fontWeight: 700, fontSize: 16 }}>
      Loading...
    </div>
  );

  const sellerPhone = profile?.phone ? String(profile.phone).replace(/[^0-9]/g, "") : null;
  const whatsappLink = sellerPhone ? `https://wa.me/${sellerPhone}?text=${encodeURIComponent("Hello, I want to manage my listings on GhanaMarket.")}` : null;

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
          <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>Manage your products, jobs and applications</p>
        </div>
      </section>

      <section style={{ display: "flex", gap: 10, padding: "16px 16px 0" }}>
        {[
          { label: "Products", value: myProducts.length },
          { label: "Jobs", value: myJobs.length },
          { label: "Apps", value: applications.length },
        ].map((stat) => (
          <div key={stat.label} style={{ flex: 1, background: "#111", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid #1e1e1e" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#f5a623" }}>{stat.value}</div>
            <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </section>

      <section style={{ padding: "16px 16px 0", display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['products', 'jobs', 'applications', 'messages'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              minWidth: 96,
              background: activeTab === tab ? '#f5a623' : '#111',
              color: activeTab === tab ? '#000' : '#fff',
              border: '1px solid #1e1e1e',
              borderRadius: 12,
              padding: '12px 10px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {tab === 'products' ? 'Products' : tab === 'jobs' ? 'Jobs' : tab === 'applications' ? 'Applications' : 'Messages'}
          </button>
        ))}
      </section>

      {activeTab === 'products' && (
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
      )}

      {activeTab === 'jobs' && (
        <section style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Jobs</h2>
            <span style={{ fontSize: 12, color: '#555' }}>{myJobs.length} posts</span>
          </div>

          <section style={{ marginBottom: 20, background: '#111', borderRadius: 16, padding: 16, border: '1px solid #1e1e1e' }}>
            <button
              onClick={() => { setEditingJob(null); setShowJobForm((prev) => !prev); resetJobForm(); }}
              style={{ width: '100%', background: '#f5a623', color: '#000', fontWeight: 800, fontSize: 14, padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer' }}
            >
              {showJobForm ? '✕ Cancel Job' : '+ Add New Job'}
            </button>

            {showJobForm && (
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Job Title</label>
                  <input
                    type='text'
                    placeholder='E.g. Marketing Manager'
                    value={jobForm.title}
                    onChange={(e) => setJobForm((prev) => ({ ...prev, title: e.target.value }))}
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13 }}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Company</label>
                  <input
                    type='text'
                    placeholder='E.g. Adinkra Match'
                    value={jobForm.company}
                    onChange={(e) => setJobForm((prev) => ({ ...prev, company: e.target.value }))}
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13 }}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Location</label>
                  <input
                    type='text'
                    placeholder='Location or Remote'
                    value={jobForm.location}
                    onChange={(e) => setJobForm((prev) => ({ ...prev, location: e.target.value }))}
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13 }}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Type</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm((prev) => ({ ...prev, type: e.target.value }))}
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13 }}
                  >
                    {JOB_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Description</label>
                  <textarea
                    placeholder='Job description...'
                    value={jobForm.description}
                    onChange={(e) => setJobForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {editingJob ? (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={handleUpdateJob}
                      disabled={jobUpdating}
                      style={{ flex: 1, background: '#f5a623', color: '#000', fontWeight: 800, fontSize: 14, padding: 14, borderRadius: 12, border: 'none', cursor: 'pointer' }}
                    >
                      {jobUpdating ? 'Saving...' : 'Save Job'}
                    </button>
                    <button
                      onClick={handleCancelJobEdit}
                      style={{ flex: 1, background: '#222', color: '#fff', borderRadius: 12, border: '1px solid #2a2a2a', padding: 14 }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddJob}
                    disabled={jobSaving}
                    style={{ width: '100%', background: '#f5a623', color: '#000', fontWeight: 800, fontSize: 14, padding: 14, borderRadius: 12, border: 'none', cursor: 'pointer' }}
                  >
                    {jobSaving ? 'Saving...' : 'Post Job'}
                  </button>
                )}
              </div>
            )}
          </section>

          {myJobs.length === 0 ? (
            <div style={{ background: '#111', borderRadius: 16, padding: '40px 20px', textAlign: 'center', border: '1px dashed #2a2a2a' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>💼</div>
              <p style={{ color: '#555', fontSize: 13, margin: 0 }}>No jobs posted yet. Create your first job listing.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myJobs.map((job) => (
                <div key={job.id} style={{ background: '#111', borderRadius: 14, padding: 14, border: '1px solid #1e1e1e' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800 }}>{job.title}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>{job.company} • {job.location || 'Remote'}</p>
                    </div>
                    <span style={{ background: '#1a1a1a', color: '#f5a623', fontSize: 11, fontWeight: 700, padding: '6px 10px', borderRadius: 12 }}>{job.type || 'Full-time'}</span>
                  </div>
                  <p style={{ margin: '10px 0 0', fontSize: 13, color: '#ddd', whiteSpace: 'pre-line' }}>{job.description}</p>
                  <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleEditJob(job)}
                      style={{ background: '#0a2a2a', border: '1px solid #153a3a', color: '#7ff', fontSize: 12, padding: '10px 14px', borderRadius: 12, cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      style={{ background: '#1a0a0a', border: '1px solid #2a1a1a', color: '#f55', fontSize: 12, padding: '10px 14px', borderRadius: 12, cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'applications' && (
        <section style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Applications</h2>
            <span style={{ fontSize: 12, color: '#555' }}>{applications.length} received</span>
          </div>

          {applicationsLoading ? (
            <div style={{ background: '#111', borderRadius: 16, padding: 20, textAlign: 'center', color: '#f5a623' }}>Loading applications...</div>
          ) : applications.length === 0 ? (
            <div style={{ background: '#111', borderRadius: 16, padding: 20, textAlign: 'center', border: '1px dashed #2a2a2a' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📝</div>
              <p style={{ color: '#555', fontSize: 13, margin: 0 }}>No applications yet. Candidates will apply to your jobs here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {applications.map((app) => (
                <div key={app.id} style={{ background: '#111', borderRadius: 14, padding: 14, border: '1px solid #1e1e1e' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 800 }}>{app.applicant_name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{app.applicant_email}</p>
                    </div>
                    <span style={{ fontSize: 11, color: '#aaa' }}>{new Date(app.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: '12px 0 0', color: '#ddd', fontSize: 13 }}>{app.message || 'No message provided.'}</p>
                  <p style={{ margin: '10px 0 0', fontSize: 12, color: '#777' }}><strong>Job:</strong> {myJobs.find((job) => job.id === app.job_id)?.title || 'Unknown job'}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'messages' && (
        <section style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Messages</h2>
          </div>

          <div style={{ background: '#111', borderRadius: 16, padding: 16, border: '1px solid #1e1e1e' }}>
            <p style={{ margin: 0, color: '#ddd', fontSize: 13 }}>Buyers and applicants can contact you directly via WhatsApp using the phone number on your profile.</p>
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target='_blank'
                  rel='noreferrer'
                  style={{ flex: 1, minWidth: 0, background: '#25D366', color: '#000', fontWeight: 800, fontSize: 14, padding: '14px', borderRadius: 12, textAlign: 'center', textDecoration: 'none' }}
                >
                  Open WhatsApp
                </a>
              ) : (
                <div style={{ color: '#ff6b6b', fontSize: 13 }}>Add your phone number in your profile to enable WhatsApp contact.</div>
              )}
            </div>
            <div style={{ marginTop: 20, color: '#888', fontSize: 12 }}>
              Orders and payment tracking will be added soon to complete your dashboard experience.
            </div>
          </div>
        </section>
      )}

      <div style={{ paddingBottom: 120 }} />
      <BottomNav />
    </main>
  );
}
