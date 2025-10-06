import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaQuestion, FaUsers, FaLightbulb } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Explore the World of Philosophy</h1>
          <p className="text-xl mb-8">Join our community of thinkers, learners, and philosophers</p>
          <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200">
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FaBook className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Rich Content</h3>
            <p className="text-gray-600">Access curated philosophical content and resources</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FaQuestion className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ask Questions</h3>
            <p className="text-gray-600">Get your philosophical doubts cleared by experts</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FaUsers className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Join Seminars</h3>
            <p className="text-gray-600">Participate in engaging philosophical discussions</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FaLightbulb className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Share Ideas</h3>
            <p className="text-gray-600">Contribute your thoughts to the community</p>
          </div>
        </div>
      </div>

      {/* Latest Content Preview */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Discussions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">Philosophy Topic {item}</h3>
                  <p className="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <Link to="/content" className="text-blue-500 hover:text-blue-600">Read more →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-500">5000+</div>
            <div className="text-gray-600 mt-2">Active Members</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500">1000+</div>
            <div className="text-gray-600 mt-2">Discussions</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500">100+</div>
            <div className="text-gray-600 mt-2">Seminars Conducted</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Philosophy Journey?</h2>
          <p className="mb-8">Join our community today and explore the depths of philosophical thinking.</p>
          <Link to="/signup" className="bg-white text-blue-500 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors duration-200">
            Join Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
