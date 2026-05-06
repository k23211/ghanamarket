"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }

      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setLoading(false);
    };
    load();
  }, []);

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
        <h2 className="text-3xl font-black text-gray-800 mb-6">My Orders 📦</h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500 mb-4">No orders yet</p>
            <a href="/products" className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600">
              Shop Now
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="text-sm font-bold text-gray-700">{order.id.slice(0, 8)}...</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    order.status === "delivered" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <p className="text-gray-700">{item.products?.name} x{item.quantity}</p>
                      <p className="font-bold text-green-700">GH₵ {item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Delivery to</p>
                    <p className="text-sm text-gray-700">{order.address}</p>
                  </div>
                  <p className="font-black text-green-700 text-lg">GH₵ {order.total}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}