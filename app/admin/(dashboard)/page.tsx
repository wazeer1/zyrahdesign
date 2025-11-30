"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
  Lookbook,
  fetchLookbooks,
} from "../../lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null,
    imagePreview: "",
    lookbook: "",
    category: "",
    size: [] as string[],
    availability: true,
    quantity: "",
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    image: null as File | null,
    imagePreview: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("adminAuthenticated");
    const adminUser = localStorage.getItem("adminUsername");

    if (authStatus === "true" && adminUser) {
      setIsAuthenticated(true);
      setUsername(adminUser);
      // Load products and categories from API
      loadProducts();
      loadCategories();
    } else {
      // Redirect to login if not authenticated
      router.push("/admin/login");
    }
  }, [router]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchProducts();
      const lookbookData = await fetchLookbooks();
      setLookbooks(lookbookData);
      setProducts(data);
      setCurrentPage(1); // Reset to first page when loading products
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    // Store the File object and create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      image: null,
      imagePreview: "",
      lookbook: "",
      category: "",
      size: [],
      availability: true,
      quantity: "",
    });
    setIsModalOpen(true);
  };
  console.log(formData, "productproduct");

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    // Convert size string to array if it exists
    const sizeArray = product.size
      ? typeof product.size === "string"
        ? product.size.split(",").map((s) => s.trim())
        : [product.size]
      : [];
    const primaryImage =
      (product.images && product.images.length > 0 && product.images[0]) ||
      (typeof product.image === "string" ? product.image : "");
    console.log(product.category, "____");

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: null,
      imagePreview: primaryImage,
      lookbook: (product as any).lookbook,
      category:
        typeof product.category === "object" &&
        product.category !== null &&
        "_id" in product.category
          ? product.category._id
          : typeof product.category === "string"
          ? product.category
          : "",
      size: sizeArray,
      availability:
        product.availability !== undefined ? product.availability : true,
      quantity: (product.quantity || 0).toString(),
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      image: null,
      imagePreview: "",
      lookbook: "",
      category: "",
      size: [],
      availability: true,
      quantity: "",
    });
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => {
      const currentSizes = prev.size;
      if (currentSizes.includes(size)) {
        return { ...prev, size: currentSizes.filter((s) => s !== size) };
      } else {
        return { ...prev, size: [...currentSizes, size] };
      }
    });
  };

  // Category management handlers
  const handleOpenCategoryModal = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: "",
      image: null,
      imagePreview: "",
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      image: null,
      imagePreview: category.image,
    });
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryFormData({
      name: "",
      image: null,
      imagePreview: "",
    });
  };

  const handleCategoryImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    // Store the File object and create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCategoryFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSaveCategory = async () => {
    if (
      !categoryFormData.name ||
      (!categoryFormData.image && !categoryFormData.imagePreview)
    )
      try {
        setIsLoading(true);
        setError(null);
        if (editingCategory) {
          await updateCategory(editingCategory._id, {
            name: categoryFormData.name,
            ...(categoryFormData.image && { image: categoryFormData.image }),
          });
        } else {
          if (!categoryFormData.image) {
            alert("Please select an image");
            return;
          }
          await createCategory({
            name: categoryFormData.name,
            image: categoryFormData.image,
          });
        }

        await loadCategories();
        handleCloseCategoryModal();
      } catch (err) {
        console.error("Error saving category:", err);
        alert(
          err instanceof Error
            ? err.message
            : "Failed to save category. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? Products using this category will need to be updated."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete category. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (
      !formData.name?.trim() ||
      !formData.description?.trim() ||
      !formData.price ||
      (!formData.image && !formData.imagePreview) ||
      !formData.category ||
      !formData.lookbook
    ) {
      alert(
        "Please fill in all required fields (Name, Category, Description, Price, Image)"
      );
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Convert size array to comma-separated string for backend
      const sizeString =
        formData.size.length > 0 ? formData.size.join(", ") : undefined;

      if (editingProduct) {
        // Update existing product via API
        await updateProduct(editingProduct._id, {
          name: formData.name,
          description: formData.description,
          price: price,
          category: formData.category || undefined,
          size: sizeString,
          availability: formData.availability,
          lookbook: formData.lookbook,
          quantity: formData.quantity ? Number(formData.quantity) : undefined,
          ...(formData.image && { image: formData.image }),
        });
      } else {
        // Add new product via API
        if (!formData.image) {
          alert("Please select an image");
          return;
        }
        await createProduct({
          _id: "",
          name: formData.name,
          description: formData.description,
          price: price,
          image: formData.image,
          lookbook: formData.lookbook,
          category: formData.category || undefined,
          size: sizeString,
          availability: formData.availability,
          quantity: formData.quantity ? Number(formData.quantity) : undefined,
        });
      }

      // Reload products from API to ensure we have the latest data
      await loadProducts();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving product:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save product. Please try again."
      );
      alert(
        err instanceof Error
          ? err.message
          : "Failed to save product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await deleteProduct(id);
      await loadProducts();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      // Reset to first page if current page becomes empty
      const filtered = filterProducts(products.filter((p) => p.id !== id));
      const totalPages = Math.ceil(filtered.length / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (totalPages === 0) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Inline quantity update
  const handleQuantityChange = async (
    product: Product,
    newQuantity: number
  ) => {
    if (newQuantity < 0) return;
    try {
      setIsLoading(true);
      await updateProduct(product._id, { quantity: newQuantity });
      // Update local state to reflect change immediately
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, quantity: newQuantity } : p
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search query
  const filterProducts = (productsList: Product[]) => {
    if (!searchQuery.trim()) {
      return productsList;
    }
    const query = searchQuery.toLowerCase();
    return productsList.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.price.toString().includes(query)
    );
  };

  // Get paginated products
  const getPaginatedProducts = () => {
    const filtered = filterProducts(products);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const getTotalPages = () => {
    const filtered = filterProducts(products);
    return Math.ceil(filtered.length / itemsPerPage);
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const loadLookbooks = async () => {
    try {
      const data = await fetchLookbooks();
      setLookbooks(data);
    } catch (err) {
      console.error("Error loading lookbooks:", err);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F8F8F8", color: "#2D2D2D" }}
    >
      <div className="">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Product Management</h2>
              <p className="text-sm" style={{ color: "#666" }}>
                Manage your products
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#B89C60",
                color: "#2D2D2D",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#c0a569";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#B89C60";
                }
              }}
            >
              <span className="text-xl leading-none">+</span>
              Add Product
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm"
              style={{
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
              }}
            >
              {error}
              <button onClick={loadProducts} className="ml-2 underline">
                Retry
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products by name, description, or price..."
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: "#E5E5E5",
                backgroundColor: "#F8F8F8",
                color: "#2D2D2D",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#B89C60";
                e.currentTarget.style.backgroundColor = "#FFFFFF";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#E5E5E5";
                e.currentTarget.style.backgroundColor = "#F8F8F8";
              }}
            />
          </div>

          {/* Loading State */}
          {isLoading && products.length === 0 && (
            <div className="text-center py-8" style={{ color: "#666" }}>
              Loading products...
            </div>
          )}

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "#E5E5E5" }}>
                  <th
                    className="text-left py-3 px-4 font-semibold"
                    style={{ color: "#2D2D2D" }}
                  >
                    SL No
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold"
                    style={{ color: "#2D2D2D" }}
                  >
                    Product Image
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold"
                    style={{ color: "#2D2D2D" }}
                  >
                    Product Name
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold"
                    style={{ color: "#2D2D2D" }}
                  >
                    Product Description
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold"
                    style={{ color: "#2D2D2D" }}
                  >
                    Product Price
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold"
                    style={{ color: "#2D2D2D" }}
                  >
                    Quantity
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold"
                    style={{ color: "#2D2D2D" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedProducts().length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8"
                      style={{ color: "#666" }}
                    >
                      {searchQuery
                        ? "No products found matching your search."
                        : 'No products found. Click "Add Product" to create one.'}
                    </td>
                  </tr>
                ) : (
                  getPaginatedProducts().map((product, index) => {
                    const globalIndex =
                      (currentPage - 1) * itemsPerPage + index;
                    return (
                      <tr
                        key={product._id}
                        className="border-b hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "#E5E5E5" }}
                      >
                        <td className="py-3 px-4" style={{ color: "#2D2D2D" }}>
                          {globalIndex + 1}
                        </td>
                        <td className="py-3 px-4">
                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td
                          className="py-3 px-4 font-medium"
                          style={{ color: "#2D2D2D" }}
                        >
                          {product.name}
                        </td>
                        <td className="py-3 px-4" style={{ color: "#666" }}>
                          <div
                            className="max-w-xs truncate"
                            title={product.description}
                          >
                            {product.description}
                          </div>
                        </td>
                        <td
                          className="py-3 px-4 font-medium"
                          style={{ color: "#2D2D2D" }}
                        >
                          {product.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">{product.quantity}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              disabled={isLoading}
                              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                backgroundColor: "#B89C60",
                                color: "#2D2D2D",
                              }}
                              onMouseEnter={(e) => {
                                if (!isLoading) {
                                  e.currentTarget.style.backgroundColor =
                                    "#c0a569";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isLoading) {
                                  e.currentTarget.style.backgroundColor =
                                    "#B89C60";
                                }
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={isLoading}
                              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                backgroundColor: "#DC2626",
                                color: "#FFFFFF",
                              }}
                              onMouseEnter={(e) => {
                                if (!isLoading) {
                                  e.currentTarget.style.backgroundColor =
                                    "#B91C1C";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isLoading) {
                                  e.currentTarget.style.backgroundColor =
                                    "#DC2626";
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {getTotalPages() > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm" style={{ color: "#666" }}>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  filterProducts(products).length
                )}{" "}
                of {filterProducts(products).length} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: currentPage === 1 ? "#E5E5E5" : "#B89C60",
                    color: "#2D2D2D",
                  }}
                >
                  Previous
                </button>
                {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(
                  (page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === getTotalPages() ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                          style={{
                            backgroundColor:
                              currentPage === page ? "#2D2D2D" : "#B89C60",
                            color: currentPage === page ? "#B89C60" : "#2D2D2D",
                          }}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span
                          key={page}
                          className="px-2"
                          style={{ color: "#666" }}
                        >
                          ...
                        </span>
                      );
                    }
                    return <span key={page} style={{ display: "none" }} />;
                  }
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(getTotalPages(), prev + 1)
                    )
                  }
                  disabled={currentPage === getTotalPages()}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor:
                      currentPage === getTotalPages() ? "#E5E5E5" : "#B89C60",
                    color: "#2D2D2D",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col"
              style={{ color: "#2D2D2D" }}
            >
              {/* Fixed Header */}
              <div
                className="flex justify-between items-center p-6 border-b shrink-0"
                style={{ borderColor: "#E5E5E5" }}
              >
                <h3 className="text-2xl font-bold">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-2xl leading-none"
                  style={{ color: "#666" }}
                >
                  ×
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6">
                {/* Product Image Preview */}
                {formData.imagePreview && (
                  <div className="mb-6 flex justify-center">
                    <img
                      src={formData.imagePreview}
                      alt="Product preview"
                      className="max-w-xs h-40 object-contain rounded-lg bg-gray-100"
                    />
                  </div>
                )}

                {/* Product Form */}
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#2D2D2D" }}
                    >
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: "#E5E5E5",
                        backgroundColor: "#F8F8F8",
                        color: "#2D2D2D",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#2D2D2D" }}
                    >
                      Product Name <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: "#E5E5E5",
                        backgroundColor: "#F8F8F8",
                        color: "#2D2D2D",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#B89C60";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#E5E5E5";
                        e.currentTarget.style.backgroundColor = "#F8F8F8";
                      }}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#2D2D2D" }}
                    >
                      Quantity <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: "#E5E5E5",
                        backgroundColor: "#F8F8F8",
                        color: "#2D2D2D",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#B89C60";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#E5E5E5";
                        e.currentTarget.style.backgroundColor = "#F8F8F8";
                      }}
                      placeholder="Enter quantity"
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#2D2D2D" }}
                    >
                      Category <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <select
                      value={formData?.category}
                      onChange={(e) => {
                        console.log(e.target.value);

                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: "#E5E5E5",
                        backgroundColor: "#F8F8F8",
                        color: "#2D2D2D",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#B89C60";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#E5E5E5";
                        e.currentTarget.style.backgroundColor = "#F8F8F8";
                      }}
                      required
                    >
                      <option value="" className="text-[#7ba1c3]">
                        Select Category
                      </option>
                      {categories.map((cat) => (
                        <option value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#2D2D2D" }}
                    >
                      Lookbook <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <select
                      value={formData.lookbook}
                      onChange={(e) => {
                        console.log(e.target.value);

                        setFormData((prev) => ({
                          ...prev,
                          lookbook: e.target.value,
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: "#E5E5E5",
                        backgroundColor: "#F8F8F8",
                        color: "#2D2D2D",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#B89C60";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#E5E5E5";
                        e.currentTarget.style.backgroundColor = "#F8F8F8";
                      }}
                      required
                    >
                      <option value="">Select Lookbook</option>
                      {lookbooks.map((look) => (
                        <option key={look._id} value={look._id}>
                          {look.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#2D2D2D" }}
                    >
                      Size (Select Multiple)
                    </label>
                    <div
                      className="grid grid-cols-4 gap-3 p-4 rounded-lg border"
                      style={{
                        borderColor: "#E5E5E5",
                        backgroundColor: "#F8F8F8",
                      }}
                    >
                      {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                        <label
                          key={size}
                          className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.size.includes(size)}
                            onChange={() => handleSizeToggle(size)}
                            className="w-4 h-4"
                            style={{ accentColor: "#B89C60" }}
                          />
                          <span style={{ color: "#2D2D2D" }}>{size}</span>
                        </label>
                      ))}
                    </div>
                    {formData.size.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Selected: {formData.size.join(", ")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#2D2D2D" }}
                    >
                      Product Description{" "}
                      <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                      style={{
                        borderColor: "#E5E5E5",
                        backgroundColor: "#F8F8F8",
                        color: "#2D2D2D",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#B89C60";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#E5E5E5";
                        e.currentTarget.style.backgroundColor = "#F8F8F8";
                      }}
                      placeholder="Enter product description"
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#2D2D2D" }}
                    >
                      Product Price <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: "#E5E5E5",
                        backgroundColor: "#F8F8F8",
                        color: "#2D2D2D",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#B89C60";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#E5E5E5";
                        e.currentTarget.style.backgroundColor = "#F8F8F8";
                      }}
                      placeholder="Enter product price"
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#2D2D2D" }}
                    >
                      Availability
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="availability"
                          checked={formData.availability === true}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              availability: true,
                            }))
                          }
                          className="w-4 h-4"
                          style={{ accentColor: "#B89C60" }}
                        />
                        <span style={{ color: "#2D2D2D" }}>In Stock</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="availability"
                          checked={formData.availability === false}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              availability: false,
                            }))
                          }
                          className="w-4 h-4"
                          style={{ accentColor: "#B89C60" }}
                        />
                        <span style={{ color: "#2D2D2D" }}>Out of Stock</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div
                className="flex gap-4 p-6 border-t shrink-0"
                style={{ borderColor: "#E5E5E5" }}
              >
                <button
                  onClick={handleSaveProduct}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "#B89C60",
                    color: "#2D2D2D",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "#2D2D2D";
                      e.currentTarget.style.color = "#B89C60";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "#B89C60";
                      e.currentTarget.style.color = "#2D2D2D";
                    }
                  }}
                >
                  {isLoading
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 border"
                  style={{
                    borderColor: "#E5E5E5",
                    color: "#2D2D2D",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F8F8F8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Category Modal */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[85vh] flex flex-col"
              style={{ color: "#2D2D2D" }}
            >
              {/* Fixed Header */}
              <div
                className="flex justify-between items-center p-6 border-b shrink-0"
                style={{ borderColor: "#E5E5E5" }}
              >
                <h3 className="text-2xl font-bold">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h3>
                <button
                  onClick={handleCloseCategoryModal}
                  className="text-2xl leading-none"
                  style={{ color: "#666" }}
                >
                  ×
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6">
                {/* Category Image Preview */}
                {categoryFormData.imagePreview && (
                  <div className="mb-6 flex justify-center">
                    <img
                      src={categoryFormData.imagePreview}
                      alt="Category preview"
                      className="max-w-xs h-40 object-contain rounded-lg bg-gray-100"
                    />
                  </div>
                )}

                {/* Category Form */}
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#2D2D2D" }}
                    >
                      Category Image <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageUpload}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: "#E5E5E5",
                        backgroundColor: "#F8F8F8",
                        color: "#2D2D2D",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#2D2D2D" }}
                    >
                      Category Name <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.name}
                      onChange={(e) =>
                        setCategoryFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: "#E5E5E5",
                        backgroundColor: "#F8F8F8",
                        color: "#2D2D2D",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#B89C60";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#E5E5E5";
                        e.currentTarget.style.backgroundColor = "#F8F8F8";
                      }}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div
                className="flex gap-4 p-6 border-t shrink-0"
                style={{ borderColor: "#E5E5E5" }}
              >
                <button
                  onClick={handleSaveCategory}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "#B89C60",
                    color: "#2D2D2D",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "#2D2D2D";
                      e.currentTarget.style.color = "#B89C60";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "#B89C60";
                      e.currentTarget.style.color = "#2D2D2D";
                    }
                  }}
                >
                  {isLoading
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Add Category"}
                </button>
                <button
                  onClick={handleCloseCategoryModal}
                  className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 border"
                  style={{
                    borderColor: "#E5E5E5",
                    color: "#2D2D2D",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F8F8F8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
