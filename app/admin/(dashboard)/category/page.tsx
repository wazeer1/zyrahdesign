"use client";
import {
  Category,
  createCategory,
  deleteCategory,
  fetchCategories,
  Product,
  updateCategory,
} from "@/app/lib/api";
import React, { useEffect, useState } from "react";

const page = () => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 11;
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    imagePreview: "",
  });

  const handleOpenCategoryModal = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: "",
      description: "",
      image: null,
      imagePreview: "",
    });
    setIsCategoryModalOpen(true);
  };

  const filterCategories = (categoriesList: Category[]) => {
    if (!searchQuery.trim()) {
      return categoriesList;
    }
    const query = searchQuery.toLowerCase();
    return categoriesList.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.image.toString().includes(query) ||
        (category.description &&
          category.description.toLowerCase().includes(query))
    );
  };
  // Get paginated categories
  const getPaginatedCategories = () => {
    const filtered = filterCategories(categories);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const getTotalPages = () => {
    const filtered = filterCategories(categories);
    return Math.ceil(filtered.length / itemsPerPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
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

  const handleOpenEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
      image: null,
      imagePreview: category.image,
    });
    setIsCategoryModalOpen(true);
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

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryFormData({
      name: "",
      description: "",
      image: null,
      imagePreview: "",
    });
  };

  const handleSaveCategory = async () => {
    if (
      !categoryFormData.name ||
      (!categoryFormData.image && !categoryFormData.imagePreview)
    ) {
      alert("Please fill in category name and image");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      if (editingCategory) {
        await updateCategory(editingCategory._id, {
          name: categoryFormData.name,
          description: categoryFormData.description,
          ...(categoryFormData.image && { image: categoryFormData.image }),
        });
      } else {
        if (!categoryFormData.image) {
          alert("Please select an image");
          return;
        }
        await createCategory({
          name: categoryFormData.name,
          description: categoryFormData.description,
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

  useEffect(() => {
    // Check if user is authenticated
    loadCategories();
  }, []);
  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-[#2D2D2D]">
              Category Management
            </h2>
            <p className="text-sm" style={{ color: "#666" }}>
              Manage product categories
            </p>
          </div>

          <button
            onClick={handleOpenCategoryModal}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#B89C60",
              color: "#2D2D2D",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#B89C60";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#B89C60";
              }
            }}
          >
            <span className="text-xl leading-none">+</span>
            Add Category
          </button>
        </div>
        {categories.length > 0 && (
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search categories by name or description..."
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            />
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.length === 0 ? (
            <div
              className="col-span-full text-center py-8"
              style={{ color: "#666" }}
            >
              No categories found. Click "Add Category" to create one.
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-3"
                style={{ borderColor: "#E5E5E5" }}
              >
                <div className="w-full h-24 mb-2 overflow-hidden rounded bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/200x200/2d2d2d/b89c60?text=${encodeURIComponent(
                        category.name
                      )}`;
                    }}
                  />
                </div>
                <p
                  className="text-sm font-medium mb-2 text-center"
                  style={{ color: "#2D2D2D" }}
                >
                  {category.name}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditCategoryModal(category)}
                    disabled={isLoading}
                    className="flex-1 px-2 py-1 rounded text-xs font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "#B89C60",
                      color: "#2D2D2D",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    disabled={isLoading}
                    className="flex-1 px-2 py-1 rounded text-xs font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "#DC2626",
                      color: "#FFFFFF",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Pagination Controls */}
        {getTotalPages() > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm" style={{ color: "#666" }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filterCategories(categories).length
              )}{" "}
              of {filterCategories(categories).length} categories
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                  setCurrentPage((prev) => Math.min(getTotalPages(), prev + 1))
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

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#2D2D2D" }}
                  >
                    Description
                  </label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) =>
                      setCategoryFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{
                      borderColor: "#E5E5E5",
                      backgroundColor: "#F8F8F8",
                      color: "#2D2D2D",
                      minHeight: "100px",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#B89C60";
                      e.currentTarget.style.backgroundColor = "#FFFFFF";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#E5E5E5";
                      e.currentTarget.style.backgroundColor = "#F8F8F8";
                    }}
                    placeholder="Enter category description (optional)"
                    rows={4}
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
    </>
  );
};

export default page;
