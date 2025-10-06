import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CreateSeminarModal from "../components/CreateSeminarModal";
import CreateContentModal from "../components/CreateContentModal";
import EditContentModal from "../components/EditContentModal";
import axios from "axios";

export default function PhilosopherProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [userSeminars, setUserSeminars] = useState([]);
  const [userContents, setUserContents] = useState([]);
  const [editingSeminar, setEditingSeminar] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [isEditContentModalOpen, setIsEditContentModalOpen] = useState(false);
  const navigate = useNavigate();

  const backendUri =
    import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${backendUri}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUser(response.data.user);
          // Fetch user's seminars and content
          fetchUserSeminars();
          fetchUserContents();
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, backendUri]);

  const fetchUserSeminars = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          `${backendUri}/api/seminars/my/seminars`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          console.log("Fetched seminars:", response.data.seminars);
          response.data.seminars.forEach((sem, idx) => {
            console.log(`Seminar ${idx} [${sem.title}] - image:`, sem.image);
          });
          setUserSeminars(response.data.seminars);
        }
      }
    } catch (error) {
      console.error("Error fetching user seminars:", error);
    }
  };

  const fetchUserContents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${backendUri}/api/content/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setUserContents(response.data.contents);
        }
      }
    } catch (error) {
      console.error("Error fetching user contents:", error);
    }
  };

  const handleContentCreated = (newContent) => {
    setUserContents((prev) => [newContent, ...prev]);
  };

  const handleSeminarCreated = (newSeminar) => {
    if (editingSeminar) {
      // Update existing seminar in the list
      setUserSeminars((prev) =>
        prev.map((seminar) =>
          seminar._id === editingSeminar._id ? newSeminar : seminar
        )
      );
      setEditingSeminar(null);
    } else {
      // Add new seminar to the list
      setUserSeminars((prev) => [newSeminar, ...prev]);
    }
  };

  const handleEditSeminar = (seminar) => {
    setEditingSeminar(seminar);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingSeminar(null);
  };

  const handleDeleteSeminar = async (seminarId) => {
    if (!window.confirm("Are you sure you want to delete this seminar?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUri}/api/seminars/${seminarId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove seminar from state
      setUserSeminars((prev) =>
        prev.filter((seminar) => seminar._id !== seminarId)
      );
      alert("Seminar deleted successfully!");
    } catch (error) {
      console.error("Error deleting seminar:", error);
      alert(error.response?.data?.message || "Error deleting seminar");
    }
  };

  const handleEditContent = (contentId) => {
    console.log("Editing content with ID:", contentId);

    const contentToEdit = userContents.find(
      (content) => content._id === contentId
    );

    console.log("Found content to edit:", contentToEdit);

    if (contentToEdit) {
      setEditingContent(contentToEdit);
      setIsEditContentModalOpen(true);
    } else {
      alert("Content not found for editing.");
    }
  };

  const handleDeleteContent = async (contentId) => {
    console.log("Deleting content with ID:", contentId);

    if (!contentId) {
      alert("Content ID is missing. Cannot delete content.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this content?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUri}/api/content/${contentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove content from state
      setUserContents((prev) =>
        prev.filter((content) => content._id !== contentId)
      );
      alert("Content deleted successfully!");
    } catch (error) {
      console.error("Error deleting content:", error);
      alert(error.response?.data?.message || "Error deleting content");
    }
  };

  const handleContentUpdated = (updatedContent) => {
    setUserContents((prev) =>
      prev.map((content) =>
        content._id === updatedContent._id ? updatedContent : content
      )
    );
    setIsEditContentModalOpen(false);
    setEditingContent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  PhilosophyHub
                </h1>
                <p className="text-sm text-blue-600">Philosopher Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome, {user.name}!
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      🧠 Philosopher
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Seminar Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-md p-8 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Create a New Seminar
                  </h2>
                  <p className="text-purple-100 mb-4">
                    Share your philosophical insights with the community
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      console.log("Create Seminar button clicked");
                      setEditingSeminar(null);
                      setIsCreateModalOpen(true);
                    }}
                    className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span className="text-xl">➕</span>
                    <span>Create Seminar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/doubts")}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-lg">💭</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      Start Discussion
                    </div>
                    <div className="text-sm text-gray-500">Share insights</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/content")}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-lg">📚</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      Create Content
                    </div>
                    <div className="text-sm text-gray-500">Write articles</div>
                  </div>
                </button>
              </div>
            </div>

            {/* My Content Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Content ({userContents.length})
                </h2>
                <button
                  onClick={() => setIsContentModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  + Create Content
                </button>
              </div>

              {userContents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">📝</span>
                  </div>
                  <p className="text-gray-500 mb-4">No content created yet</p>
                  <button
                    onClick={() => setIsContentModalOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Create Your First Content
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userContents.map((content, index) => {
                    console.log(`Content ${index}:`, content);
                    return (
                      <div
                        key={content._id || `content-${index}`}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3
                            className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer flex-1"
                            onClick={() => navigate(`/content/${content._id}`)}
                          >
                            {content.title}
                          </h3>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {content.category}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditContent(content._id);
                              }}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteContent(content._id);
                              }}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p
                          className="text-gray-600 text-sm mb-3 line-clamp-2 cursor-pointer"
                          onClick={() => navigate(`/content/${content._id}`)}
                        >
                          {content.description}
                        </p>
                        <div
                          className="flex items-center justify-between text-sm text-gray-500 cursor-pointer"
                          onClick={() => navigate(`/content/${content._id}`)}
                        >
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              ❤️ {content.likeCount}
                            </span>
                            <span className="flex items-center">
                              💬 {content.commentCount}
                            </span>
                            <span className="flex items-center">
                              📤 {content.shares}
                            </span>
                          </div>
                          <span>{content.timeAgo}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* My Seminars Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Seminars ({userSeminars.length})
                </h2>
                <button
                  onClick={() => {
                    setEditingSeminar(null);
                    setIsCreateModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  + Create New
                </button>
              </div>

              {userSeminars.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">📚</span>
                  </div>
                  <p className="text-gray-500 mb-4">No seminars created yet</p>
                  <button
                    onClick={() => {
                      setEditingSeminar(null);
                      setIsCreateModalOpen(true);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Create Your First Seminar
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {userSeminars.map((seminar) => (
                    <div
                      key={seminar._id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
                    >
                      {/* Seminar Image - Always show */}
                      <div className="w-full h-48 overflow-hidden bg-gray-200">
                        <img
                          src={
                            seminar.image ||
                            "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=250&fit=crop"
                          }
                          alt={seminar.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=250&fit=crop";
                          }}
                        />
                      </div>

                      {/* Seminar Content */}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {seminar.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {seminar.description}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <span>📍 {seminar.place}</span>
                              <span>
                                📅 {new Date(seminar.date).toLocaleDateString()}
                              </span>
                              <span>
                                ⏰ {seminar.timing.startTime} -{" "}
                                {seminar.timing.endTime}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col items-end space-y-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                seminar.status === "upcoming"
                                  ? "bg-green-100 text-green-800"
                                  : seminar.status === "ongoing"
                                  ? "bg-blue-100 text-blue-800"
                                  : seminar.status === "completed"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {seminar.status}
                            </span>
                            <button
                              onClick={() => handleEditSeminar(seminar)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSeminar(seminar._id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl">👨‍🏫</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-1">
                {user.name}
              </h3>
              <p className="text-gray-500 text-center text-sm mb-4">
                Philosophy Expert
              </p>
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📧</span>
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📱</span>
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📅</span>
                  <span>
                    Since{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Your Impact
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">📝</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Content
                    </span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {userContents.length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">🎓</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Seminars
                    </span>
                  </div>
                  <span className="text-xl font-bold text-purple-600">
                    {userSeminars.length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">✨</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Total Posts
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    {userContents.length + userSeminars.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🔗</span>
                Quick Links
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/doubts")}
                  className="w-full flex items-center p-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group"
                >
                  <span className="mr-3 text-lg group-hover:scale-110 transition-transform">
                    💭
                  </span>
                  <span className="font-medium">Discussions</span>
                </button>
                <button
                  onClick={() => navigate("/seminars")}
                  className="w-full flex items-center p-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-all duration-200 group"
                >
                  <span className="mr-3 text-lg group-hover:scale-110 transition-transform">
                    🎓
                  </span>
                  <span className="font-medium">All Seminars</span>
                </button>
                <button
                  onClick={() => navigate("/content")}
                  className="w-full flex items-center p-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 group"
                >
                  <span className="mr-3 text-lg group-hover:scale-110 transition-transform">
                    📚
                  </span>
                  <span className="font-medium">Browse Content</span>
                </button>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <span className="text-2xl mr-3">💡</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Pro Tip
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Engage with discussions regularly to build your reputation
                    and help students grow!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Seminar Modal */}
      {isCreateModalOpen && (
        <CreateSeminarModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          onSeminarCreated={handleSeminarCreated}
          seminarToEdit={editingSeminar}
        />
      )}

      {/* Create Content Modal */}
      {isContentModalOpen && (
        <CreateContentModal
          isOpen={isContentModalOpen}
          onClose={() => setIsContentModalOpen(false)}
          onContentCreated={handleContentCreated}
        />
      )}

      {/* Edit Content Modal */}
      {isEditContentModalOpen && (
        <EditContentModal
          isOpen={isEditContentModalOpen}
          onClose={() => {
            setIsEditContentModalOpen(false);
            setEditingContent(null);
          }}
          contentToEdit={editingContent}
          onContentUpdated={handleContentUpdated}
        />
      )}
    </div>
  );
}
