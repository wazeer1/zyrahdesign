"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCategories, Category } from "../../lib/api";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";

export default function Collections() {
  const [categories, setCategories] = useState<Category[]>([]);
  console.log(categories, "categoriescategories");

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (category: any) => {
    router.push(`/collections?category=${category._id}`);
  };
  return (
    <div
      className="font-sans"
      style={{
        backgroundColor: "#F8F8F8",
        color: "#2D2D2D",
        scrollBehavior: "smooth",
      }}
    >
      {/* ===== COLLECTIONS SECTION ===== */}
      <section
        className="py-20 px-6 lg:px-20 min-h-[80vh] flex flex-col items-center text-center"
        style={{ backgroundColor: "#F8F8F8" }}
      >
        <h2
          className="text-4xl font-normal mb-12 tracking-widest uppercase"
          style={{ color: "#2D2D2D" }}
        >
          The Core ZYRAH Collections
        </h2>

        {/* Categories Grid */}
        {loading ? (
          <Loader />
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">
              No categories available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full mt-10">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => {
                  handleCategoryClick(category);
                }}
                className="collection-item rounded-xl border-2 border-gray-200 bg-white hover:shadow-2xl transition duration-500 text-center group overflow-hidden"
              >
                {/* Category Image */}
                <div className="w-full h-64 overflow-hidden bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    // className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.src = `https://placehold.co/600x600/2d2d2d/b89c60?text=${encodeURIComponent(
                        category.name
                      )}`;
                    }}
                  />
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <h3
                    className="text-2xl font-semibold mb-2 group-hover:text-[#B89C60] transition-colors"
                    style={{ color: "#2E4A3B" }}
                  >
                    {category.name}
                  </h3>
                  <div className="w-20 h-1 mx-auto bg-[#B89C60] group-hover:w-32 transition-all duration-300 mb-4"></div>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {category.description}
                    </p>
                  )}
                 
                  <span className="inline-block text-sm font-semibold text-[#B89C60] group-hover:underline">
                    Shop Now →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
