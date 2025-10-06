import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "../utils/toast";

const CreateSeminarModal = ({
  isOpen,
  onClose,
  onSeminarCreated,
  seminarToEdit = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    place: "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);

  const backendUri =
    import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";

  const isEditMode = !!seminarToEdit;

  // Populate form when editing
  useEffect(() => {
    if (seminarToEdit) {
      setFormData({
        title: seminarToEdit.title || "",
        description: seminarToEdit.description || "",
        imageUrl: seminarToEdit.image || seminarToEdit.imageUrl || "",
        place: seminarToEdit.place || "",
        date: seminarToEdit.date ? seminarToEdit.date.split("T")[0] : "",
        startTime: seminarToEdit.timing?.startTime || "",
        endTime: seminarToEdit.timing?.endTime || "",
      });
    } else {
      // Reset form for create mode
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        place: "",
        date: "",
        startTime: "",
        endTime: "",
      });
    }
  }, [seminarToEdit, isOpen]);

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

      let response;
      if (isEditMode) {
        // Update existing seminar
        response = await axios.put(
          `${backendUri}/api/seminars/${seminarToEdit._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new seminar
        response = await axios.post(
          `${backendUri}/api/seminars/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        toast.success(
          `Seminar ${isEditMode ? "updated" : "created"} successfully!`
        );
        onSeminarCreated(response.data.seminar);
        onClose();
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} seminar:`,
        error
      );
      toast.error(
        error.response?.data?.message ||
          `Error ${isEditMode ? "updating" : "creating"} seminar`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Seminar" : "Create New Seminar"}
            </h2>
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
                Seminar Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Buddhist Philosophy: The Four Noble Truths"
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
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what will be covered in this seminar..."
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a URL for the seminar image. Leave empty for default
                image.
              </p>
            </div>

            {/* Place */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue/Location *
              </label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., India Habitat Centre, Lodhi Road, Delhi"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                {loading ? "Creating..." : "Create Seminar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSeminarModal;
