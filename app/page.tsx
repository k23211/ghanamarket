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
  { icon: "🏅", title: "100% Authentic" },
  { icon: "🚚", title: "Fast Delivery" },
  { icon: "🔒", title: "Secure Payments" },
  { icon: "🎧", title: "24/7 Support" },
];

const popularPicks = [
  { name: "Kente Jacket", price: "GHS 350", category: "Fashion", color: "bg-blue-500", emoji: "🧥", rating: 5, reviews: 24 },
  { name: "Natural Honey", price: "GHS 60", category: "Food", color: "bg-yellow-500", emoji: "🍯", rating: 5, reviews: 18 },
  { name: "Beaded Bracelet", price: "GHS 45", category: "Jewelry", color: "bg-purple-500", emoji: "📿", rating: 5, reviews: 32 },
  { name: "Carved Mask", price: "GHS 120", category: "Crafts", color: "bg-orange-500", emoji: "🗿", rating: 5, reviews: 15 },
];

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <main className="min-h-screen bg-white font-sans">

      {/* Announcement Bar */}
      <div className="bg-green-800 text-green-100 text-xs text-center py-1.5 px-4">
        🇬🇭 MADE IN GHANA &nbsp;·&nbsp; Supporting local, empowering communities.
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">🛍️</span>
          <h1 className="text-xl font-black text-green-800">
            Ghana<span className="text-yellow-500">Market</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-semibold text-gray-600">
          <a href="/" className="text-green-700 border-b-2 border-green-700 pb-0.5">Home</a>
          <a href="/products" className="hover:text-green-700">Products</a>
          <a href="#" className="hover:text-green-700">About</a>
          <a href="#" className="hover:text-green-700">Contact</a>
        </div>
        <div className="flex items-center gap-2">
          <a href="/products" className="text-gray-500 text-lg md:hidden">🔍</a>
          {user ? (
            <button onClick={handleSignOut} className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-600">
              Sign Out
            </button>
          ) : (
            <a href="/auth" className="bg-green-700 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-green-600">
              👤 Sign In
            </a>
          )}
        </div>
      </nav>

      {/* Hero — compact on mobile */}
      <section className="bg-gradient-to-br from-green-50 to-yellow-50 px-4 pt-6 pb-4">
        <div className="max-w-6xl mx-auto md:grid md:grid-cols-2 md:gap-10 md:items-center">
          <div>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
              🇬🇭 MADE IN GHANA
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-2">
              Shop Authentic<br />
              <span className="text-green-800">Ghanaian</span>{" "}
              <span className="text-yellow-500">Products</span>
            </h2>
            <p className="text-gray-500 text-sm mb-4 max-w-sm">
              Discover the finest kente, food, crafts and more — delivered straight to your door.
            </p>

            {/* Buttons — side by side on mobile */}
            <div className="flex gap-3 mb-4">
              <a href="/products" className="flex-1 text-center bg-green-800 text-white font-bold px-4 py-3 rounded-full text-sm hover:bg-green-700 shadow-md transition-all">
                🛍️ Shop Now
              </a>
              <a href="#" className="flex-1 text-center border-2 border-green-800 text-green-800 font-bold px-4 py-3 rounded-full text-sm hover:bg-green-800 hover:text-white transition-all">
                🌿 Learn More
              </a>
            </div>

            {/* Trust badges — horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {["✅ Authentic", "🚚 Fast Delivery", "🤝 Local Support"].map((b) => (
                <span key={b} className="whitespace-nowrap bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full shadow-sm font-medium flex-shrink-0">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Hero visual — hidden on small mobile, shown on md+ */}
          <div className="hidden md:flex bg-gradient-to-br from-green-800 to-green-600 rounded-3xl p-8 items-center justify-center min-h-[280px] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full -translate-y-12 translate-x-12" />
            <div className="text-center text-white relative z-10">
              <div className="text-7xl mb-3">🧺</div>
              <div className="flex gap-5 justify-center text-4xl mb-3"><span>🧥</span><span>🍯</span><span>🏺</span></div>
              <p className="text-green-200 text-xs font-semibold tracking-wide">Authentic Ghanaian Goods</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories — compact */}
      <section className="py-5 px-4 bg-white">
        <h3 className="text-base font-black text-gray-800 mb-3 flex items-center gap-1">🛒 Shop by Category</h3>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <a
              href={cat.href}
              key={cat.label}
              className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <p className="text-2xl mb-1">{cat.emoji}</p>
              <p className="font-bold text-gray-700 text-xs">{cat.label}</p>
              <p className="text-green-600 text-xs mt-0.5 group-hover:underline hidden md:block">Explore →</p>
            </a>
          ))}
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-green-800 py-4 px-4">
        <div className="grid grid-cols-4 gap-2 max-w-5xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="text-center text-white">
              <div className="text-xl mb-0.5">{f.icon}</div>
              <p className="font-bold text-xs leading-tight">{f.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Picks — horizontal scroll on mobile */}
      <section className="py-5 px-4 bg-white">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-black text-gray-800">🔥 Popular Picks</h3>
          <a href="/products" className="text-green-600 text-xs font-semibold">View all →</a>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-4">
          {popularPicks.map((item) => (
            <div
              key={item.name}
              className="flex-shrink-0 w-36 md:w-auto bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative bg-gray-50 p-4 text-center">
                <button className="absolute top-2 right-2 text-gray-300 hover:text-red-400 text-sm">♡</button>
                <span className="text-4xl">{item.emoji}</span>
                <span className={`absolute bottom-2 left-2 ${item.color} text-white text-xs px-1.5 py-0.5 rounded-full font-semibold`}>
                  {item.category}
                </span>
              </div>
              <div className="p-2">
                <p className="font-semibold text-gray-800 text-xs leading-tight mb-0.5">{item.name}</p>
                <p className="text-green-700 font-black text-sm">{item.price}</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-yellow-400 text-xs">{"★".repeat(item.rating)}</span>
                  <span className="text-gray-400 text-xs">({item.reviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter — compact */}
      <section className="bg-green-50 py-5 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="text-3xl bg-green-100 rounded-xl p-3">✉️</div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-black text-gray-800 text-sm mb-0.5">Stay Updated</p>
            <p className="text-gray-400 text-xs">Get latest deals and new arrivals.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 rounded-full px-3 py-2 text-xs flex-1 focus:outline-none focus:border-green-500"
            />
            <button className="bg-green-700 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-green-600 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-300 py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <h1 className="text-lg font-black text-white">Ghana<span className="text-yellow-400">Market</span></h1>
          <div className="flex gap-4 text-xs flex-wrap justify-center">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">FAQs</a>
          </div>
          <div className="flex gap-1.5">
            <span className="bg-white text-gray-800 px-2 py-0.5 rounded text-xs font-bold">VISA</span>
            <span className="bg-white text-gray-800 px-2 py-0.5 rounded text-xs font-bold">MCard</span>
            <span className="bg-white text-gray-800 px-2 py-0.5 rounded text-xs font-bold">MoMo</span>
          </div>
        </div>
        <p className="text-center text-xs opacity-50 mt-3">© 2026 GhanaMarket. All rights reserved.</p>
      </footer>

    </main>
  );
}
