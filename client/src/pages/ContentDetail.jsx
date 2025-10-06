import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "../utils/toast";

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  const backendUri =
    import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";

  useEffect(() => {
    fetchContent();
  }, [id]);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${backendUri}/api/content/${id}`);
      if (response.data.success) {
        setContent(response.data.content);
      } else {
        console.error("Failed to fetch content:", response.data.message);
        navigate("/content");
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      navigate("/content");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to like content");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    setIsLiking(true);
    try {
      const response = await axios.post(
        `${backendUri}/api/content/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setContent((prev) => ({
          ...prev,
          likeCount: response.data.likeCount,
          isLiked: response.data.isLiked,
        }));
      }
    } catch (error) {
      console.error("Error liking content:", error);
      if (error.response?.status === 401) {
        toast.warning("Please login to like content");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error("Failed to like content");
      }
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Content Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The content you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/content")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/content")}
          className="mb-8 inline-flex items-center space-x-2 px-6 py-3 bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-full shadow-md border border-gray-200 transition-all duration-300 transform hover:scale-105"
        >
          <span className="text-lg">←</span>
          <span className="font-semibold">Back to Content</span>
        </button>

        {/* Content Article */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="p-10 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-6">
              <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {content.category}
              </span>
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                <span>⏱️</span>
                <span>{content.readTime} min read</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-800">
              {content.title}
            </h1>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl mb-6">
              <p className="text-xl text-gray-700 leading-relaxed font-medium italic">
                {content.description}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {content.author?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-base font-semibold text-gray-900">
                    {content.author?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center space-x-1">
                    <span>📅</span>
                    <span>
                      {content.timeAgo ||
                        new Date(content.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-10 bg-white">
            <div className="prose prose-xl max-w-none">
              {content.fullContent?.split("\n").map(
                (paragraph, index) =>
                  paragraph.trim() && (
                    <p
                      key={index}
                      className="mb-8 text-gray-700 leading-loose text-lg first-letter:text-4xl first-letter:font-bold first-letter:text-blue-500 first-letter:float-left first-letter:mr-2 first-letter:mt-1"
                    >
                      {paragraph}
                    </p>
                  )
              )}
            </div>
          </div>

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="px-10 pb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {content.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Section */}
          <div className="px-10 py-8 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-center">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-md ${
                  content.isLiked
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-red-200"
                } ${
                  isLiking ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <span className="text-2xl group-hover:animate-pulse">
                  {content.isLiked ? "❤️" : "🤍"}
                </span>
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {content.likeCount || content.likes?.length || 0}
                  </div>
                  <div className="text-sm opacity-75">Likes</div>
                </div>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ContentDetail;
