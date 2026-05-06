"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("buyer");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile?.role === "seller") {
          window.location.href = "/seller/dashboard";
        } else {
          window.location.href = "/products";
        }
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
        });
        setMessage("Account created! You can now sign in.");
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

  const handleSwitchRole = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      window.location.href = "/auth";
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const newRole = profile?.role === "seller" ? "buyer" : "seller";
    await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", data.user.id);

    if (newRole === "seller") {
      window.location.href = "/seller/dashboard";
    } else {
      window.location.href = "/products";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-900 to-yellow-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-black text-green-700 mb-1">
          Ghana<span className="text-yellow-500">Market</span>
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </p>

        {!isLogin && (
          <>
            <label className="text-sm text-gray-600 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 mt-1 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500"
            />

            <label className="text-sm text-gray-600 font-medium">I want to</label>
            <div className="flex gap-3 mt-1 mb-4">
              <button
                onClick={() => setRole("buyer")}
                className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                  role === "buyer"
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                🛒 Buy Products
              </button>
              <button
                onClick={() => setRole("seller")}
                className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                  role === "seller"
                    ? "bg-yellow-500 text-white border-yellow-500"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                🏪 Sell Products
              </button>
            </div>
          </>
        )}

        <label className="text-sm text-gray-600 font-medium">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 mt-1 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500"
        />

        <label className="text-sm text-gray-600 font-medium">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 mt-1 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500"
        />

        {message && (
          <p className="text-sm text-center mb-4 text-green-600">{message}</p>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-600 mb-4"
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-500 mb-3">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-700 font-bold cursor-pointer"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>

        <div className="border-t pt-4 mt-2">
          <p className="text-center text-xs text-gray-400 mb-2">Already logged in?</p>
          <button
            onClick={handleSwitchRole}
            className="w-full border-2 border-green-700 text-green-700 font-bold py-3 rounded-xl hover:bg-green-50"
          >
            🔄 Switch between Buyer / Seller
          </button>
        </div>
      </div>
    </main>
  );
}