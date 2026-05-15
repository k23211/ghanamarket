"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const categories = [
  { emoji: "👗", label: "Fashion", href: "/products?category=fashion" },
  { emoji: "🍲", label: "Food", href: "/products?category=food" },
  { emoji: "💎", label: "Jewelry", href: "/products?category=jewelry" },
  { emoji: "🏺", label: "Crafts", href: "/products?category=crafts" },
];

const features = [
  { icon: "🏅", title: "100% Authentic", desc: "Quality products made in Ghana" },
  { icon: "🚚", title: "Fast Delivery", desc: "Quick & reliable delivery to you" },
  { icon: "🔒", title: "Secure Payments", desc: "Safe & secure checkout" },
  { icon: "🎧", title: "Customer Support", desc: "We're here to help you" },
];

const popularPicks = [
  { name: "Kente Bomber Jacket", price: "GHS 350.00", category: "Fashion", color: "bg-blue-500", emoji: "🧥", rating: 5, reviews: 24 },
  { name: "Pure Natural Honey", price: "GHS 60.00", category: "Food", color: "bg-yellow-500", emoji: "🍯", rating: 5, reviews: 18 },
  { name: "African Beaded Bracelet", price: "GHS 45.00", category: "Jewelry", color: "bg-purple-500", emoji: "📿", rating: 5, reviews: 32 },
  { name: "Hand Carved Mask", price: "GHS 120.00", category: "Crafts", color: "bg-orange-500", emoji: "🗿", rating: 5, reviews: 15 },
  { name: "Raw Shea Butter", price: "GHS 55.00", category: "Food", color: "bg-yellow-500", emoji: "🫙", rating: 5, reviews: 21 },
];

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <main className="min-h-screen bg-white font-sans">

      {/* Announcement Bar */}
      <div className="bg-green-800 text-green-100 text-xs text-center py-2 px-4 flex items-center justify-center gap-2">
        <span>🇬🇭 MADE IN GHANA</span>
        <span className="mx-2 opacity-40">|</span>
        <span>Supporting local, empowering communities.</span>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛍️</span>
          <h1 className="text-2xl font-black text-green-800">
            Ghana<span className="text-yellow-500">Market</span>
          </h1>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
          <a href="/" className="text-green-700 border-b-2 border-green-700 pb-1">Home</a>
          <a href="/products" className="hover:text-green-700 transition-colors">Products</a>
          <a href="#" className="hover:text-green-700 transition-colors">About</a>
          <a href="#" className="hover:text-green-700 transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-green-700 hidden md:block text-xl">🔍</button>
          <button className="text-gray-600 hover:text-green-700 relative hidden md:block text-xl">
            🛒
            <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden md:block truncate max-w-[120px]">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <a
              href="/auth"
              className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors"
            >
              👤 Sign In
            </a>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-yellow-50 px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-bold px-4 py-2 rounded-full mb-6">
              🇬🇭 MADE IN GHANA
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
              Shop Authentic<br />
              <span className="text-green-800">Ghanaian</span><br />
              <span className="text-yellow-500">Products</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-8 max-w-md">
              Discover the finest kente, food, crafts and more — delivered straight to your door.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="/products"
                className="flex items-center gap-2 bg-green-800 text-white font-bold px-8 py-4 rounded-full text-base hover:bg-green-700 shadow-lg transition-all hover:-translate-y-0.5"
              >
                🛍️ Shop Now
              </a>
              <a
                href="#"
                className="flex items-center gap-2 border-2 border-green-800 text-green-800 font-bold px-8 py-4 rounded-full text-base hover:bg-green-800 hover:text-white transition-all"
              >
                🌿 Learn More
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              {["✅ Authentic Products", "🚚 Fast & Reliable Delivery", "🤝 Support Local Businesses"].map((badge) => (
                <span key={badge} className="bg-white border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-full shadow-sm font-medium">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Product Visual */}
          <div className="bg-gradient-to-br from-green-800 to-green-600 rounded-3xl p-10 flex items-center justify-center min-h-[320px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/20 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/30 rounded-full translate-y-10 -translate-x-10" />
            <div className="text-center text-white relative z-10">
              <div className="text-8xl mb-4">🧺</div>
              <div className="flex gap-6 justify-center text-5xl mb-4">
                <span>🧥</span>
                <span>🍯</span>
                <span>🏺</span>
              </div>
              <p className="text-green-200 text-sm font-semibold tracking-wide">Authentic Ghanaian Goods</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-black text-center text-gray-800 mb-2 flex items-center justify-center gap-2">
            🛒 Shop by Category
          </h3>
          <p className="text-center text-gray-400 mb-10 text-sm">Find exactly what you're looking for</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <a
                href={cat.href}
                key={cat.label}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer"
              >
                <p className="text-4xl mb-3">{cat.emoji}</p>
                <p className="font-bold text-gray-800 mb-1">{cat.label}</p>
                <p className="text-green-600 text-sm font-semibold group-hover:underline">Explore →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="bg-green-800 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center text-white">
              <div className="text-3xl mb-2">{f.icon}</div>
              <p className="font-bold text-sm mb-1">{f.title}</p>
              <p className="text-green-300 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Picks */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-black text-center text-gray-800 mb-2">Popular Picks</h3>
          <div className="flex justify-center mb-10">
            <span className="w-12 h-1 bg-yellow-400 rounded-full block" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popularPicks.map((item) => (
              <div
                key={item.name}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer"
              >
                {/* Product Image Area */}
                <div className="relative bg-gray-50 p-6 text-center">
                  <button className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors text-lg">♡</button>
                  <span className="text-5xl">{item.emoji}</span>
                  <span className={`absolute bottom-3 left-3 ${item.color} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
                    {item.category}
                  </span>
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="font-semibold text-gray-800 text-sm leading-tight mb-1">{item.name}</p>
                  <p className="text-green-700 font-black text-sm mb-1">{item.price}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">{"★".repeat(item.rating)}</span>
                    <span className="text-gray-400 text-xs">({item.reviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/products"
              className="bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition-colors inline-block"
            >
              View All Products →
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-50 py-14 px-6">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-6 bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <div className="text-4xl bg-green-100 rounded-2xl p-4">✉️</div>
          <div className="flex-1 text-center md:text-left">
            <p className="font-black text-gray-800 text-lg mb-1">Stay Updated</p>
            <p className="text-gray-500 text-sm">Get the latest deals, new arrivals and exclusive offers.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 rounded-full px-4 py-2 text-sm flex-1 md:w-48 focus:outline-none focus:border-green-500"
            />
            <button className="bg-green-700 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-green-600 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-200 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-green-700 pb-6 mb-6">
            <h1 className="text-xl font-black text-white">
              Ghana<span className="text-yellow-400">Market</span>
            </h1>
            <div className="flex gap-6 text-sm flex-wrap justify-center">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="opacity-30">|</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span className="opacity-30">|</span>
              <a href="#" className="hover:text-white transition-colors">FAQs</a>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="bg-white text-gray-800 px-3 py-1 rounded font-bold text-xs">VISA</span>
              <span className="bg-white text-gray-800 px-3 py-1 rounded font-bold text-xs">MCard</span>
              <span className="bg-white text-gray-800 px-3 py-1 rounded font-bold text-xs">MoMo</span>
            </div>
          </div>
          <p className="text-center text-sm opacity-60">© 2026 GhanaMarket. All rights reserved.</p>
        </div>
      </footer>

    </main>
  );
}
