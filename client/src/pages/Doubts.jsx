import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "../utils/toast";

export default function Doubts() {
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answerText, setAnswerText] = useState({});
  const [postingAnswer, setPostingAnswer] = useState({});

  const backendUri =
    import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";

  const availableTags = [
    "Ethics",
    "Metaphysics",
    "Epistemology",
    "Logic",
    "Aesthetics",
    "Political Philosophy",
    "Philosophy of Mind",
    "Existentialism",
    "Eastern Philosophy",
    "Ancient Philosophy",
    "Modern Philosophy",
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUri}/api/doubts/all`);
      if (response.data.success) {
        // Backend already formats the data, just use it directly
        setQuestions(response.data.doubts);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (questionId) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) {
      toast.warning("Please enter a question");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to ask a question");
      return;
    }
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${backendUri}/api/doubts/create`,
        { question: newQuestion.trim(), tags: selectedTags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Question posted successfully!");
        setNewQuestion("");
        setSelectedTags([]);
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error(error.response?.data?.message || "Error posting question");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostAnswer = async (questionId) => {
    const answer = answerText[questionId]?.trim();
    if (!answer) {
      toast.warning("Please enter an answer");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to post an answer");
      return;
    }
    try {
      setPostingAnswer({ ...postingAnswer, [questionId]: true });
      const response = await axios.post(
        `${backendUri}/api/responses/create`,
        { doubtId: questionId, response: answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Answer posted successfully!");
        setAnswerText({ ...answerText, [questionId]: "" });
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error posting answer:", error);
      toast.error(error.response?.data?.message || "Error posting answer");
    } finally {
      setPostingAnswer({ ...postingAnswer, [questionId]: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-600 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Philosophy Discussion Forum
          </h1>
          <p className="text-gray-200">
            Ask questions, share insights, and engage in meaningful
            philosophical discussions
          </p>
        </div>

        {/* Question Input Section */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <textarea
                placeholder="Type your question here..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSubmitQuestion}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 h-fit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting..." : "Ask Question"}
            </button>
          </div>

          {/* Tags Selection */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              Select relevant tags:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-gray-400 text-sm">Selected tags:</span>
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-blue-200 hover:text-white ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-gray-300 py-10">
              <div className="animate-pulse">Loading questions...</div>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center text-gray-300 py-10">
              <p className="text-xl">No questions yet. Be the first to ask!</p>
            </div>
          ) : (
            questions.map((question) => (
              <div
                key={question.id}
                className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  question.isExpert
                    ? "border-2 border-blue-500 hover:border-blue-400"
                    : "border border-gray-600 hover:border-gray-500"
                }`}
              >
                {/* Question Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-3 leading-relaxed">
                        {question.question}
                      </h3>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {question.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Date and Time */}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{question.dateTime}</span>
                      </div>
                    </div>

                    {/* Asked by */}
                    <div className="text-right">
                      <div className="flex flex-col gap-2 items-end">
                        {question.isExpert && (
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold border border-blue-500">
                            Expert Thread
                          </span>
                        )}
                        <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm border border-green-500">
                          Asked by: {question.author}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Toggle */}
                  <button
                    onClick={() => toggleDropdown(question.id)}
                    className="flex items-center justify-center w-full py-3 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {isDropdownOpen[question.id]
                          ? "Hide Answers"
                          : "View Answers"}{" "}
                        ({question.answers.length})
                      </span>
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-200 ${
                          isDropdownOpen[question.id] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Answers Section (Dropdown) */}
                {isDropdownOpen[question.id] && (
                  <div className="border-t border-gray-600 bg-gray-750">
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Answers ({question.answers.length})
                      </h4>

                      <div className="space-y-4">
                        {question.answers.map((answer) => (
                          <div
                            key={answer.id}
                            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold">
                                  {answer.author}
                                </span>
                                {answer.verified && (
                                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                                    Verified Expert
                                  </span>
                                )}
                              </div>
                              <span className="text-gray-400 text-sm">
                                {answer.dateTime}
                              </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                              {answer.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Add Answer Section */}
                      <div className="mt-6 p-4 bg-gray-600 rounded-lg border border-gray-500">
                        <textarea
                          placeholder="Add your answer or contribute to the discussion..."
                          value={answerText[question.id] || ""}
                          onChange={(e) =>
                            setAnswerText({
                              ...answerText,
                              [question.id]: e.target.value,
                            })
                          }
                          className="w-full h-20 bg-gray-700 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 mb-3"
                        />
                        <button
                          onClick={() => handlePostAnswer(question.id)}
                          disabled={postingAnswer[question.id]}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {postingAnswer[question.id]
                            ? "Posting..."
                            : "Post Answer"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
