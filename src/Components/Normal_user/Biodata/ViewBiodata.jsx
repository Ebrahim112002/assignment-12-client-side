import React, { useContext } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';
import { FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const ViewBiodata = () => {
  const { user } = useContext(Authcontext);

  // Fetch user's biodata using Tanstack Query
  const { data: biodata, error, isLoading } = useQuery({
    queryKey: ['biodata', user?.email],
    queryFn: async () => {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }
      const response = await axios.get(`http://localhost:3000/biodatas?email=${user.email}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data.length > 0 ? response.data[0] : null;
    },
    enabled: !!user?.email,
  });

  // Animation variants for the card
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02 },
  };

  // Animation variants for individual fields
  const fieldVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
  };

  if (isLoading) {
    return (
      <div className="ml-0 md:ml-64 p-4 flex justify-center items-center min-h-screen">
        <motion.div
          className="text-pink-600 text-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <FaUser className="text-4xl" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-0 md:ml-64 p-4 text-red-600 text-center">
        Error fetching biodata: {error.message}
      </div>
    );
  }

  if (!biodata) {
    return (
      <div className="ml-0 md:ml-64 p-4 text-gray-600 text-center">
        No biodata found. Please create your biodata first.
      </div>
    );
  }

  return (
    <div className="ml-0 md:ml-64 p-4 max-w-4xl mx-auto">
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-pink-600 mb-6 flex items-center justify-center md:justify-start"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaUser className="mr-2 text-xl md:text-2xl" /> My Biodata
      </motion.h2>
      <motion.div
        className="bg-white p-4 md:p-6 rounded-lg shadow-lg"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {biodata.profileImage && (
            <motion.div
              className="col-span-1 sm:col-span-2 flex justify-center"
              variants={fieldVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3 }}
            >
              <img
                src={biodata.profileImage}
                alt="Profile"
                className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-2 border-pink-600"
              />
            </motion.div>
          )}
          {[
            { label: 'Biodata Type', value: biodata.biodataType },
            { label: 'Name', value: biodata.name },
            { label: 'Date of Birth', value: biodata.dob },
            { label: 'Height', value: `${biodata.height} cm` },
            { label: 'Weight', value: `${biodata.weight} kg` },
            { label: 'Age', value: biodata.age },
            { label: 'Occupation', value: biodata.occupation },
            { label: 'Race', value: biodata.race || 'Not specified' },
            { label: "Father's Name", value: biodata.fatherName || 'Not specified' },
            { label: "Mother's Name", value: biodata.motherName || 'Not specified' },
            { label: 'Permanent Division', value: biodata.permanentDivision },
            { label: 'Present Division', value: biodata.presentDivision },
            { label: 'Expected Partner Age', value: biodata.partnerAge || 'Not specified' },
            { label: 'Expected Partner Height', value: biodata.partnerHeight ? `${biodata.partnerHeight} cm` : 'Not specified' },
            { label: 'Expected Partner Weight', value: biodata.partnerWeight ? `${biodata.partnerWeight} kg` : 'Not specified' },
            { label: 'Contact Email', value: biodata.contactEmail },
            { label: 'Mobile Number', value: biodata.mobileNumber },
            { label: 'Biodata ID', value: biodata._id },
          ].map((field, index) => (
            <motion.div
              key={field.label}
              className="flex flex-col"
              variants={fieldVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <span className="text-gray-700 font-semibold text-sm md:text-base">{field.label}</span>
              <span className="text-gray-900 text-sm md:text-base">{field.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ViewBiodata;