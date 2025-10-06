import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const navigate = useNavigate();

  const backendUri =
    import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";

  const philosophicalQuotes = [
    {
      quote: "The unexamined life is not worth living.",
      author: "Socrates",
      context: "Ancient Greek Philosophy",
    },
    {
      quote: "I think, therefore I am.",
      author: "René Descartes",
      context: "Modern Philosophy",
    },
    {
      quote:
        "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.",
      author: "Jean-Paul Sartre",
      context: "Existentialism",
    },
    {
      quote: "The only true wisdom is in knowing you know nothing.",
      author: "Socrates",
      context: "Epistemology",
    },
    {
      quote:
        "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      author: "Aristotle",
      context: "Ethics & Virtue",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(
        (prevIndex) => (prevIndex + 1) % philosophicalQuotes.length
      );
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
                <p className="text-sm text-blue-600">Enthusiast Dashboard</p>
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
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome, {user.name}!
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      🎓 Philosophy Enthusiast
                    </span>
                    <span className="text-green-600 font-medium">● Online</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                Ready to embark on your philosophical journey? Explore
                discussions, ask questions, and connect with wisdom from our
                community of thinkers.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What would you like to do today?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/doubts")}
                  className="flex items-center justify-center p-6 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-lg">❓</span>
                    </div>
                    <div className="font-medium text-gray-900">
                      Ask a Question
                    </div>
                    <div className="text-sm text-gray-500">
                      Get answers from philosophers
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/doubts")}
                  className="flex items-center justify-center p-6 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-lg">💭</span>
                    </div>
                    <div className="font-medium text-gray-900">
                      Browse Discussions
                    </div>
                    <div className="text-sm text-gray-500">
                      Join ongoing conversations
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/seminars")}
                  className="flex items-center justify-center p-6 border-2 border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-lg">📚</span>
                    </div>
                    <div className="font-medium text-gray-900">
                      Attend Seminars
                    </div>
                    <div className="text-sm text-gray-500">
                      Learn from experts
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/content")}
                  className="flex items-center justify-center p-6 border-2 border-orange-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-lg">📚</span>
                    </div>
                    <div className="font-medium text-gray-900">
                      Read Content
                    </div>
                    <div className="text-sm text-gray-500">
                      Explore philosophical articles
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Member since:</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900 font-medium">
                    {user.email}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-900 font-medium">
                    {user.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Journey
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">❓</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Questions Asked
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {user.doubts?.length || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">💭</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Answers Given
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {user.responses?.length || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📚</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Discussions Started
                    </span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {(user.doubts?.length || 0) + (user.responses?.length || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophical Quote Carousel */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="text-center text-white min-h-[200px] flex flex-col justify-center px-12 md:px-16">
              <div className="mb-4">
                <span className="text-6xl opacity-30">"</span>
              </div>
              <blockquote className="text-lg md:text-xl lg:text-2xl font-serif italic mb-6 leading-relaxed transition-all duration-500 max-w-4xl mx-auto">
                {philosophicalQuotes[currentQuoteIndex].quote}
              </blockquote>
              <div className="space-y-2">
                <p className="text-base md:text-lg font-semibold">
                  — {philosophicalQuotes[currentQuoteIndex].author}
                </p>
                <p className="text-sm text-blue-200">
                  {philosophicalQuotes[currentQuoteIndex].context}
                </p>
              </div>
            </div>

            {/* Quote Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {philosophicalQuotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuoteIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuoteIndex
                      ? "bg-white w-8"
                      : "bg-white bg-opacity-40 hover:bg-opacity-60"
                  }`}
                  aria-label={`Go to quote ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center -translate-y-1/2">
              <button
                onClick={() =>
                  setCurrentQuoteIndex((prev) =>
                    prev === 0 ? philosophicalQuotes.length - 1 : prev - 1
                  )
                }
                className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all duration-200 shadow-lg"
                aria-label="Previous quote"
              >
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setCurrentQuoteIndex(
                    (prev) => (prev + 1) % philosophicalQuotes.length
                  )
                }
                className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all duration-200 shadow-lg"
                aria-label="Next quote"
              >
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
