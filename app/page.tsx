export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-black text-green-700">Ghana<span className="text-yellow-500">Market</span></h1>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-green-700">Home</a>
          <a href="#" className="hover:text-green-700">Products</a>
          <a href="#" className="hover:text-green-700">About</a>
        </div>
       <a href="/auth" className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600">
  Sign In
</a>
      </nav>

      {/* Hero */}
      <section className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-yellow-600 flex items-center justify-center text-center px-6 pt-20">
        <div className="max-w-2xl">
          <span className="bg-yellow-400 text-green-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
            🇬🇭 Made in Ghana
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mt-6 mb-4 leading-tight">
            Shop Authentic<br/>
            <span className="text-yellow-400">Ghanaian Products</span>
          </h2>
          <p className="text-green-100 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Discover the finest kente, food, crafts and more — delivered straight to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 text-green-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-300 shadow-lg">
              Shop Now
            </button>
            <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white hover:text-green-900">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 bg-gray-50">
        <h3 className="text-2xl md:text-3xl font-black text-center text-gray-800 mb-10">Shop by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {["👗 Fashion", "🍱 Food", "💎 Jewelry", "🏺 Crafts"].map((cat) => (
            <div key={cat} className="bg-white rounded-2xl p-5 text-center shadow hover:shadow-md cursor-pointer hover:-translate-y-1 transition-all">
              <p className="text-3xl mb-2">{cat.split(" ")[0]}</p>
              <p className="font-semibold text-gray-700">{cat.split(" ")[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-200 text-center py-6 text-sm">
        © 2026 GhanaMarket. All rights reserved.
      </footer>
    </main>
  );
}