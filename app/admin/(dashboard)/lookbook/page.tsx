"use client";
import {
  Lookbook,
  createLookbook,
  deleteLookbook,
  fetchLookbooks,
  updateLookbook,
} from "@/app/lib/api";
import React, { useEffect, useState } from "react";

const LookbookPage = () => {
  const [editingLookbook, setEditingLookbook] = useState<Lookbook | null>(null);
  const [isLookbookModalOpen, setIsLookbookModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
  const [lookbookFormData, setLookbookFormData] = useState({
    name: "",
    image: null as File | null,
    imagePreview: "",
    description: ""
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const loadLookbooks = async () => {
    try {
      const data = await fetchLookbooks();
      setLookbooks(data);
    } catch (err) {
      console.error("Error loading lookbooks:", err);
      
    }
  };

  const handleOpenLookbookModal = () => {
    setEditingLookbook(null);
    setLookbookFormData({ name: "", image: null, imagePreview: "", description:"" });
    setIsLookbookModalOpen(true);
  };

  const handleCloseLookbookModal = () => {
    setIsLookbookModalOpen(false);
    setEditingLookbook(null);
    setLookbookFormData({ name: "", image: null, imagePreview: "",description:"" });
  };

  const handleOpenEditLookbookModal = (lookbook: Lookbook) => {
    setEditingLookbook(lookbook);
    setLookbookFormData({
      name: lookbook.name,
      image: null,
      imagePreview: lookbook.image,
      description: lookbook.description || ""
    });
    setIsLookbookModalOpen(true);
  };

  const handleLookbookImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLookbookFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteLookbook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lookbook?")) return;

    try {
      setIsLoading(true);
      await deleteLookbook(id);
      await loadLookbooks();
    } catch (err) {
      console.error("Error deleting lookbook:", err);
      alert(err instanceof Error ? err.message : "Failed to delete lookbook");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLookbook = async () => {
    if (
      !lookbookFormData.name ||
      (!lookbookFormData.image && !lookbookFormData.imagePreview)
    ) {
      alert("Please fill in lookbook name and image");
      return;
    }

    try {
      setIsLoading(true);
      if (editingLookbook) {
        await updateLookbook(editingLookbook._id, {
          name: lookbookFormData.name,
          ...(lookbookFormData.image && { image: lookbookFormData.image }),
          description: lookbookFormData.description
        });
      } else {
        if (!lookbookFormData.image) {
          alert("Please select an image");
          return;
        }
        await createLookbook({
          name: lookbookFormData.name,
          image: lookbookFormData.image,
          description: lookbookFormData.description
        });
      }

      await loadLookbooks();
      handleCloseLookbookModal();
    } catch (err) {
      console.error("Error saving lookbook:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to save lookbook"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLookbooks();
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
       
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-[#2D2D2D]">Lookbook Management</h2>
            <p className="text-sm text-gray-600">Manage lookbooks</p>
          </div>
          <button
            onClick={handleOpenLookbookModal}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#B89C60", color: "#2D2D2D" }}
          >
            <span className="text-xl leading-none text-[#2D2D2D]">+</span>
            Add Lookbook
          </button>
        </div>

        {/* Lookbooks Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {lookbooks.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-600">
              No lookbooks found. Click "Add Lookbook" to create one.
            </div>
          ) : (
            lookbooks.map((lookbook) => (
              <div
                key={lookbook._id}
                className="border rounded-lg p-3 border-gray-200"
              >
                <div className="w-full h-24 mb-2 overflow-hidden rounded bg-gray-100">
                  <img
                    src={lookbook.image}
                    alt={lookbook.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/200x200/2d2d2d/b89c60?text=${encodeURIComponent(
                        lookbook.name
                      )}`;
                    }}
                  />
                </div>
                <p className="text-sm font-medium mb-2 text-center text-gray-800">
                  {lookbook.name}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditLookbookModal(lookbook)}
                    disabled={isLoading}
                    className="flex-1 px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: "#B89C60", color: "#2D2D2D" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLookbook(lookbook._id)}
                    disabled={isLoading}
                    className="flex-1 px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: "#DC2626", color: "#FFFFFF" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lookbook Modal */}
      {isLookbookModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[85vh] flex flex-col">
            {/* Header */}
            <div
              className="flex justify-between items-center p-6 border-b"
              style={{ borderColor: "#E5E5E5" }}
            >
              <h3 className="text-2xl font-bold text-[#2D2D2D]">
                {editingLookbook ? "Edit Lookbook" : "Add Lookbook"}
              </h3>
              <button
                onClick={handleCloseLookbookModal}
                className="text-2xl text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6">
              {lookbookFormData.imagePreview && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={lookbookFormData.imagePreview}
                    alt="Lookbook preview"
                    className="max-w-xs h-40 object-contain rounded-lg bg-gray-100"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">
                    Lookbook Image <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLookbookImageUpload}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#E5E5E5",
                      backgroundColor: "#F8F8F8",
                      color: "#2D2D2D",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">
                    Lookbook Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={lookbookFormData.name}
                    onChange={(e) =>
                      setLookbookFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter lookbook name"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#E5E5E5",
                      backgroundColor: "#F8F8F8",
                      color: "#2D2D2D",
                    }}
                  />
                  
                  {errorMessage && (
                    <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                  )}
                </div>
                <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={lookbookFormData.description}
                    onChange={(e) =>
                      setLookbookFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter description"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#E5E5E5",
                      backgroundColor: "#F8F8F8",
                      color: "#2D2D2D",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex gap-4 p-6 border-t"
              style={{ borderColor: "#E5E5E5" }}
            >
              <button
                onClick={handleSaveLookbook}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#B89C60", color: "#2D2D2D" }}
              >
                {isLoading
                  ? "Saving..."
                  : editingLookbook
                  ? "Update Lookbook"
                  : "Add Lookbook"}
              </button>
              <button
                onClick={handleCloseLookbookModal}
                className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 border"
                style={{ borderColor: "#E5E5E5", color: "#2D2D2D" }}
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

export default LookbookPage;
