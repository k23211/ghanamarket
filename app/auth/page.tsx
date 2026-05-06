"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else setMessage("Logged in successfully!");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage("Account created! You can now sign in.");
    }
    setLoading(false);
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
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 mt-1 text-sm text-gray-900 focus:outline-none focus:border-green-500"
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

        <p className="text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-700 font-bold cursor-pointer"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </main>
  );
}