import React, { useState } from 'react';
import { useLoaderData, NavLink, useRouteError } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
  hover: {
    scale: 1.05,
    boxShadow: '0 12px 24px rgba(216, 27, 96, 0.25)',
    transition: { duration: 0.3 },
  },
};

// Image zoom animation
const imageVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.4 } },
};

const PremiumMembers = () => {
  const loaderData = useLoaderData(); // Loader returns data directly
  const error = useRouteError(); // Error handling hook
  const [sortOrder, setSortOrder] = useState('ascending');

  // Handle error state
  if (error) {
    return (
      <div className="p-4 text-red-600 text-center font-[Lato]">
        Error fetching premium members: {error.message}
      </div>
    );
  }

  // Handle loading state
  if (!loaderData) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <motion.div
          className="text-[#D81B60] text-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <FaSpinner className="text-4xl" />
        </motion.div>
      </div>
    );
  }

  // Ensure data is an array
  const sortedData = Array.isArray(loaderData)
    ? [...loaderData].sort((a, b) =>
        sortOrder === 'ascending' ? a.age - b.age : b.age - a.age
      )
    : [];

  const displayedData = sortedData.slice(0, 6);

  return (
    <div className="bg-gradient-to-b from-[#FFF8E1] to-[#F8BBD0] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#D81B60] tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Our Premium Members
          </h2>
          <p
            className="mt-4 text-lg sm:text-xl text-[#212121] max-w-2xl mx-auto"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            Discover exclusive profiles curated for meaningful connections
          </p>
        </motion.div>

        {/* Dropdown for Sorting */}
        <div className="flex justify-end mb-10">
          <div className="relative w-52">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none w-full bg-gradient-to-r from-[#D81B60] text-black rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#FFD700] shadow-md transition-colors duration-300"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              <option value="ascending" className="bg-[#FFF8E1] text-[#212121]">
                Age: Ascending
              </option>
              <option value="descending" className="bg-[#FFF8E1] text-[#212121]">
                Age: Descending
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-[#FFD700]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Profile Cards Grid */}
        {displayedData.length === 0 ? (
          <div className="p-4 text-gray-600 text-center font-[Lato]">
            No premium members found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedData.map((profile, index) => (
              <motion.div
                key={profile._id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
                whileHover="hover"
                className="relative bg-white rounded-2xl overflow-hidden border border-transparent bg-gradient-to-r from-[#D81B60]/10 to-[#FFD700]/10 shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Premium Badge */}
                <div className="absolute top-4 right-4 bg-[#FFD700] text-[#212121] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <svg
                    className="w-4 h-4 text-[#D81B60]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Premium
                </div>

                {/* Profile Image */}
                <motion.div variants={imageVariants} className="overflow-hidden">
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-full h-60 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </motion.div>

                <div className="p-6">
                  <h3
                    className="text-xl sm:text-2xl font-semibold text-[#212121] truncate"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {profile.name}
                  </h3>
                  <p className="text-sm text-[#D81B60] mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
                    Biodata ID: {profile._id.slice(-6)}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-[#212121]" style={{ fontFamily: 'Lato, sans-serif' }}>
                    <p><span className="font-medium">Type:</span> {profile.biodataType}</p>
                    <p><span className="font-medium">Age:</span> {profile.age}</p>
                    <p className="truncate"><span className="font-medium">Occupation:</span> {profile.occupation}</p>
                    <p><span className="font-medium">Division:</span> {profile.permanentDivision}</p>
                  </div>

                  <NavLink to={`/biodata/${profile._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: '#FFD700', color: '#212121' }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-5 w-full bg-[#D81B60] text-white px-4 py-2.5 rounded-lg shadow-md hover:bg-[#FFD700] hover:text-[#212121] transition-colors duration-300 text-sm font-medium"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      View Profile
                    </motion.button>
                  </NavLink>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumMembers;
