"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SellerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }

      const { data: myProducts } = await supabase
        .from("products")
        .select("id")
        .eq("seller_id", user.id);

      const productIds = myProducts?.map((p) => p.id) || [];

      if (productIds.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("order_items")
        .select("*, products(*), orders(*)")
        .in("product_id", productIds)
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders(orders.map((o) =>
      o.orders?.id === orderId ? { ...o, orders: { ...o.orders, status } } : o
    ));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-green-700 font-bold">Loading...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black">Ghana<span className="text-yellow-400">Market</span></h1>
        <a href="/seller/dashboard" className="bg-white text-green-800 px-4 py-2 rounded-full text-sm font-bold">
          ← Dashboard
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-black text-gray-800 mb-6">Incoming Orders 📦</h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="text-sm font-bold text-gray-700">{item.orders?.id?.slice(0, 8)}...</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.orders?.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    item.orders?.status === "delivered" ? "bg-green-100 text-green-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {item.orders?.status}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="font-bold text-gray-800">{item.products?.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} • GH₵ {item.price * item.quantity}</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-400">Deliver to</p>
                  <p className="text-sm text-gray-700">{item.orders?.address}</p>
                  <p className="text-sm text-gray-700">{item.orders?.phone}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(item.orders?.id, "processing")}
                    className="flex-1 bg-blue-500 text-white text-sm py-2 rounded-xl hover:bg-blue-600 font-bold"
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => updateStatus(item.orders?.id, "delivered")}
                    className="flex-1 bg-green-700 text-white text-sm py-2 rounded-xl hover:bg-green-600 font-bold"
                  >
                    Delivered
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}