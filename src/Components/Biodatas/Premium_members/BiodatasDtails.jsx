import React, { useContext, useEffect, useState } from "react";
import { useLoaderData, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

import { Heart, Mail, Phone, User } from "lucide-react"; // icons
import { Authcontext } from "../../Authicantion/Auth/Authcontext";

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
  hover: {
    scale: 1.03,
    boxShadow: "0 12px 28px rgba(216, 27, 96, 0.25)",
    transition: { duration: 0.3 },
  },
};

const imageVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.08, transition: { duration: 0.3 } },
};

const BiodatasDetails = () => {
  const biodata = useLoaderData();
  const { user, loading } = useContext(Authcontext);
  const navigate = useNavigate();
  const [similarBiodatas, setSimilarBiodatas] = useState([]);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  // Check biodata validity
  useEffect(() => {
    if (!biodata || biodata.error) {
      setError("Failed to load biodata details. Please try again.");
    }
  }, [biodata]);

  // Fetch user favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      
      try {
        const token = user.accessToken;
        const res = await fetch("http://localhost:3000/favourites", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
          // Check if current biodata is in favorites
          const isFav = data.some(fav => fav.biodata_id.toString() === biodata._id);
          setIsFavorite(isFav);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user, biodata._id]);

  // Fetch similar biodatas
  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        if (!biodata?._id) return;
        const res = await fetch(
          `http://localhost:3000/biodatas?filter=${
            biodata.biodataType || biodata.permanentDivision
          }`
        );
        if (!res.ok) throw new Error("Failed to fetch similar biodatas");
        const data = await res.json();
        setSimilarBiodatas(data.filter((d) => d._id !== biodata._id).slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSimilar();
  }, [biodata]);

  // Handle adding/removing from favourites
  const handleToggleFavorite = async () => {
    if (!user || !biodata?._id) {
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Please log in",
        text: "You need to log in to add favourites",
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
        background: "#FFF8E1",
        color: "#212121",
      });
      return;
    }

    const token = user.accessToken;
    if (!token) {
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Authentication error",
        text: "No token found. Please log in again.",
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
        background: "#FFF8E1",
        color: "#212121",
      });
      navigate("/login");
      return;
    }

    try {
      const url = isFavorite 
        ? `http://localhost:3000/favourites/${biodata._id}`
        : "http://localhost:3000/favourites";

      const method = isFavorite ? "DELETE" : "POST";

      console.log(`Sending ${method} request with token:`, token);
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: method === "POST" ? JSON.stringify({ biodata_id: biodata._id }) : null,
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok) {
        setIsFavorite(!isFavorite);
        const action = isFavorite ? "removed" : "added";
        Swal.fire({
          toast: true,
          icon: "success",
          title: `${action.charAt(0).toUpperCase() + action.slice(1)} from favourites`,
          text: `This profile has been ${action} to your favorites list!`,
          timer: 2000,
          position: "top-end",
          showConfirmButton: false,
          background: "#FFF8E1",
          color: "#212121",
        });

        // Update local favorites state
        if (method === "POST") {
          setFavorites(prev => [...prev, { biodata_id: biodata._id, biodataDetails: biodata }]);
        } else {
          setFavorites(prev => prev.filter(fav => fav.biodata_id.toString() !== biodata._id));
        }
      } else {
        Swal.fire({
          toast: true,
          icon: "error",
          title: data.error || "Failed to update",
          text: data.details || "Could not update favorites. Please try again.",
          timer: 3000,
          position: "top-end",
          showConfirmButton: false,
          background: "#FFF8E1",
          color: "#212121",
        });
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Failed to update",
        text: "An error occurred. Please try again.",
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
        background: "#FFF8E1",
        color: "#212121",
      });
    }
  };

  // Request contact
  const handleRequestContact = () => {
    Swal.fire({
      toast: true,
      icon: "info",
      title: "Redirecting to checkout",
      timer: 2000,
      position: "top-end",
      showConfirmButton: false,
      background: "#FFF8E1",
      color: "#212121",
    });
    setTimeout(() => navigate("/checkout"), 2000);
  };

  // Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFF8E1]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#D81B60]" />
      </div>
    );
  }

  if (!user) return null;

  // Error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFF8E1]">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#D81B60] font-playfair">
            Error
          </h3>
          <p className="text-lg text-[#212121] mt-2 font-lato">{error}</p>
          <NavLink to="/premium-members">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 bg-[#D81B60] text-white px-4 py-2.5 rounded-xl shadow-md hover:bg-[#FFD700] hover:text-[#212121] font-lato"
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-[#D81B60] font-playfair">
            Biodata Details
          </h2>
          <p className="mt-3 text-lg text-[#212121] font-lato">
            Explore the details of this premium profile
          </p>
        </motion.div>

        {/* Main Biodata Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover="hover"
          className="bg-white rounded-2xl overflow-hidden border bg-gradient-to-r from-[#D81B60]/10 to-[#FFD700]/10 shadow-xl"
        >
          <div className="flex flex-col md:flex-row">
            {/* Profile Image */}
            <motion.div className="md:w-1/3 overflow-hidden">
              <img
                src={biodata.profileImage}
                alt={biodata.name}
                className="w-full h-72 md:h-full object-cover"
                onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
              />
            </motion.div>

            {/* Info */}
            <div className="md:w-2/3 p-8">
              <h3 className="text-3xl font-semibold text-[#212121] mb-6 font-playfair">
                {biodata.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-lato text-sm text-[#212121]">
                <p><span className="font-medium">Biodata ID:</span> {biodata._id}</p>
                <p><span className="font-medium">Type:</span> {biodata.biodataType}</p>
                <p><span className="font-medium">DOB:</span> {biodata.dateOfBirth || biodata.dob}</p>
                <p><span className="font-medium">Age:</span> {biodata.age}</p>
                <p><span className="font-medium">Height:</span> {biodata.height}</p>
                <p><span className="font-medium">Weight:</span> {biodata.weight}</p>
                <p><span className="font-medium">Occupation:</span> {biodata.occupation}</p>
                <p><span className="font-medium">Father:</span> {biodata.fatherName}</p>
                <p><span className="font-medium">Mother:</span> {biodata.motherName}</p>
                <p><span className="font-medium">Division:</span> {biodata.permanentDivision}</p>
                <p><span className="font-medium">Present:</span> {biodata.presentDivision}</p>
                <p><span className="font-medium">Marital Status:</span> {biodata.maritalStatus}</p>
              </div>

              {/* Contact */}
              {user?.isPremium ? (
                <div className="mt-6 p-4 bg-[#F8BBD0]/30 rounded-lg font-lato">
                  <h4 className="text-lg font-semibold text-[#D81B60] flex items-center gap-2 font-playfair">
                    <Mail size={18} /> Contact Info
                  </h4>
                  <p className="mt-2"><Mail size={14} className="inline mr-1" /> {biodata.contactEmail}</p>
                  <p><Phone size={14} className="inline mr-1" /> {biodata.mobileNumber}</p>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRequestContact}
                  className="mt-6 w-full bg-[#D81B60] text-white px-4 py-2.5 rounded-xl shadow-md hover:bg-[#FFD700] hover:text-[#212121] font-lato"
                >
                  Request Contact Info
                </motion.button>
              )}

              {/* Action Buttons */}
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleFavorite}
                  className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl shadow-md font-lato transition-all duration-300 ${
                    isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-[#D81B60] text-white hover:bg-[#FFD700] hover:text-[#212121]'
                  }`}
                >
                  <Heart 
                    size={16} 
                    className={isFavorite ? 'fill-current' : ''} 
                    onClick={(e) => e.stopPropagation()}
                  />
                  {isFavorite ? 'Remove from Favourites' : 'Add to Favourites'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Similar Biodatas */}
        {similarBiodatas.length > 0 && (
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-[#D81B60] text-center font-playfair">
              Similar Profiles
            </h3>
            <p className="text-lg text-[#212121] text-center mt-2 font-lato">
              Explore more profiles that match your preferences
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {similarBiodatas.map((profile, i) => (
                  <motion.div
                    key={profile._id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border bg-gradient-to-r from-[#D81B60]/10 to-[#FFD700]/10"
                  >
                    <motion.div variants={imageVariants} className="overflow-hidden">
                      <img
                        src={profile.profileImage}
                        alt={profile.name}
                        className="w-full h-56 object-cover"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                      />
                    </motion.div>
                    <div className="p-6">
                      <h4 className="text-xl font-semibold text-[#212121] truncate font-playfair">
                        {profile.name}
                      </h4>
                      <p className="text-sm text-[#D81B60] mt-2 font-lato">
                        Biodata ID: {profile._id.slice(-6)}
                      </p>
                      <p className="text-sm text-[#212121] mt-1 font-lato">
                        Age: {profile.age}
                      </p>
                      <p className="text-sm text-[#212121] mt-1 truncate font-lato">
                        Occupation: {profile.occupation}
                      </p>
                      <NavLink to={`/biodata/${profile._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-4 w-full bg-[#D81B60] text-white px-4 py-2.5 rounded-xl shadow-md hover:bg-[#FFD700] hover:text-[#212121] font-lato"
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
    </div>
  );
};

export default BiodatasDetails;