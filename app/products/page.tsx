import { supabase } from "@/lib/supabase";

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from("products")
    .select("*");

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-black text-green-700">
          Ghana<span className="text-yellow-500">Market</span>
        </a>
        <a href="/auth" className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600">
          Sign In
        </a>
      </nav>

      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-gray-800 mb-8">All Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow hover:shadow-md transition-all overflow-hidden">
              <div className="bg-green-100 h-40 flex items-center justify-center">
                <span className="text-5xl">🛍️</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-green-700 font-semibold mb-1">{product.category}</p>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{product.description}</p>
                <p className="text-green-700 font-black">GH₵ {product.price}</p>
                <button className="w-full mt-3 bg-green-700 text-white text-sm py-2 rounded-xl hover:bg-green-600">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}