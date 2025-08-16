import React, { useContext, useEffect, useState } from 'react';
import { useLoaderData, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';


// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
  hover: { scale: 1.03, boxShadow: '0 12px 24px rgba(216, 27, 96, 0.2)', transition: { duration: 0.3 } },
};

const imageVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.3 } },
};

const BiodatasDetails = () => {
  const biodata = useLoaderData();
  const { user, loading } = useContext(Authcontext);
  const navigate = useNavigate();
  const [similarBiodatas, setSimilarBiodatas] = useState([]);
  const [error, setError] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('Biodata:', biodata);
    console.log('User:', user);
    console.log('Loading:', loading);
  }, [biodata, user, loading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('Redirecting to login: User not authenticated');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Check if biodata is invalid or missing
  useEffect(() => {
    if (!biodata || biodata.error) {
      console.error('Invalid or missing biodata:', biodata);
      setError('Failed to load biodata details. Please try again.');
    }
  }, [biodata]);

  // Fetch similar biodatas
  useEffect(() => {
    const fetchSimilarBiodatas = async () => {
      try {
        if (!biodata || !biodata._id) return;
        const response = await fetch(
          `http://localhost:3000/biodatas?filter=${biodata.biodataType || biodata.permanentDivision}`
        );
        if (!response.ok) throw new Error('Failed to fetch similar biodatas');
        const data = await response.json();
        const filteredData = data
          .filter((item) => item._id !== biodata._id)
          .slice(0, 3);
        setSimilarBiodatas(filteredData);
      } catch (error) {
        console.error('Error fetching similar biodatas:', error);
      }
    };
    fetchSimilarBiodatas();
  }, [biodata]);

  // Handle Add to Favourites
  const handleAddToFavourites = async () => {
    if (!user || !biodata?._id) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Error',
        text: 'Unable to add to favourites. Please log in and try again.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#FFF8E1',
        color: '#212121',
        iconColor: '#D81B60',
        customClass: {
          title: 'font-playfair text-lg',
          content: 'font-lato text-sm',
        },
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/favourites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userEmail: user.email, biodataId: biodata._id }),
      });
      if (response.ok) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Added to Favourites!',
          text: `${biodata.name} has been added to your favourites.`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: '#FFF8E1',
          color: '#212121',
          iconColor: '#FFD700',
          customClass: {
            title: 'font-playfair text-lg',
            content: 'font-lato text-sm',
          },
        });
      } else {
        throw new Error('Failed to add to favourites');
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Error',
        text: 'Failed to add to favourites. Please try again.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#FFF8E1',
        color: '#212121',
        iconColor: '#D81B60',
        customClass: {
          title: 'font-playfair text-lg',
          content: 'font-lato text-sm',
        },
      });
    }
  };

  // Handle Request Contact Info
  const handleRequestContact = () => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Redirecting to Checkout',
      text: 'You will be redirected to the checkout page to access contact information.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: '#FFF8E1',
      color: '#212121',
      iconColor: '#D81B60',
      customClass: {
        title: 'font-playfair text-lg',
        content: 'font-lato text-sm',
      },
    });
    setTimeout(() => navigate('/checkout'), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFF8E1]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#D81B60]"></div>
      </div>
    );
  }

  if (!user) return null;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFF8E1]">
        <div className="text-center">
          <h3
            className="text-2xl font-semibold text-[#D81B60]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Error
          </h3>
          <p
            className="text-lg text-[#212121] mt-2"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            {error}
          </p>
          <NavLink to="/premium-members">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#FFD700', color: '#212121' }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 bg-[#D81B60] text-white px-4 py-2.5 rounded-lg shadow-md hover:bg-[#FFD700] hover:text-[#212121] transition-colors duration-300 text-sm font-medium"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              Back to Premium Members
            </motion.button>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#FFF8E1] to-[#F8BBD0] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#D81B60] tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Biodata Details
          </h2>
          <p
            className="mt-3 text-lg sm:text-xl text-[#212121] max-w-2xl mx-auto"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            Explore the details of this premium profile
          </p>
        </motion.div>

        {/* Main Biodata Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover="hover"
          className="bg-white rounded-xl overflow-hidden border-2 border-transparent bg-gradient-to-r from-[#D81B60]/10 to-[#FFD700]/10 shadow-lg mb-12"
        >
          <div className="flex flex-col md:flex-row">
            {/* Profile Image */}
            <motion.div variants={imageVariants} className="md:w-1/3 overflow-hidden">
              <img
                src={biodata.profileImage}
                alt={biodata.name}
                className="w-full h-64 md:h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
            </motion.div>
            {/* Biodata Details */}
            <div className="md:w-2/3 p-6 sm:p-8">
              <h3
                className="text-2xl sm:text-3xl font-semibold text-[#212121] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {biodata.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p
                    className="text-sm text-[#D81B60]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Biodata ID:</span> {biodata._id}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Type:</span> {biodata.biodataType}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Date of Birth:</span> {biodata.dateOfBirth}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Age:</span> {biodata.age}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Height:</span> {biodata.height}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Weight:</span> {biodata.weight}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Occupation:</span> {biodata.occupation}
                  </p>
                </div>
                <div>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Race:</span> {biodata.race}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Father’s Name:</span> {biodata.fatherName}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Mother’s Name:</span> {biodata.motherName}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Permanent Division:</span>{' '}
                    {biodata.permanentDivision}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Present Division:</span>{' '}
                    {biodata.presentDivision}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Partner Age:</span> {biodata.expectedPartnerAge}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Partner Height:</span>{' '}
                    {biodata.expectedPartnerHeight}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Partner Weight:</span>{' '}
                    {biodata.expectedPartnerWeight}
                  </p>
                </div>
              </div>
              {/* Contact Information (Premium Users Only) */}
              {user?.isPremium ? (
                <div className="mt-6 p-4 bg-[#F8BBD0]/20 rounded-lg">
                  <h4
                    className="text-lg font-semibold text-[#D81B60]"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    Contact Information
                  </h4>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Email:</span> {biodata.contactEmail}
                  </p>
                  <p
                    className="text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    <span className="font-medium">Mobile:</span> {biodata.mobileNumber}
                  </p>
                </div>
              ) : (
                <NavLink to="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#FFD700', color: '#212121' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRequestContact}
                    className="mt-6 w-full bg-[#D81B60] text-white px-4 py-2.5 rounded-lg shadow-md hover:bg-[#FFD700] hover:text-[#212121] transition-colors duration-300 text-sm font-medium"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    Request Contact Information
                  </motion.button>
                </NavLink>
              )}
              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#FFD700', color: '#212121' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToFavourites}
                  className="w-full bg-[#D81B60] text-white px-4 py-2.5 rounded-lg shadow-md hover:bg-[#FFD700] hover:text-[#212121] transition-colors duration-300 text-sm font-medium"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  Add to Favourites
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Similar Biodata Section */}
        {similarBiodatas.length > 0 && (
          <div className="mt-12">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center mb-8"
            >
              <h3
                className="text-2xl sm:text-3xl font-bold text-[#D81B60]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Similar Profiles
              </h3>
              <p
                className="mt-2 text-lg text-[#212121]"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Explore more profiles that match your preferences
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <AnimatePresence>
                {similarBiodatas.map((profile, index) => (
                  <motion.div
                    key={profile._id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={cardVariants}
                    whileHover="hover"
                    className="relative bg-white rounded-xl overflow-hidden border-2 border-transparent bg-gradient-to-r from-[#D81B60]/10 to-[#FFD700]/10 shadow-lg"
                  >
                    <motion.div variants={imageVariants} className="overflow-hidden">
                      <img
                        src={profile.profileImage}
                        alt={profile.name}
                        className="w-full h-56 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </motion.div>
                    <div className="p-6">
                      <h4
                        className="text-xl font-semibold text-[#212121] truncate"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {profile.name}
                      </h4>
                      <p
                        className="text-sm text-[#D81B60] mt-2"
                        style={{ fontFamily: 'Lato, sans-serif' }}
                      >
                        Biodata ID: {profile._id.slice(-6)}
                      </p>
                      <p
                        className="text-sm text-[#212121] mt-1"
                        style={{ fontFamily: 'Lato, sans-serif' }}
                      >
                        <span className="font-medium">Age:</span> {profile.age}
                      </p>
                      <p
                        className="text-sm text-[#212121] mt-1 truncate"
                        style={{ fontFamily: 'Lato, sans-serif' }}
                      >
                        <span className="font-medium">Occupation:</span> {profile.occupation}
                      </p>
                      <NavLink to={`/biodata/${profile._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05, backgroundColor: '#FFD700', color: '#212121' }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-4 w-full bg-[#D81B60] text-white px-4 py-2.5 rounded-lg shadow-md hover:bg-[#FFD700] hover:text-[#212121] transition-colors duration-300 text-sm font-medium"
                          style={{ fontFamily: 'Lato, sans-serif' }}
                        >
                          View Profile
                        </motion.button>
                      </NavLink>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for Theme Consistency */}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            .motion-div, .motion-button {
              animation: none;
              transition: none;
            }
            .hover\\:scale-103, .hover\\:scale-105, .hover\\:scale-110 {
              transform: none;
            }
          }
          .font-playfair {
            font-family: 'Playfair Display', serif;
          }
          .font-lato {
            font-family: 'Lato, sans-serif';
          }
        `}
      </style>
    </div>
  );
};

export default BiodatasDetails;