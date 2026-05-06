"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SellerDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }

      const { data: prof } = await supabase
        .from("profiles").select("*").eq("id", user.id).single();
      if (prof?.role !== "seller") { window.location.href = "/products"; return; }
      setProfile(prof);

      const { data: prods } = await supabase
        .from("products").select("*").eq("seller_id", user.id);
      setProducts(prods || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const switchToBuyer = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ role: "buyer" }).eq("id", user!.id);
    window.location.href = "/products";
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-green-700 font-bold text-lg">Loading...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black">Ghana<span className="text-yellow-400">Market</span> <span className="text-sm font-normal text-green-300">Seller</span></h1>
        <div className="flex gap-3">
          <button onClick={switchToBuyer} className="bg-yellow-400 text-green-900 px-3 py-2 rounded-full text-xs font-bold hover:bg-yellow-300">
            🛒 Switch to Buyer
          </button>
          <button onClick={handleSignOut} className="bg-red-500 text-white px-3 py-2 rounded-full text-xs font-bold hover:bg-red-600">
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl p-6 shadow mb-6">
          <h2 className="text-2xl font-black text-gray-800">Welcome, {profile?.full_name} 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your products and orders here</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow text-center">
            <p className="text-3xl font-black text-green-700">{products.length}</p>
            <p className="text-gray-500 text-sm mt-1">Products Listed</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow text-center">
            <p className="text-3xl font-black text-yellow-500">0</p>
            <p className="text-gray-500 text-sm mt-1">Orders Received</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow text-center col-span-2 md:col-span-1">
            <p className="text-3xl font-black text-green-700">GH₵ 0</p>
            <p className="text-gray-500 text-sm mt-1">Total Earnings</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <a href="/seller/add-product" className="bg-green-700 text-white rounded-2xl p-5 text-center shadow hover:bg-green-600">
            <p className="text-3xl mb-2">➕</p>
            <p className="font-bold">Add Product</p>
          </a>
          <a href="/seller/orders" className="bg-yellow-400 text-green-900 rounded-2xl p-5 text-center shadow hover:bg-yellow-300">
            <p className="text-3xl mb-2">📦</p>
            <p className="font-bold">View Orders</p>
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-black text-gray-800 mb-4">My Products</h3>
          {products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-5xl mb-3">🛍️</p>
              <p className="text-gray-500">No products yet. Add your first product!</p>
              <a href="/seller/add-product" className="inline-block mt-4 bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600">
                Add Product
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-xl p-4">
                  <p className="font-bold text-gray-800">{product.name}</p>
                  <p className="text-green-700 font-black">GH₵ {product.price}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}