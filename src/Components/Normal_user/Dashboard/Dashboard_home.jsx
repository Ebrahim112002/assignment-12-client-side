import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard_home = () => {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center text-pink-600 mb-8 animate-pulse">
        <i className="fas fa-heart mr-2"></i> Welcome to Your Matrimonial Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/dashboard/edit-biodata"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
        >
          <i className="fas fa-user-edit text-3xl text-pink-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-800">Edit Biodata</h2>
          <p className="text-gray-600">Update your personal information</p>
        </Link>
        <Link
          to="/dashboard/view-biodata"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
        >
          <i className="fas fa-user text-3xl text-pink-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-800">View Biodata</h2>
          <p className="text-gray-600">See your biodata details</p>
        </Link>
        <Link
          to="/dashboard/contact-requests"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
        >
          <i className="fas fa-envelope text-3xl text-pink-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-800">Contact Requests</h2>
          <p className="text-gray-600">Manage your contact requests</p>
        </Link>
        <Link
          to="/dashboard/favorites"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
        >
          <i className="fas fa-star text-3xl text-pink-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-800">My Favourites</h2>
          <p className="text-gray-600">View your favorite biodatas</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard_home;