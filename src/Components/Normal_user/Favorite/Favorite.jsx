import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';

import { auth } from '../../Firebase/firebase.init';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';

const Favorite = () => {
  const { user } = useContext(Authcontext);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let unsubscribe;

    const fetchFavourites = async () => {
      try {
        unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
          if (!firebaseUser?.email) {
            setError('Please log in to view your favorites.');
            setLoading(false);
            return;
          }

          try {
            const res = await axios.get(
              `http://localhost:3000/favourites?email=${firebaseUser.email}`,
              { timeout: 5000 }
            );
            setFavourites(res.data);
            setLoading(false);
          } catch (err) {
            console.error('Error fetching favourites:', err.message);
            setError(err.response?.data?.error || 'Failed to load favorites.');
            setLoading(false);
            Swal.fire({
              title: 'Error',
              text: err.response?.data?.error || 'Failed to load favorites.',
              icon: 'error',
              confirmButtonColor: '#D81B60',
            });
          }
        });
      } catch (err) {
        console.error('Error in auth state listener:', err);
        setError('Failed to initialize authentication.');
        setLoading(false);
      }
    };

    fetchFavourites();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle removing a favorite by favourite _id
const handleRemoveFavorite = async (favId) => {
  if (!user) {
    Swal.fire({
      title: 'Error',
      text: 'Please log in to remove favorites.',
      icon: 'error',
      confirmButtonColor: '#D81B60',
    });
    return;
  }

  try {
    const token = await auth.currentUser.getIdToken(); // ✅ FIXED
    await axios.delete(`http://localhost:3000/favourites/${favId}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    });

    setFavourites((prev) => prev.filter((fav) => fav._id !== favId));

    Swal.fire({
      title: 'Removed',
      text: 'Biodata removed from favorites.',
      icon: 'success',
      confirmButtonColor: '#D81B60',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error('Error removing favorite:', err);
    Swal.fire({
      title: 'Error',
      text: err.response?.data?.error || 'Failed to remove favorite.',
      icon: 'error',
      confirmButtonColor: '#D81B60',
    });
  }
};


  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }),
    whileHover: { scale: 1.08 },
  };

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen p-6">
      <motion.h2
        className="text-3xl font-serif font-semibold text-pink-900 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Favorite Biodatas
      </motion.h2>

      {loading ? (
        <motion.div
          className="flex items-center justify-center h-screen text-xl font-semibold text-gray-700 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading favourites...
        </motion.div>
      ) : error ? (
        <motion.div
          className="flex items-center justify-center h-screen text-lg text-red-500 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      ) : favourites.length === 0 ? (
        <motion.div
          className="flex items-center justify-center h-screen text-lg text-gray-500 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No favourites added yet 💔
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {favourites.map((fav, index) => {
            const biodata = fav.biodata && fav.biodata[0];
            if (!biodata) return null;

            return (
              <motion.div
                key={fav._id}
                className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                  biodata.isPremium
                    ? 'bg-gradient-to-r from-yellow-100 via-pink-50 to-yellow-50 border-yellow-400 shadow-xl'
                    : 'bg-white border-gray-200 shadow-lg'
                }`}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                custom={index}
                whileHover="whileHover"
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
                  <h3 className="text-lg font-semibold text-gray-800 font-sans">{biodata.name}</h3>
                  <p className="text-sm text-gray-600 font-sans">Biodata ID: {biodata._id}</p>
                  <p className="text-sm text-gray-600 font-sans">
                    {biodata.age} years old <br /> {biodata.biodataType}
                  </p>
                  <p className="text-sm text-gray-500 font-sans">{biodata.occupation}</p>
                  <p className="text-sm text-gray-500 font-sans">
                    Division: {biodata.permanentDivision}
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <NavLink
                      to={`/biodata/${biodata._id}`}
                      className={`inline-block px-4 py-2 rounded-lg shadow-md text-sm font-medium font-sans ${
                        biodata.isPremium
                          ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                          : 'bg-[#D81B60] text-white hover:bg-[#FFD700] hover:text-[#212121]'
                      }`}
                    >
                      {biodata.isPremium ? 'View Premium Profile' : 'View Profile'}
                    </NavLink>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveFavorite(fav._id)} // ✅ use fav._id now
                      className="inline-block px-4 py-2 rounded-lg shadow-md text-sm font-medium font-sans bg-gray-500 text-white hover:bg-gray-600"
                    >
                      Remove
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default Favorite;
