import React, { useEffect, useState } from 'react'
import { fetchLookbooks } from "@/app/lib/api";
import type { Lookbook } from "@/app/lib/api";
import Loader from '@/app/components/Loader';


function Lookbook() {
  const [lookBook, setLookBook] = useState<Lookbook[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchLookbooks();
        setLookBook(data);
        console.log(data,"datadata");
        
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      } 
    };

    loadCategories();
  }, []);
  return (
    <div className="font-sans" style={{ backgroundColor: "#F8F8F8", color: "#2D2D2D", scrollBehavior: "smooth" }}>

      {/* ===== LOOKBOOK SECTION ===== */}
      <section
        className="py-20 px-6 lg:px-20 min-h-0 flex flex-col items-center text-center"
        style={{ backgroundColor: "#F5F3ED" }}
      >
        <h2 className="text-4xl font-normal mb-10 tracking-widest uppercase" style={{ color: "#2D2D2D" }}>
          The ZYRAH Lookbook
        </h2>
        <p className="max-w-xl text-lg mb-12 text-gray-700">
          Visual Storytelling: A curated selection of our finest drapes, styled for every occasion, embodying sophisticated comfort.
        </p>

        {/* Image Grid */}
        {
          loading ? <Loader /> 
          :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
          {lookBook.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col h-full rounded-xl border-2 border-dashed shadow-md hover:shadow-2xl transition duration-300 overflow-hidden"
              style={{ borderColor: "#B89C60"}}
            >
              <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={`Lookbook ${item.name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-6 text-left">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#B89C60] transition-colors" style={{ color: '#2E4A3B' }}>
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 flex-1">
                  {item.description}
                </p>
                <a    
                 href="https://wa.me/+971547081910"        
                  className="mt-6 self-start px-5 py-2 text-sm font-semibold rounded-full border border-[#B89C60] text-[#B89C60] hover:bg-[#B89C60] hover:text-[#2D2D2D] transition-colors"
                  style={{ letterSpacing: '0.12em' }}
                >
                  SHOP NOW →
                </a>
              </div>
            </div>
          ))}
        </div>
        }
        
      </section>
    </div>
  )
}

export default Lookbook