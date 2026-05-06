"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Fashion", "Food", "Jewelry", "Crafts", "Beauty", "Electronics", "Other"];

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const { data } = await supabase.from("products").select("*");
      setProducts(data || []);
      setFiltered(data || []);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }
    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, category, products]);

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
                🏪 Sell
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

      <section className="py-8 px-6 max-w-6xl mx-auto">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-green-700 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:border-green-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-black text-gray-800 mb-4">
          {filtered.length} Product{filtered.length !== 1 ? "s" : ""} {category !== "All" ? `in ${category}` : ""}
        </h2>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
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
        )}
      </section>

      <footer className="bg-green-900 text-green-200 text-center py-6 text-sm">
        © 2026 GhanaMarket. All rights reserved.
      </footer>
    </main>
  );
}