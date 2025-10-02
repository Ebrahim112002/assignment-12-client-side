import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {FaHeart, FaHome, FaUserEdit, FaUser, FaEnvelope, FaStar, FaBars, FaUsers, FaDollarSign } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import logo from '../../../assets/wedding-rings.png';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';

const Dashboard_nav = () => {
  const { user } = useContext(Authcontext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasBiodata, setHasBiodata] = useState(null); // null = loading, false = no biodata, true = has biodata

  // Fetch user biodata status
  useEffect(() => {
    const fetchBiodataStatus = async () => {
      if (!user?.email) return;
      try {
        const response = await axios.get('https://matrimony-server-side-sigma.vercel.app/biodatas', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { email: user.email },
        });
        setHasBiodata(response.data.length > 0);
      } catch (error) {
        console.error('Error fetching biodata status:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch biodata status.',
          confirmButtonColor: '#D81B60',
        });
      }
    };
    fetchBiodataStatus();
  }, [user]);

  const baseNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    {
      path: hasBiodata ? '/dashboard/edit-biodata' : '/dashboard/create-biodata',
      label: hasBiodata ? 'Edit Biodata' : 'Create Biodata',
      icon: FaUserEdit,
    },
    { path: '/dashboard/view-biodata', label: 'View Biodata', icon: FaUser },
    { path: '/dashboard/upgrade-premium', label: 'Upgrade to Premium', icon: FaStar },
    { path: '/dashboard/contact-requests', label: 'Contact Requests', icon: FaEnvelope },
    { path: '/dashboard/favorites', label: 'Favourites', icon: FaHeart },
  ];

  const adminNavItems = [
    { path: '/dashboard', label: 'Admin Home', icon: FaHome },
    { path: '/dashboard/manage-users', label: 'Manage Users', icon: FaUsers },
    { path: '/dashboard/manage-biodatas', label: 'Manage Biodatas', icon: FaUserEdit },
    { path: '/dashboard/approve-premium', label: 'Approve Premium', icon: FaStar },
    { path: '/dashboard/approve-contact-requests', label: 'Approve Contact Requests', icon: FaEnvelope },
    { path: '/dashboard/manage-payments', label: 'Manage Payments', icon: FaDollarSign },
  ];

  // Conditionally select nav items
  const navItems = user?.role === 'admin' 
    ? adminNavItems
    : baseNavItems;

  // Animation variants for nav items
  const navItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { scale: 1.05, backgroundColor: '#9f1239' },
  };

  // Sidebar animation
  const sidebarVariants = {
    open: { width: '16rem', transition: { duration: 0.3 } },
    closed: { width: '4rem', transition: { duration: 0.3 } },
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#F8BBD0] to-white">
      {/* Sidebar */}
      <motion.nav
        className="fixed top-0 left-0 h-screen bg-[#D81B60] text-white shadow-lg flex flex-col p-4 md:w-64"
        variants={sidebarVariants}
        initial={window.innerWidth <= 768 ? 'closed' : 'open'}
        animate={isSidebarOpen || window.innerWidth > 768 ? 'open' : 'closed'}
      >
        <div className="flex items-center justify-between">
          <motion.div
            className="font-bold my-8 flex items-center cursor-pointer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate('/')}
          >
            <div className="flex gap-4 items-center">
              <img src={logo} alt="Love Matrimony" className="size-10" />
              {(isSidebarOpen || window.innerWidth > 768) && (
                <p className="font-[Playfair Display] text-xl font-bold">Love Matrimony</p>
              )}
            </div>
          </motion.div>
          <button
            className="md:hidden text-white text-2xl"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
        </div>
        <div className="space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              variants={navItemVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover="hover"
            >
              <Link
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  location.pathname === item.path ? 'bg-[#9f1239]' : 'hover:bg-[#9f1239]'
                }`}
                onClick={() => window.innerWidth <= 768 && setIsSidebarOpen(false)}
              >
                <item.icon className="text-lg" />
                {(isSidebarOpen || window.innerWidth > 768) && <span>{item.label}</span>}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.nav>
      {/* Content Area */}
      <div className="flex-1 md:ml-64 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard_nav;