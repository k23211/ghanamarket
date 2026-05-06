"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

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

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.products?.price || 0) * item.quantity;
  }, 0);

  const placeOrder = async () => {
    if (!name || !phone || !address) {
      setMessage("Please fill in all fields!");
      return;
    }
    setPlacing(true);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total,
        name,
        phone,
        address,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      setPlacing(false);
      return;
    }

    for (const item of cartItems) {
      await supabase.from("order_items").insert({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products?.price,
      });
    }

    await supabase.from("cart_items").delete().eq("user_id", user.id);
    window.location.href = "/orders";
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
        <a href="/cart" className="text-sm text-green-700 font-semibold hover:underline">
          ← Back to Cart
        </a>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-black text-gray-800 mb-6">Checkout</h2>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-black text-gray-800 mb-4">Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-700">{item.products?.name} x{item.quantity}</p>
              <p className="text-sm font-bold text-green-700">GH₵ {item.products?.price * item.quantity}</p>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 flex justify-between">
            <p className="font-black text-gray-800">Total</p>
            <p className="font-black text-green-700 text-xl">GH₵ {total}</p>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-black text-gray-800 mb-4">Delivery Details</h3>

          <label className="text-sm text-gray-600 font-medium">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 mt-1 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500"
          />

          <label className="text-sm text-gray-600 font-medium">Phone Number</label>
          <input
            type="tel"
            placeholder="e.g. 0244000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 mt-1 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500"
          />

          <label className="text-sm text-gray-600 font-medium">Delivery Address</label>
          <textarea
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 mt-1 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500"
          />
        </div>

        {message && (
          <p className="text-sm text-center mb-4 text-red-500">{message}</p>
        )}

        <button
          onClick={placeOrder}
          disabled={placing}
          className="w-full bg-green-700 text-white font-bold py-4 rounded-xl hover:bg-green-600 text-lg"
        >
          {placing ? "Placing Order..." : "Place Order 🛍️"}
        </button>
      </div>
    </main>
  );
}