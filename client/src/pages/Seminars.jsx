import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";

export default function Seminars() {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sample fallback data for when server is not available
  const sampleSeminars = [
    {
      _id: "sample1",
      title:
        "Vedanta Philosophy: Understanding Advaita and the Nature of Brahman",
      description:
        "Explore the fundamental principles of Vedanta and its impact on Indian philosophy",
      hostName: "Dr. Priya Sharma",
      place: "India Habitat Centre, Lodhi Road, Delhi",
      date: "2025-10-15",
      timing: { startTime: "2:00 PM", endTime: "4:00 PM" },
      tags: ["Vedanta", "Indian Philosophy", "Advaita"],
      status: "upcoming",
      maxAttendees: 50,
      attendees: [],
      imageUrl:
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=250&fit=crop",
    },
    {
      _id: "sample2",
      title: "Buddhist Philosophy: The Four Noble Truths and Madhyamaka School",
      description:
        "Understanding the Four Noble Truths and the path to enlightenment",
      hostName: "Prof. Rajesh Kumar",
      place: "Nalanda University, Bihar",
      date: "2025-10-22",
      timing: { startTime: "10:00 AM", endTime: "12:00 PM" },
      tags: ["Buddhism", "Mindfulness", "Madhyamaka"],
      status: "upcoming",
      maxAttendees: 40,
      attendees: [],
      imageUrl:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop",
    },
    {
      _id: "sample3",
      title:
        "Yoga Philosophy: The Eight Limbs of Patanjali and Self-Realization",
      description:
        "Discover the spiritual and philosophical foundations of yoga practice",
      hostName: "Dr. Anita Desai",
      place: "Bal Bhavan Auditorium, Gomti Nagar, Lucknow",
      date: "2025-11-05",
      timing: { startTime: "3:00 PM", endTime: "5:00 PM" },
      tags: ["Yoga", "Patanjali", "Self-Realization"],
      status: "upcoming",
      maxAttendees: 60,
      attendees: [],
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    },
    {
      _id: "sample4",
      title:
        "Kashmir Shaivism: Consciousness and Divine Energy in Trika Philosophy",
      description:
        "Explore the mystical traditions of Kashmir Shaivism and consciousness studies",
      hostName: "Prof. Vikram Singh",
      place: "University of Kashmir, Srinagar",
      date: "2025-11-12",
      timing: { startTime: "11:00 AM", endTime: "1:00 PM" },
      tags: ["Kashmir Shaivism", "Consciousness", "Trika"],
      status: "upcoming",
      maxAttendees: 35,
      attendees: [],
      imageUrl:
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=250&fit=crop",
    },
    {
      _id: "sample5",
      title: "Samkhya Philosophy: Dualism, Purusha, and Prakriti",
      description:
        "Understanding the fundamental dualism in Samkhya philosophical system",
      hostName: "Dr. Meera Krishnan",
      place: "Rajghat Education Centre, Varanasi",
      date: "2025-11-19",
      timing: { startTime: "9:00 AM", endTime: "11:00 AM" },
      tags: ["Samkhya", "Dualism", "Purusha"],
      status: "upcoming",
      maxAttendees: 45,
      attendees: [],
      imageUrl:
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=250&fit=crop",
    },
    {
      _id: "sample6",
      title:
        "Jain Philosophy: Ahimsa, Anekantavada, and the Ethics of Non-Violence",
      description:
        "Exploring Jain principles of non-violence and multiple perspectives",
      hostName: "Prof. Arjun Mehta",
      place: "Jain Vishva Bharati Institute, Rajasthan",
      date: "2025-12-03",
      timing: { startTime: "4:00 PM", endTime: "6:00 PM" },
      tags: ["Jainism", "Ahimsa", "Anekantavada"],
      status: "upcoming",
      maxAttendees: 55,
      attendees: [],
      imageUrl:
        "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=250&fit=crop",
    },
    {
      _id: "sample7",
      title:
        "Postmodernism and Deconstruction: Derrida, Foucault, and the Critique of Truth",
      description:
        "Examining postmodern philosophical challenges to traditional concepts",
      hostName: "Dr. Kavita Iyer",
      place: "Constitution Club of India, Rafi Marg, Delhi",
      date: "2025-12-10",
      timing: { startTime: "3:00 PM", endTime: "5:00 PM" },
      tags: ["Postmodernism", "Deconstruction", "Critical Theory"],
      status: "upcoming",
      maxAttendees: 70,
      attendees: [],
      imageUrl:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
    },
    {
      _id: "sample8",
      title:
        "Feminist Philosophy: Gender, Power, and the Reconstruction of Knowledge",
      description:
        "Exploring feminist critiques and contributions to philosophical discourse",
      hostName: "Prof. Sunita Reddy",
      place: "University of Mumbai, Maharashtra",
      date: "2025-12-17",
      timing: { startTime: "2:00 PM", endTime: "4:00 PM" },
      tags: ["Feminism", "Gender Studies", "Epistemology"],
      status: "upcoming",
      maxAttendees: 65,
      attendees: [],
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    },
    {
      _id: "sample9",
      title:
        "Philosophy of Technology: AI, Digital Ethics, and Human Enhancement",
      description:
        "Examining ethical implications of technology and artificial intelligence",
      hostName: "Dr. Rohit Gupta",
      place: "Sangam Kala Group Auditorium, Hazratganj, Lucknow",
      date: "2025-12-24",
      timing: { startTime: "10:00 AM", endTime: "12:00 PM" },
      tags: ["Technology", "AI Ethics", "Digital Philosophy"],
      status: "upcoming",
      maxAttendees: 80,
      attendees: [],
      imageUrl:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop",
    },
  ];

  useEffect(() => {
    // Immediately show sample data to prevent empty state
    setSeminars(sampleSeminars);
    setLoading(false);

    // Then try to fetch from API
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${BACKEND_URI}/api/seminars`);

      // Ensure response.data is an array
      const seminarData = response.data;
      console.log("Fetched seminar data from API:", seminarData);
      if (Array.isArray(seminarData) && seminarData.length > 0) {
        console.log("Setting seminars from array:", seminarData);
        seminarData.forEach((sem, idx) => {
          console.log(`Seminar ${idx} [${sem.title}] - image:`, sem.image);
        });
        setSeminars(seminarData);
      } else if (
        seminarData &&
        Array.isArray(seminarData.seminars) &&
        seminarData.seminars.length > 0
      ) {
        console.log("Setting seminars from object:", seminarData.seminars);
        seminarData.seminars.forEach((sem, idx) => {
          console.log(`Seminar ${idx} [${sem.title}] - image:`, sem.image);
        });
        setSeminars(seminarData.seminars);
      } else {
        // If API returns empty array, keep sample data
        console.log("API returned empty data, keeping sample seminars");
      }
    } catch (error) {
      console.error("Error fetching seminars:", error);
      console.log("Server not available, keeping sample data");
      // Keep sample data when server is not available
      setError(""); // Don't show error when using fallback data
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time with AM/PM
  const formatTimeWithAMPM = (timeString) => {
    if (!timeString) return timeString;

    // If already has AM/PM, return as is
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }

    // Convert 24-hour format to 12-hour format with AM/PM
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString; // Return original if parsing fails
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seminars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchSeminars}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Philosophy Seminars
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join us for enlightening discussions on philosophical topics that
          shape our understanding of life, ethics, and existence.
        </p>
      </div>

      {/* Seminars Count */}
      <div className="mb-8">
        <p className="text-center text-gray-600">
          {seminars.length} {seminars.length === 1 ? "seminar" : "seminars"}{" "}
          available
        </p>
      </div>

      {/* Seminars Grid */}
      {seminars.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-3xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No seminars available
          </h3>
          <p className="text-gray-500">
            Check back later for upcoming philosophy seminars.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
          {Array.isArray(seminars) &&
            seminars.map((seminar) => (
              <div
                key={seminar._id}
                className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
              >
                {/* Image Section */}
                <div className="w-full h-48 mb-6 rounded-xl overflow-hidden border-2 border-gray-500">
                  <img
                    src={
                      seminar.image ||
                      seminar.imageUrl ||
                      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop"
                    }
                    alt={seminar.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop";
                    }}
                  />
                </div>

                {/* Title Section */}
                <div className="mb-6 p-4 border-2 border-gray-500 rounded-lg bg-gray-700/20">
                  <h3 className="text-white text-lg font-semibold leading-relaxed">
                    {seminar.title}
                  </h3>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Host and Place */}
                  <div className="border-2 border-gray-500 rounded-lg p-4 bg-gray-700/20">
                    <div className="flex flex-col gap-2">
                      <strong className="text-white text-base font-semibold">
                        {seminar.hostName}
                      </strong>
                      <span className="text-gray-300 text-sm">
                        {seminar.place}
                      </span>
                    </div>
                  </div>

                  {/* Date and Timing */}
                  <div className="border-2 border-gray-500 rounded-lg p-4 bg-gray-700/20">
                    <div className="text-center flex flex-col gap-1">
                      <span className="text-white text-base font-semibold">
                        {new Date(seminar.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-gray-300 text-sm font-medium">
                        {new Date(seminar.date).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {formatTimeWithAMPM(seminar.timing?.startTime)} -{" "}
                        {formatTimeWithAMPM(seminar.timing?.endTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
