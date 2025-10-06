import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "../utils/toast";

const EditContentModal = ({
  isOpen,
  onClose,
  contentToEdit,
  onContentUpdated,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullContent: "",
    category: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  const backendUri =
    import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";

  const categories = [
    "Metaphysics",
    "Ethics",
    "Logic",
    "Aesthetics",
    "Political Philosophy",
    "Philosophy of Mind",
    "Epistemology",
    "Philosophy of Science",
    "Eastern Philosophy",
    "Western Philosophy",
    "Other",
  ];

  // Populate form when editing
  useEffect(() => {
    if (contentToEdit && isOpen) {
      setFormData({
        title: contentToEdit.title || "",
        description: contentToEdit.description || "",
        fullContent: contentToEdit.fullContent || "",
        category: contentToEdit.category || "",
        tags: contentToEdit.tags?.join(", ") || "",
      });
    }
  }, [contentToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${backendUri}/api/content/${contentToEdit._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Content updated successfully!");
        onContentUpdated(response.data.content);
        onClose();
      }
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error(error.response?.data?.message || "Error updating content");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Content</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter content title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of your content"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tags separated by commas (e.g., ethics, virtue, morality)"
              />
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Content *
              </label>
              <textarea
                name="fullContent"
                value={formData.fullContent}
                onChange={handleChange}
                required
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your complete philosophical content here..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Updating..." : "Update Content"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditContentModal;
