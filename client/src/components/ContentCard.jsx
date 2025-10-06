import React, { useState } from "react";
import { toast } from "../utils/toast";

const ContentCard = ({ content, onLike, onContentClick, currentUser }) => {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!currentUser) {
      toast.warning("Please login to like content");
      return;
    }

    setIsLiking(true);
    try {
      await onLike(content._id);
    } catch (error) {
      console.error("Error liking content:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const isLiked = currentUser && content.likes.includes(currentUser._id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div onClick={() => onContentClick(content)} className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
          {content.title}
        </h3>

        <div className="flex items-center mb-3 text-sm text-gray-600">
          <span className="font-medium">{content.author.name}</span>
          <span className="mx-2">•</span>
          <span>{content.timeAgo}</span>
          <span className="mx-2">•</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            {content.category}
          </span>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">{content.description}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            disabled={isLiking}
            className={`flex items-center space-x-1 hover:text-red-600 transition-colors ${
              isLiked ? "text-red-600" : ""
            }`}
          >
            <svg
              className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{content.likeCount}</span>
          </button>

          <div className="flex items-center space-x-1">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{content.commentCount}</span>
          </div>

          <div className="flex items-center space-x-1">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span>{content.shares}</span>
          </div>
        </div>

        <button
          onClick={() => onContentClick(content)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          Read More →
        </button>
      </div>
    </div>
  );
};

export default ContentCard;
