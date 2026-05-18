'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import BottomNav from '../../components/BottomNav';

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

export default function PublicProfilePage() {
  const params = useParams();
  const sellerId = params?.id as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .single();

      setProfile(prof);

      const { data: prods } = await supabase
        .from('products')
        .select('id, title, price, image_url, status')
        .eq('seller_id', sellerId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      setProducts(prods || []);
      setLoading(false);
    };
    load();
  }, [sellerId]);

  if (loading) return (
    <div style={styles.loadingContainer}><div style={styles.spinner} /></div>
  );

  if (!profile) return (
    <div style={styles.loadingContainer}><p style={{ color: '#888' }}>Seller not found.</p></div>
  );

  return (
    <main style={styles.main}>
      <div style={styles.banner}>
        <img src="/banner.png" alt="banner" style={styles.bannerImg} />
        <div style={styles.bannerOverlay} />
        <button onClick={() => window.history.back()} style={styles.backBtn}>← Back</button>
      </div>

      <div style={styles.avatarSection}>
        <div style={styles.avatarCircle}>
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt="avatar" style={styles.avatarImg} />
            : <span style={styles.avatarInitial}>
                {profile.full_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || '?'}
              </span>
          }
        </div>
        <div style={styles.nameBlock}>
          <h2 style={styles.name}>{profile.full_name || 'Seller'}</h2>
          <p style={styles.memberSince}>Ghana · Member since {new Date(profile.created_at).getFullYear()}</p>
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <span style={styles.statNum}>{products.length}</span>
          <span style={styles.statLabel}>Listings</span>
        </div>
        {profile.location && (
          <div style={styles.statBox}>
            <span style={styles.statNum}>📍</span>
            <span style={styles.statLabel}>{profile.location}</span>
          </div>
        )}
      </div>

      {profile.phone && (
        <div style={styles.contactCard}>
          <a href={`tel:${profile.phone}`} style={styles.callBtn}>📞 Call Seller</a>
          <a href={`https://wa.me/${profile.phone}`} target="_blank" style={styles.whatsappBtn}>💬 WhatsApp</a>
        </div>
      )}

      <section style={styles.listingsSection}>
        <h3 style={styles.listingsTitle}>Active Listings</h3>
        {products.length === 0
          ? <p style={styles.emptyText}>No active listings.</p>
          : <div style={styles.grid}>
              {products.map(p => (
                <a key={p.id} href={`/products/${p.id}`} style={styles.gridCard}>
                  <img src={p.image_url} alt={p.title} style={styles.gridImg} />
                  <p style={styles.gridTitle}>{p.title}</p>
                  <p style={styles.gridPrice}>GH₵ {p.price}</p>
                </a>
              ))}
            </div>
        }
      </section>

      <div style={{ paddingBottom: 100 }} />
      <BottomNav />
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
  loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a' },
  spinner: { width: 40, height: 40, border: '4px solid #333', borderTop: '4px solid #f5a623', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  banner: { position: 'relative', height: 180, overflow: 'hidden' },
  bannerImg: { width: '100%', height: '100%', objectFit: 'cover' },
  bannerOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' },
  backBtn: { position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 16px', borderRadius: 20, cursor: 'pointer' },
  avatarSection: { display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', marginTop: -40, position: 'relative', zIndex: 10 },
  avatarCircle: { width: 80, height: 80, borderRadius: '50%', background: '#f5a623', border: '3px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarInitial: { fontSize: 32, fontWeight: 700, color: '#0a0a0a' },
  nameBlock: { marginTop: 20 },
  name: { margin: 0, fontSize: 20, fontWeight: 700 },
  memberSince: { margin: '4px 0 0', fontSize: 12, color: '#777' },
  statsRow: { display: 'flex', gap: 12, padding: '20px 20px 0' },
  statBox: { flex: 1, background: '#1a1a1a', borderRadius: 12, padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: 700, color: '#f5a623' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  contactCard: { display: 'flex', gap: 12, padding: '16px 20px' },
  callBtn: { flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, padding: 14, color: '#fff', textAlign: 'center', textDecoration: 'none', fontSize: 14, fontWeight: 600 },
  whatsappBtn: { flex: 1, background: '#1a3a1a', border: '1px solid #2d5a2d', borderRadius: 12, padding: 14, color: '#4caf50', textAlign: 'center', textDecoration: 'none', fontSize: 14, fontWeight: 600 },
  listingsSection: { padding: '0 20px' },
  listingsTitle: { fontSize: 18, fontWeight: 700, marginBottom: 12 },
  emptyText: { color: '#555', textAlign: 'center', padding: '30px 0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  gridCard: { background: '#111', borderRadius: 12, overflow: 'hidden', textDecoration: 'none', color: '#fff' },
  gridImg: { width: '100%', height: 140, objectFit: 'cover' },
  gridTitle: { margin: '8px 10px 4px', fontSize: 13, fontWeight: 600 },
  gridPrice: { margin: '0 10px 10px', color: '#f5a623', fontWeight: 700, fontSize: 14 },
};