import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaCheck,
  FaEdit,
} from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
const Signup = () => {
  const { login } = useAuth();

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    userType: "normal",
    expertise: [],
    bio: "",
  });
  const backendUri =
    import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";
  console.log("Backend URI:", backendUri); // Debug log
  // Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  // Email Verification States
  const [verificationState, setVerificationState] = useState({
    isEmailSent: false,
    isVerified: false,
    otp: "",
    timer: 60,
    canResend: false,
  });

  // Add edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Timer Effect
  useEffect(() => {
    let interval;
    if (verificationState.isEmailSent && verificationState.timer > 0) {
      interval = setInterval(() => {
        setVerificationState((prev) => ({
          ...prev,
          timer: prev.timer - 1,
          canResend: prev.timer <= 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [verificationState.isEmailSent, verificationState.timer]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpertiseChange = (expertiseValue) => {
    setFormData((prev) => {
      const updatedExpertise = prev.expertise.includes(expertiseValue)
        ? prev.expertise.filter((item) => item !== expertiseValue)
        : [...prev.expertise, expertiseValue];
      return { ...prev, expertise: updatedExpertise };
    });
  };

  const handleSendOTP = async () => {
    try {
      const response = await axios.post(`${backendUri}/api/auth/send-otp`, {
        email: formData.email,
      });
      if (response.data.success) {
        setVerificationState((prev) => ({
          ...prev,
          isEmailSent: true,
          timer: 60,
          canResend: false,
        }));
        setIsEditing(false);
      }
    } catch (error) {
      alert(
        error.response.data.message || "Error sending OTP. Please try again."
      );
      console.error("Error sending OTP:", error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (!formData.email || !verificationState.otp) {
        alert("Please enter a valid email and OTP");
        return;
      }
      const response = await axios.post(`${backendUri}/api/auth/verify-otp`, {
        email: formData.email,
        otp: verificationState.otp,
      });
      alert(response.data.message);
      if (response.data.success) {
        setVerificationState((prev) => {
          return {
            ...prev,
            isEmailSent: true,
            isVerified: true,
            otp: "",
            timer: 60,
          };
        });
      } else {
        setVerificationState((prev) => {
          return {
            ...prev,
            isEmailSent: true,
            isVerified: false,
            otp: "",
          };
        });
      }
    } catch (e) {
      console.error(e);
      alert(
        e.response.data.message || "Error verifying OTP. Please try again."
      );
      setVerificationState((prev) => {
        return {
          ...prev,
          isEmailSent: true,
          isVerified: false,
          otp: "",
        };
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setVerificationState((prev) => ({
      ...prev,
      isEmailSent: false,
      isVerified: false,
      otp: "",
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${backendUri}/api/auth/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        userType: formData.userType,
        expertise:
          formData.userType === "philosopher" ? formData.expertise : [],
        bio: formData.userType === "philosopher" ? formData.bio : "",
      });
      alert(response.data.message);
      if (response.data.success) {
        // Use the login function from AuthContext
        await login(response.data.token, response.data.user);

        // Use redirectTo from backend response or default to profile
        const redirectPath = response.data.redirectTo || "/profile";
        navigate(redirectPath);
      }
    } catch (error) {
      alert(
        error.response.data.message || "Error signing up. Please try again."
      );
      console.error("Error signing up:", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8">
        {/* Left Side - Quote Panel */}
        <div className="md:w-1/3 p-8 bg-white rounded-xl shadow-lg">
          <div className="h-full flex flex-col justify-center space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-serif text-gray-800">
                "The unexamined life is not worth living"
              </h3>
              <p className="mt-2 italic text-gray-600">- Socrates</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">
                  Join philosophical discussions
                </span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">
                  Share your insights
                </span>
              </div>
              <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">
                  Connect with thinkers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-2/3 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Begin Your Journey
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join our community of philosophical minds
            </p>
          </div>

          <form className="space-y-8" onSubmit={(e) => handleSubmit(e)}>
            {/* Email Verification Section */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Step 1: Verify Your Email
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    disabled={verificationState.isEmailSent && !isEditing}
                    className={`block w-full pl-10 pr-12 py-2 border ${
                      verificationState.isEmailSent && !isEditing
                        ? "bg-gray-100 border-gray-300"
                        : "border-gray-300 hover:border-gray-400"
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {verificationState.isEmailSent && !isEditing && (
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                    >
                      <FaEdit className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* Send OTP Button */}
              {(!verificationState.isEmailSent || isEditing) && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Send Verification Code
                </button>
              )}

              {/* OTP Section */}
              {verificationState.isEmailSent &&
                !verificationState.isVerified &&
                !isEditing && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        maxLength="6"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter OTP"
                        value={verificationState.otp}
                        onChange={(e) =>
                          setVerificationState((prev) => ({
                            ...prev,
                            otp: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Verify
                      </button>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {verificationState.timer > 0 &&
                          `Resend in ${verificationState.timer}s`}
                      </span>
                      {verificationState.canResend && (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Profile Section */}
            {verificationState.isVerified && (
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Step 2: Complete Your Profile
                </h3>
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <PhoneInput
                        country={"in"}
                        value={formData.phone}
                        onChange={(phone) =>
                          setFormData((prev) => ({ ...prev, phone }))
                        }
                        containerClass="w-full"
                        inputStyle={{
                          width: "100%",
                          height: "42px",
                          fontSize: "16px",
                          paddingLeft: "48px",
                        }}
                      />
                    </div>
                  </div>

                  {/* User Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      I am a:
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="userType"
                          value="normal"
                          checked={formData.userType === "normal"}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            formData.userType === "normal"
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.userType === "normal" && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Philosophy Enthusiast
                          </div>
                          <div className="text-sm text-gray-500">
                            Join discussions and learn
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="userType"
                          value="philosopher"
                          checked={formData.userType === "philosopher"}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            formData.userType === "philosopher"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.userType === "philosopher" && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Philosopher
                          </div>
                          <div className="text-sm text-gray-500">
                            Share wisdom and guide others
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Philosopher-specific fields */}
                  {formData.userType === "philosopher" && (
                    <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-900">
                        Additional Information for Philosophers
                      </h4>

                      {/* Expertise Areas */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Areas of Expertise (Select all that apply)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Ethics",
                            "Metaphysics",
                            "Logic",
                            "Epistemology",
                            "Political Philosophy",
                            "Philosophy of Mind",
                            "Aesthetics",
                            "Eastern Philosophy",
                            "Western Philosophy",
                            "Philosophy of Religion",
                            "Philosophy of Science",
                            "Other",
                          ].map((area) => (
                            <label
                              key={area}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.expertise.includes(area)}
                                onChange={() => handleExpertiseChange(area)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">
                                {area}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Brief Bio (Optional)
                        </label>
                        <textarea
                          name="bio"
                          rows={3}
                          maxLength={500}
                          placeholder="Tell us about your philosophical background, education, or experience..."
                          value={formData.bio}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {formData.bio.length}/500 characters
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {verificationState.isVerified && (
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Account
              </button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
