"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      setUser(user);

      const { data } = await supabase
        .from("cart_items")
        .select("*, products(*)")
        .eq("user_id", user.id);

      setCartItems(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const removeItem = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.products?.price || 0) * item.quantity;
  }, 0);

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
        <a href="/products" className="text-sm text-green-700 font-semibold hover:underline">
          ← Continue Shopping
        </a>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-black text-gray-800 mb-6">My Cart 🛒</h2>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <a href="/products" className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600">
              Shop Now
            </a>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
                  <div className="bg-green-100 rounded-xl w-16 h-16 flex items-center justify-center text-3xl">
                    🛍️
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.products?.name}</p>
                    <p className="text-green-700 font-black">GH₵ {item.products?.price}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 font-bold text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600 font-medium">Total</p>
                <p className="text-2xl font-black text-green-700">GH₵ {total}</p>
              </div>
              <a href="/checkout" className="block w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-600 text-center">
                Proceed to Checkout
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}