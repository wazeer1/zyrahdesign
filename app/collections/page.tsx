"use client"
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchProducts, Product, ProductCategory, fetchCategories, Category, fetchProductsByCategory, getCountry, convertPrice } from '../lib/api'
import Loader from '../components/Loader'


function CollectionsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [products, setProducts] = useState<Product[]>([])
  console.log(products,"productsproducts");
  
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam ? categoryParam : null
  )
  const [country, setCountry] = useState<string>("US")
  const [convertedPrices, setConvertedPrices] = useState<Record<string, string>>({})
  const selectedCategoryObj = categories.find(c => c._id === categoryParam)
  const categoryName = selectedCategoryObj?.name || ""

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        if(categories.length === 0){
          const categoriesData = await fetchCategories()
          setCategories(categoriesData)
        }
        
        if (!categoryParam){
          // Fetch all products when "All" is selected
          const productsData = await fetchProducts()
          setProducts(productsData)
        }
        else{
          // Fetch products by category
          const productsData = await fetchProductsByCategory(categoryParam)
          setProducts(productsData)
        }
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [categoryParam, categories.length])

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    } else {
      setSelectedCategory(null)
    }
  }, [categoryParam])

  useEffect(() => {
    const loadCountry = async () => {
      const countryCode = await getCountry()
      setCountry(countryCode)
    }
    loadCountry()
  }, [])

  useEffect(() => {
    const convertAllPrices = async () => {
      const prices: Record<string, string> = {}
      for (const product of products) {
        const converted = await convertPrice(product.price, country)
        prices[product._id] = converted
      }
      setConvertedPrices(prices)
    }
    if (products.length > 0 && country) {
      convertAllPrices()
    }
  }, [products, country])
    

  return (
    <div className="font-sans" style={{ backgroundColor: "#F8F8F8", color: "#2D2D2D", scrollBehavior: "smooth" }}>
      <section className="py-20 px-6 lg:px-20 min-h-[80vh]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-normal mb-8 tracking-widest uppercase text-center" style={{ color: "#2D2D2D" }}>
            {selectedCategory &&  categoryName}
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.delete('category');
                window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
                setSelectedCategory(null);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                !selectedCategory
                  ? 'bg-[#B89C60] text-[#2D2D2D]'
                  : 'bg-white text-[#666] border border-gray-200 hover:border-[#B89C60]'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id || category.id}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set('category', category._id);
                  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
                  setSelectedCategory(category._id);
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category._id
                    ? 'bg-[#B89C60] text-[#2D2D2D]'
                    : 'bg-white text-[#666] border border-gray-200 hover:border-[#B89C60]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
           <Loader />
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center py-20">
              <div className="text-lg text-red-600">{error}</div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <>
              {products.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-lg text-gray-600">
                    {selectedCategory ? `No products found in ${categoryName} category.` : "No products available at the moment."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {products.map((product) => (
                    <div key={product._id} className="collection-item p-4 rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition duration-500 text-left">
                      <div className="product-image rounded-md shadow-inner w-full h-80 overflow-hidden">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <h3 className="text-2xl mb-2 mt-2" style={{ color: "#2E4A3B" }}>{product.name}</h3>
                      {/* {product.category && (
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                          {typeof product.category === 'object' && product.category?._id ? product.category._id : ''}
                        </p>
                      )} */}
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-semibold" style={{ color: "#B89C60" }}>
                          {convertedPrices[product._id] || `AED ${product.price.toLocaleString('en-IN')}`}
                        </p>
                        {product.availability !== undefined && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              product.availability
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.availability ? 'In Stock' : 'Out of Stock'}
                          </span>
                        )}
                      </div>
                      <span className='text-[#a44e3c] font-medium text-[12px]'>
                        {product?.quantity !== undefined && product.quantity < 1
                          ? "Out of stock"
                          : product?.quantity !== undefined && product.quantity < 5
                          ? `Only ${product.quantity} left in stock - order soon.`
                          : ""}
                      </span>
                      {product.size && (
                        <p className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">Sizes: </span>
                          {typeof product.size === 'string' 
                            ? (() => {
                                const sizes = product.size.split(',');
                                return sizes.map((s, i) => (
                                  <span key={i} className="inline-block mr-1">
                                    {s.trim()}
                                    {i < sizes.length - 1 && ','}
                                  </span>
                                ));
                              })()
                            : product.size
                          }
                        </p>
                      )}
                      <a
                        href="https://wa.me/+971547081910"
                        className="inline-block text-sm font-semibold hover:underline"
                        style={{ color: "#B89C60" }}
                      >
                         Order Now →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg" style={{ color: "#B89C60" }}>Loading...</div>
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  )
}