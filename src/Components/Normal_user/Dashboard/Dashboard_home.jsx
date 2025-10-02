import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaUserEdit, FaUser, FaEnvelope, FaStar, FaUsers, FaFileAlt, FaCrown, FaCheckCircle, FaCreditCard } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';

const Dashboard_home = () => {
  const { user } = useContext(Authcontext);
  const [stats, setStats] = useState({
    favoritesCount: 0,
    pendingRequests: 0,
    hasBiodata: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (user.role === 'admin') {
      setLoading(false);
      return;
    }

    const fetchUserStats = async () => {
      if (!user?.email) return;
      try {
        const token = localStorage.getItem('token');
        const [biodatasRes, favoritesRes, requestsRes] = await Promise.all([
          axios.get('https://matrimony-server-side-sigma.vercel.app/biodatas', {
            headers: { Authorization: `Bearer ${token}` },
            params: { email: user.email },
          }),
          axios.get('https://matrimony-server-side-sigma.vercel.app/favourites?email=' + user.email, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://matrimony-server-side-sigma.vercel.app/my-contact-requests', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          favoritesCount: favoritesRes.data.length,
          pendingRequests: requestsRes.data.filter(req => req.status === 'pending').length,
          hasBiodata: biodatasRes.data.length > 0,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load dashboard stats.',
          confirmButtonColor: '#D81B60',
        });
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-[#D81B60] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (user?.role === 'admin') {
    return (
      <div className="p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-[#D81B60] mb-4 font-playfair">
            <FaHeart className="inline mr-2" /> Admin Home
          </h1>
          <p className="text-gray-600 text-lg">Manage the matrimonial platform here</p>
        </motion.div>

        {/* Quick Links - Admin Specific */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <Link to="/dashboard/manage-users">
              <FaUsers className="text-3xl text-[#D81B60] mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Users</h2>
              <p className="text-gray-600">View and manage user accounts</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <Link to="/dashboard/manage-biodatas">
              <FaFileAlt className="text-3xl text-[#D81B60] mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Biodatas</h2>
              <p className="text-gray-600">Review and manage biodata submissions</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <Link to="/dashboard/approve-premium">
              <FaCrown className="text-3xl text-[#D81B60] mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Approve Premium</h2>
              <p className="text-gray-600">Handle premium subscription approvals</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <Link to="/dashboard/approve-contact-requests">
              <FaCheckCircle className="text-3xl text-[#D81B60] mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Approve Contact Requests</h2>
              <p className="text-gray-600">Review and approve contact requests</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <Link to="/dashboard/manage-payments">
              <FaCreditCard className="text-3xl text-[#D81B60] mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Payments</h2>
              <p className="text-gray-600">Track and manage payment transactions</p>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-[#D81B60] mb-4 font-playfair">
          <FaHeart className="inline mr-2" /> Welcome to Your Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Manage your matrimonial journey here</p>
      </motion.div>

      {/* Quick Stats - User Specific */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-[#D81B60]"
        >
          <FaStar className="text-2xl text-[#D81B60] mb-2" />
          <h3 className="text-sm font-medium text-gray-600">Favourites</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.favoritesCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500"
        >
          <FaEnvelope className="text-2xl text-yellow-500 mb-2" />
          <h3 className="text-sm font-medium text-gray-600">Pending Requests</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.pendingRequests}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500"
        >
          <FaUser className="text-2xl text-green-500 mb-2" />
          <h3 className="text-sm font-medium text-gray-600">Biodata Status</h3>
          <p className={`text-2xl font-bold ${stats.hasBiodata ? 'text-green-600' : 'text-red-600'}`}>
            {stats.hasBiodata ? 'Active' : 'Not Created'}
          </p>
        </motion.div>
      </div>

      {/* Quick Links - User Specific */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <Link to={stats.hasBiodata ? '/dashboard/edit-biodata' : '/dashboard/create-biodata'}>
            <FaUserEdit className="text-3xl text-[#D81B60] mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {stats.hasBiodata ? 'Edit Biodata' : 'Create Biodata'}
            </h2>
            <p className="text-gray-600">Update or create your personal information</p>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <Link to="/dashboard/view-biodata">
            <FaUser className="text-3xl text-[#D81B60] mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">View Biodata</h2>
            <p className="text-gray-600">See your biodata details</p>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <Link to="/dashboard/contact-requests">
            <FaEnvelope className="text-3xl text-[#D81B60] mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Requests</h2>
            <p className="text-gray-600">Manage your contact requests</p>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <Link to="/dashboard/favorites">
            <FaStar className="text-3xl text-[#D81B60] mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">My Favourites</h2>
            <p className="text-gray-600">View your favorite biodatas ({stats.favoritesCount})</p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard_home;