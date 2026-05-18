'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  status: string;
}

export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', location: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (prof) {
        setProfile(prof);
        setForm({
          full_name: prof.full_name || '',
          phone: prof.phone || '',
          location: prof.location || '',
        });
      }

      const { data: prods } = await supabase
        .from('products')
        .select('id, title, price, image_url, status')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      setProducts(prods || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update(form).eq('id', user.id);
    setProfile(prev => prev ? { ...prev, ...form } : prev);
    setEditing(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner} />
    </div>
  );

  const activeCount = products.filter(p => p.status === 'active').length;
  const soldCount = products.filter(p => p.status === 'sold').length;

  return (
    <main style={styles.main}>
      {/* Banner */}
      <div style={styles.banner}>
        <img src="/banner.png" alt="banner" style={styles.bannerImg} />
        <div style={styles.bannerOverlay} />
        <button onClick={handleSignOut} style={styles.signOutBtn}>Sign Out</button>
      </div>

      {/* Avatar + Name */}
      <div style={styles.avatarSection}>
        <div style={styles.avatarCircle}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt="avatar" style={styles.avatarImg} />
            : <span style={styles.avatarInitial}>
                {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || '?'}
              </span>
          }
        </div>
        <div style={styles.nameBlock}>
          <h2 style={styles.name}>{profile?.full_name || 'Your Name'}</h2>
          <p style={styles.email}>{profile?.email}</p>
          <p style={styles.memberSince}>
            Ghana · Member since {new Date(profile?.created_at || '').getFullYear()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <span style={styles.statNum}>{products.length}</span>
          <span style={styles.statLabel}>Listings</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNum}>{activeCount}</span>
          <span style={styles.statLabel}>Active</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNum}>{soldCount}</span>
          <span style={styles.statLabel}>Sold</span>
        </div>
      </div>

      {/* Account Info */}
      <section style={styles.card}>
        <p style={styles.cardTitle}>ACCOUNT INFO</p>
        {editing ? (
          <>
            <input
              style={styles.input}
              placeholder="Full Name"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Location"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
            <div style={styles.editBtnRow}>
              <button onClick={handleSave} style={styles.saveBtn}>Save</button>
              <button onClick={() => setEditing(false)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <InfoRow label="Email" value={profile?.email || '—'} />
            <InfoRow label="Phone" value={profile?.phone || '—'} />
            <InfoRow label="Location" value={profile?.location || '—'} />
            <button onClick={() => setEditing(true)} style={styles.editBtn}>✏️ Edit Profile</button>
          </>
        )}
      </section>

      {/* My Listings */}
      <section style={styles.listingsSection}>
        <div style={styles.listingsHeader}>
          <h3 style={styles.listingsTitle}>My Listings</h3>
          <a href="/products/manage" style={styles.manageLink}>Manage →</a>
        </div>
        {products.length === 0 ? (
          <p style={styles.emptyText}>No listings yet.</p>
        ) : (
          products.map(p => (
            <div key={p.id} style={styles.productCard}>
              <img src={p.image_url} alt={p.title} style={styles.productImg} />
              <div>
                <p style={styles.productTitle}>{p.title}</p>
                <p style={styles.productPrice}>GH₵ {p.price}</p>
                <span style={{
                  ...styles.badge,
                  background: p.status === 'active' ? '#1a3a1a' : '#3a1a1a',
                  color: p.status === 'active' ? '#4caf50' : '#f44336',
                }}>
                  {p.status}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      <div style={{ paddingBottom: 100 }} />
      <BottomNav />
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
  loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a' },
  spinner: { width: 40, height: 40, border: '4px solid #333', borderTop: '4px solid #f5a623', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  banner: { position: 'relative', height: 180, overflow: 'hidden' },
  bannerImg: { width: '100%', height: '100%', objectFit: 'cover' },
  bannerOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' },
  signOutBtn: { position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', backdropFilter: 'blur(4px)' },
  avatarSection: { display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', marginTop: -40, position: 'relative', zIndex: 10 },
  avatarCircle: { width: 80, height: 80, borderRadius: '50%', background: '#f5a623', border: '3px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarInitial: { fontSize: 32, fontWeight: 700, color: '#0a0a0a' },
  nameBlock: { marginTop: 20 },
  name: { margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' },
  email: { margin: '2px 0', fontSize: 13, color: '#aaa' },
  memberSince: { margin: 0, fontSize: 12, color: '#777' },
  statsRow: { display: 'flex', gap: 12, padding: '20px 20px 0' },
  statBox: { flex: 1, background: '#1a1a1a', borderRadius: 12, padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: 700, color: '#f5a623' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  card: { background: '#111', borderRadius: 16, margin: '20px', padding: '20px' },
  cardTitle: { fontSize: 11, color: '#666', letterSpacing: 1.5, marginBottom: 16, marginTop: 0 },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #222' },
  infoLabel: { color: '#888', fontSize: 14 },
  infoValue: { color: '#fff', fontSize: 14 },
  input: { width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' },
  editBtn: { width: '100%', background: '#f5a623', border: 'none', borderRadius: 12, padding: '14px', color: '#000', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 16 },
  editBtnRow: { display: 'flex', gap: 10, marginTop: 8 },
  saveBtn: { flex: 1, background: '#f5a623', border: 'none', borderRadius: 10, padding: 12, color: '#000', fontWeight: 700, cursor: 'pointer' },
  cancelBtn: { flex: 1, background: '#222', border: 'none', borderRadius: 10, padding: 12, color: '#fff', cursor: 'pointer' },
  listingsSection: { padding: '0 20px' },
  listingsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  listingsTitle: { margin: 0, fontSize: 18, fontWeight: 700 },
  manageLink: { color: '#f5a623', textDecoration: 'none', fontSize: 14 },
  emptyText: { color: '#555', textAlign: 'center', padding: '30px 0' },
  productCard: { display: 'flex', gap: 14, background: '#111', borderRadius: 12, padding: 14, marginBottom: 10 },
  productImg: { width: 70, height: 70, borderRadius: 8, objectFit: 'cover' },
  productTitle: { margin: '0 0 4px', fontWeight: 600, fontSize: 15 },
  productPrice: { margin: '0 0 6px', color: '#f5a623', fontWeight: 700 },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
};