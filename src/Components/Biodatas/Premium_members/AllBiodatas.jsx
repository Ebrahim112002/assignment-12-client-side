import React, { useState } from 'react';
import { useLoaderData, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const AllBiodatas = () => {
  const biodatas = useLoaderData();
  console.log(biodatas);
  const [filters, setFilters] = useState({
    ageRange: '',
    biodataType: '',
    division: '',
    occupation: '',
    maritalStatus: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Ensure biodatas is an array, default to empty array if not
  const biodataArray = Array.isArray(biodatas) ? biodatas : [];

  // Filter biodatas
  const filteredBiodatas = biodataArray.filter((biodata) => {
    const age = parseInt(biodata.age, 10);
    const [minAge, maxAge] = filters.ageRange
      ? filters.ageRange.split('-').map(Number)
      : [0, 100];

    return (
      (!filters.ageRange || (age >= minAge && age <= maxAge)) &&
      (!filters.biodataType || biodata.biodataType === filters.biodataType) &&
      (!filters.division || biodata.permanentDivision === filters.division) &&
      (!filters.occupation ||
        biodata.occupation?.toLowerCase().includes(filters.occupation.toLowerCase())) &&
      (!filters.maritalStatus || biodata.maritalStatus === filters.maritalStatus)
    );
  });

  const totalPages = Math.ceil(filteredBiodatas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBiodatas = filteredBiodatas.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <div className="w-full flex flex-col lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="lg:w-1/4 w-full bg-white p-6 lg:p-8 top-0 shadow-lg">
          <h2 className="text-3xl font-serif font-semibold text-pink-900 mb-6">
            Refine Your Search
          </h2>
          <div className="space-y-4">
            {/* Age Filter */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium text-sm">Age Range</label>
              <select
                name="ageRange"
                value={filters.ageRange}
                onChange={handleFilterChange}
                className="w-full p-3 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-600 focus:outline-none text-sm"
              >
                <option value="">All Ages</option>
                <option value="18-25">18-25</option>
                <option value="26-30">26-30</option>
                <option value="31-35">31-35</option>
                <option value="36-40">36-40</option>
                <option value="41-50">41-50</option>
              </select>
            </div>

            {/* Biodata Type */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium text-sm">Biodata Type</label>
              <select
                name="biodataType"
                value={filters.biodataType}
                onChange={handleFilterChange}
                className="w-full p-3 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-600 focus:outline-none text-sm"
              >
                <option value="">All Types</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Division */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium text-sm">Division</label>
              <select
                name="division"
                value={filters.division}
                onChange={handleFilterChange}
                className="w-full p-3 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-600 focus:outline-none text-sm"
              >
                <option value="">All Divisions</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Barisal">Barisal</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium text-sm">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={filters.occupation}
                onChange={handleFilterChange}
                placeholder="Any occupation"
                className="w-full p-3 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm"
              />
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium text-sm">Marital Status</label>
              <select
                name="maritalStatus"
                value={filters.maritalStatus}
                onChange={handleFilterChange}
                className="w-full p-3 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-600 focus:outline-none text-sm"
              >
                <option value="">All</option>
                <option value="Unmarried">Unmarried</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Biodata Cards */}
        <main className="flex-1 p-6 lg:p-12">
          {biodataArray.length === 0 ? (
            <p className="text-center text-gray-600">No biodata available.</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {currentBiodatas.map((biodata, index) => (
                <motion.div
                  key={biodata._id}
                  className={`relative rounded-2xl overflow-hidden border transition-all duration-300
                    ${biodata.isPremium
                      ? 'bg-gradient-to-r from-yellow-100 via-pink-50 to-yellow-50 border-yellow-400 shadow-xl'
                      : 'bg-white border-gray-200 shadow-lg'
                    }`}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.1, delay: index * 0.1 }}
                  whileHover={{ scale: 1.08 }}
                >
                  {/* Premium Badge */}
                  {biodata.isPremium && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      PREMIUM
                    </div>
                  )}

                  <img
                    src={biodata.profileImage}
                    alt={biodata.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{biodata.name}</h3>
                    <p className="text-sm text-gray-600">Biodata ID: {biodata.biodataId}</p>
                    <p className="text-sm text-gray-600">{biodata.age} years old 
                      <br /> {biodata.biodataType}</p>
                    <p className="text-sm text-gray-500">{biodata.occupation}</p>
                    <p className="text-sm text-gray-500">Division: {biodata.permanentDivision}</p>
                    <NavLink
                      to={`/biodata/${biodata._id}`}
                      className={`inline-block mt-3 px-4 py-2 rounded-lg shadow-md text-sm font-medium
                        ${biodata.isPremium
                          ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                          : 'bg-[#D81B60] text-white hover:bg-[#FFD700] hover:text-[#212121]'
                        }`}
                    >
                      {biodata.isPremium ? 'View Premium Profile' : 'View Profile'}
                    </NavLink>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#DB4C80] rounded-xl disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <motion.button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    currentPage === index + 1
                      ? 'bg-[#D81B60] text-white'
                      : 'bg-gray-100 text-[#212121] hover:bg-pink-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {index + 1}
                </motion.button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#DB4C80] rounded-xl disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllBiodatas;