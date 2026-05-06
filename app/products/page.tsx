"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase.from("products").select("*");
      setProducts(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const switchToSeller = async () => {
    if (!user) { window.location.href = "/auth"; return; }
    await supabase.from("profiles").update({ role: "seller" }).eq("id", user.id);
    window.location.href = "/seller/dashboard";
  };

  const addToCart = async (productId: string) => {
    if (!user) { window.location.href = "/auth"; return; }
    await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity: 1,
    });
    window.location.href = "/cart";
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-green-700 font-bold">Loading...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-black text-green-700">
          Ghana<span className="text-yellow-500">Market</span>
        </a>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <a href="/cart" className="bg-gray-100 text-gray-800 px-3 py-2 rounded-full text-xs font-bold hover:bg-gray-200">
                🛒 Cart
              </a>
              <button onClick={switchToSeller} className="bg-yellow-400 text-green-900 px-3 py-2 rounded-full text-xs font-bold hover:bg-yellow-300">
                🏪 Switch to Seller
              </button>
            </>
          )}
          {user ? (
            <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600">
              Sign Out
            </button>
          ) : (
            <a href="/auth" className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600">
              Sign In
            </a>
          )}
        </div>
      </nav>

      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-gray-800 mb-8">All Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow hover:shadow-md transition-all overflow-hidden">
              <div className="h-40 overflow-hidden">
  {product.image_url ? (
    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
  ) : (
    <div className="bg-green-100 h-full flex items-center justify-center">
      <span className="text-5xl">🛍️</span>
    </div>
  )}
</div>
              <div className="p-4">
                <p className="text-xs text-green-700 font-semibold mb-1">{product.category}</p>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{product.description}</p>
                <p className="text-green-700 font-black">GH₵ {product.price}</p>
                <button
                  onClick={() => addToCart(product.id)}
                  className="w-full mt-3 bg-green-700 text-white text-sm py-2 rounded-xl hover:bg-green-600"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-green-900 text-green-200 text-center py-6 text-sm">
        © 2026 GhanaMarket. All rights reserved.
      </footer>
    </main>
  );
}