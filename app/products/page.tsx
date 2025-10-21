"use client";
import ProductGrid from "@/components/products/ProductGrid";

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <button className="btn-primary">
        Primary Button
      </button>
      {/* Or use the direct utility classes */}
      <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
        Primary Button (Direct)
      </button>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ProductGrid />
    </div>
  );
}
