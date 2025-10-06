import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaFilter,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import ContentCard from "../components/ContentCard";
import CreateContentModal from "../components/CreateContentModal";
import { Toaster, toast } from "react-hot-toast";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";

const trendingTopics = [
  "Existentialism",
  "Modern Ethics",
  "Political Philosophy",
  "Eastern Philosophy",
  "Metaphysics",
];
const Content = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [timePeriod, setTimePeriod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isPhilosopher = currentUser && currentUser.userType === "philosopher";

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch(`${BACKEND_URI}/api/content`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched content data:", data);

        // Handle different response structures
        const contentArray = data.contents || data.content || data || [];
        setContents(contentArray);
        setFilteredContents(contentArray);
      } else {
        console.error(
          "Failed to fetch content:",
          response.status,
          response.statusText
        );
        setContents([]);
        setFilteredContents([]);
      }
    } catch (error) {
      console.error("Error fetching contents:", error);
      setContents([]);
      setFilteredContents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter contents based on selected filters
  useEffect(() => {
    if (!contents || !Array.isArray(contents)) {
      setFilteredContents([]);
      return;
    }

    let filtered = [...contents];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((content) =>
        selectedCategories.includes(content.category)
      );
    }

    // Time period filter
    if (timePeriod !== "all") {
      const now = new Date();
      filtered = filtered.filter((content) => {
        const contentDate = new Date(content.createdAt);
        switch (timePeriod) {
          case "week":
            return now - contentDate <= 7 * 24 * 60 * 60 * 1000;
          case "month":
            return now - contentDate <= 30 * 24 * 60 * 60 * 1000;
          case "year":
            return now - contentDate <= 365 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (content) =>
          content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          content.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContents(filtered);
  }, [selectedCategories, timePeriod, searchQuery, contents]);

  const handleLike = async (contentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URI}/api/content/${contentId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedContent = await response.json();
        setContents((prev) =>
          prev.map((content) =>
            content._id === contentId ? updatedContent : content
          )
        );
      }
    } catch (error) {
      console.error("Error liking content:", error);
    }
  };

  const handleContentClick = (content) => {
    navigate(`/content/${content._id}`);
  };

  const handleContentCreated = (newContent) => {
    setContents((prev) => [newContent, ...prev]);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setTimePeriod("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-1/5 bg-white p-4 rounded-lg shadow-md h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaFilter /> Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Reset
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border rounded pl-8"
                />
                <FaSearch className="absolute left-2 top-3 text-gray-400" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Categories</h3>
                {[
                  "Ethics",
                  "Metaphysics",
                  "Logic",
                  "Epistemology",
                  "Aesthetics",
                  "Political Philosophy",
                  "Philosophy of Mind",
                  "Philosophy of Religion",
                  "Philosophy of Science",
                  "Other",
                ].map((category) => (
                  <div key={category} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-2"
                    />
                    <label htmlFor={category} className="text-sm">
                      {category}
                    </label>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Time Period</h3>
                <select
                  className="w-full p-2 border rounded"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-3/5 space-y-4">
            {/* Create Content Button for Philosophers */}
            {isPhilosopher && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Create New Content
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8 bg-white rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading content...</p>
              </div>
            ) : !filteredContents || filteredContents.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg">
                <p className="text-gray-500">
                  No content found matching your criteria
                </p>
              </div>
            ) : (
              filteredContents.map((content) => (
                <ContentCard
                  key={content._id}
                  content={content}
                  onLike={handleLike}
                  onContentClick={handleContentClick}
                  currentUser={currentUser}
                />
              ))
            )}
          </div>

          {/* Right Sidebar - Trending */}
          <div className="w-1/5 bg-white p-4 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4">Trending Topics</h2>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <p className="font-medium">{topic}</p>
                  <p className="text-sm text-gray-500">
                    {100 - index * 10} discussions
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Content Modal */}
      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onContentCreated={handleContentCreated}
      />
      <Toaster position="top-right" />
    </div>
  );
};

export default Content;
