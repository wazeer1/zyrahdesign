"use client"
import React, { useEffect, useState } from 'react'
import { fetchLookbooks } from '../lib/api';
import type { Lookbook } from "@/app/lib/api";



export default function Lookbook() {
  const [lookBook, setLookBook] = useState<Lookbook[]>([])
  console.log(lookBook,"lookBooklookBook")
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

  
  const lookbookItems = [
    {
      title: 'Office Wear',
      description: 'Polished silhouettes that seamlessly transition from boardroom to evening engagements.',
      image:
        'https://i5.walmartimages.com/seo/Aloohaidyvio-Formal-Dresses-Women-Formal-Women-Gowns-Evening-Party-Cocktail-Dress-Split-Elegant-V-Neck-Wrap-Ruffle-Wedding-Guest_3c24828a-8591-4047-8d28-43d2155ee361.57f8521d42eef068afa8392e69a04d4f.jpeg',
      borderColor: '#B89C60',
    },
    {
      title: 'Evening Look',
      description: 'An elevated palette of glamour—fluid drapes and shimmering accents for nightfall moments.',
      image:
        'https://www.vampal.co.uk/content/res/large/l634/0063446_elegant_chic_wedding_evening_dresses_chiffon_slim_bridesmaid_dress_party_formal_occasion_high_qualit_wm.jpeg',
      borderColor: '#2E4A3B',
    },
    {
      title: 'Weekend Comfort',
      description: 'Relaxed layers crafted for effortless style, perfect for languid afternoons and slow brunches.',
      image: 'https://beyourself.pk/cdn/shop/files/153.jpg?v=1701181223',
      borderColor: '#B89C60',
    },
    {
      title: 'Formal Event',
      description: 'Sophisticated ensembles that celebrate modern opulence for your most memorable occasions.',
      image: 'https://cdn-appdata.seasonsindia.com/uploads/feature_images/2-1180301.jpg',
      borderColor: '#2E4A3B',
    },
      ]
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
          {lookBook.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col h-full rounded-xl border-2 border-dashed shadow-md hover:shadow-2xl transition duration-300 overflow-hidden"
             
            >
              <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={`Lookbook ${item.image}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-6 text-left">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#B89C60] transition-colors" style={{ color: '#2E4A3B' }}>
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 flex-1">{item.description}</p>
                <a    
                 href="https://wa.me/9562479175"        
                  className="mt-6 self-start px-5 py-2 text-sm font-semibold rounded-full border border-[#B89C60] text-[#B89C60] hover:bg-[#B89C60] hover:text-[#2D2D2D] transition-colors"
                  style={{ letterSpacing: '0.12em' }}
                >
                  Order Now →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

