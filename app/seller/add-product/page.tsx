"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/auth"; return; }

    let image_url = "";

    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, image);

      if (uploadError) {
        setMessage(uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      image_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("products").insert({
      name,
      description,
      price: parseFloat(price),
      category,
      seller_id: user.id,
      image_url,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/seller/dashboard";
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black">Ghana<span className="text-yellow-400">Market</span></h1>
        <a href="/seller/dashboard" className="bg-white text-green-800 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-100">
          ← Back
        </a>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-black text-gray-800 mb-6">Add New Product</h2>

          <label className="text-sm text-gray-600 font-medium">Product Image</label>
          <div className="mt-1 mb-4">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl mb-2" />
            ) : (
              <div className="w-full h-48 bg-green-50 rounded-xl flex items-center justify-center mb-2">
                <p className="text-gray-400 text-sm">No image selected</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-600"
            />
          </div>

          <label className="text-sm text-gray-600 font-medium">Product Name</label>
          <input
            type="text"
            placeholder="e.g. Kente Cloth"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 mt-1 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500"
          />

          <label className="text-sm text-gray-600 font-medium">Description</label>
          <textarea
            placeholder="Describe your product"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 mt-1 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500"
          />

          <label className="text-sm text-gray-600 font-medium">Price (GH₵)</label>
          <input
            type="number"
            placeholder="e.g. 150"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 mt-1 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500"
          />

          <label className="text-sm text-gray-600 font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 mt-1 text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500"
          >
            <option>Fashion</option>
            <option>Food</option>
            <option>Jewelry</option>
            <option>Crafts</option>
            <option>Beauty</option>
            <option>Electronics</option>
            <option>Other</option>
          </select>

          {message && (
            <p className="text-sm text-center mb-4 text-red-500">{message}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-600"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </main>
  );
}