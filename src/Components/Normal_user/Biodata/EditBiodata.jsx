import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';
import { getAuth } from 'firebase/auth';

const MySwal = withReactContent(Swal);

const EditBiodata = () => {
  const { user } = useContext(Authcontext);
  const navigate = useNavigate();
  const [biodata, setBiodata] = useState(null);
  const [formData, setFormData] = useState({
    biodataType: '',
    name: '',
    dateOfBirth: '',
    height: '',
    weight: '',
    age: '',
    occupation: '',
    race: '',
    fatherName: '',
    motherName: '',
    permanentDivision: '',
    presentDivision: '',
    expectedPartnerAge: '',
    expectedPartnerHeight: '',
    expectedPartnerWeight: '',
    contactEmail: '',
    mobileNumber: '',
    maritalStatus: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dropdown options
  const biodataTypes = ['Male', 'Female'];
  const divisions = ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'];
  const maritalStatuses = ['Unmarried', 'Divorced', 'Widowed', 'Unmarried or Divorced'];

  useEffect(() => {
    if (!user || !user.email) {
      MySwal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please log in to edit biodata.',
        confirmButtonText: 'Go to Login',
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    const fetchBiodata = async () => {
      try {
        setIsLoading(true);
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(`https://matrimony-server-side-sigma.vercel.app/biodatas?email=${user.email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedBiodatas = res.data;

        if (!fetchedBiodatas || fetchedBiodatas.length === 0) {
          throw new Error('No biodata found for this user. Please create a biodata first.');
        }

        const fetched = fetchedBiodatas[0];
        console.log('Fetched biodata _id:', fetched._id);
        if (fetched.email !== user.email) {
          throw new Error('Unauthorized: You can only edit your own biodata');
        }

        setBiodata(fetched);
        setFormData({
          biodataType: fetched.biodataType || '',
          name: fetched.name || '',
          dateOfBirth: fetched.dateOfBirth || '',
          height: fetched.height || '',
          weight: fetched.weight || '',
          age: fetched.age?.toString() || '',
          occupation: fetched.occupation || '',
          race: fetched.race || '',
          fatherName: fetched.fatherName || '',
          motherName: fetched.motherName || '',
          permanentDivision: fetched.permanentDivision || '',
          presentDivision: fetched.presentDivision || '',
          expectedPartnerAge: fetched.expectedPartnerAge || '',
          expectedPartnerHeight: fetched.expectedPartnerHeight || '',
          expectedPartnerWeight: fetched.expectedPartnerWeight || '',
          contactEmail: fetched.contactEmail || user.email || '',
          mobileNumber: fetched.mobileNumber || '',
          maritalStatus: fetched.maritalStatus || '',
        });
        setPreviewImage(fetched.profileImage || '');
        setError(null);
      } catch (err) {
        console.error('Error fetching biodata:', err.response?.data || err.message);
        const msg = err.response?.data?.error || err.message || 'Failed to fetch biodata';
        setError(msg);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: msg,
          confirmButtonText: 'Create Biodata',
          showCancelButton: true,
          cancelButtonText: 'Back to Dashboard',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/dashboard/create-biodata');
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            navigate('/dashboard');
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBiodata();

    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB for faster uploads) and type (JPEG/PNG)
      if (file.size > 2 * 1024 * 1024) {
        MySwal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Image size must be less than 2MB for faster uploads.',
        });
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        MySwal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Only JPEG and PNG images are allowed.',
        });
        return;
      }
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setProfileImage(null);
      setPreviewImage(biodata?.profileImage || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!biodata || !biodata._id) {
        throw new Error('Biodata _id not found. Please try again.');
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value);
        }
      });
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      console.log('Updating biodata _id:', biodata._id);
      const res = await axios.patch(
        `https://matrimony-server-side-sigma.vercel.app/biodatas/${biodata._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update biodata and previewImage with the new data from the backend
      const updatedBiodata = res.data.updatedBiodata;
      console.log('Updated biodata:', updatedBiodata);
      setBiodata(updatedBiodata);
      setPreviewImage(updatedBiodata.profileImage || previewImage);
      setFormData({
        biodataType: updatedBiodata.biodataType || '',
        name: updatedBiodata.name || '',
        dateOfBirth: updatedBiodata.dateOfBirth || '',
        height: updatedBiodata.height || '',
        weight: updatedBiodata.weight || '',
        age: updatedBiodata.age?.toString() || '',
        occupation: updatedBiodata.occupation || '',
        race: updatedBiodata.race || '',
        fatherName: updatedBiodata.fatherName || '',
        motherName: updatedBiodata.motherName || '',
        permanentDivision: updatedBiodata.permanentDivision || '',
        presentDivision: updatedBiodata.presentDivision || '',
        expectedPartnerAge: updatedBiodata.expectedPartnerAge || '',
        expectedPartnerHeight: updatedBiodata.expectedPartnerHeight || '',
        expectedPartnerWeight: updatedBiodata.expectedPartnerWeight || '',
        contactEmail: updatedBiodata.contactEmail || user.email || '',
        mobileNumber: updatedBiodata.mobileNumber || '',
        maritalStatus: updatedBiodata.maritalStatus || '',
      });

      MySwal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Biodata updated successfully!',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/dashboard');
      });
    } catch (err) {
      console.error('Update error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      let msg = err.response?.data?.error || err.message || 'Failed to update biodata';
      if (msg.includes('Failed to upload image')) {
        msg = 'Image upload failed. Your biodata was updated without a new image. Try a smaller image (less than 2MB).';
      } else if (msg.includes('timeout')) {
        msg = 'Image upload timed out. Please try a smaller image (less than 2MB) or check your network connection.';
      }
      setError(msg);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
        willClose: () => {
          if (msg.includes('Unauthorized') || msg.includes('No biodata found')) {
            navigate('/dashboard');
          }
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-16 w-16 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (error && !biodata) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Biodata</h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Biodata</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Biodata Type</label>
              <motion.select
                name="biodataType"
                value={formData.biodataType}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                initial="hidden"
                animate="visible"
                variants={dropdownVariants}
              >
                <option value="">Select Biodata Type</option>
                {biodataTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </motion.select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="18"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Height</label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 5'6\"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 65kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Race</label>
              <input
                type="text"
                name="race"
                value={formData.race}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Permanent Division</label>
              <motion.select
                name="permanentDivision"
                value={formData.permanentDivision}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                initial="hidden"
                animate="visible"
                variants={dropdownVariants}
              >
                <option value="">Select Division</option>
                {divisions.map((division) => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </motion.select>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Present Division</label>
              <motion.select
                name="presentDivision"
                value={formData.presentDivision}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                initial="hidden"
                animate="visible"
                variants={dropdownVariants}
              >
                <option value="">Select Division</option>
                {divisions.map((division) => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </motion.select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Partner Age</label>
              <input
                type="text"
                name="expectedPartnerAge"
                value={formData.expectedPartnerAge}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 22-30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Partner Height</label>
              <input
                type="text"
                name="expectedPartnerHeight"
                value={formData.expectedPartnerHeight}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 5'0\-5'5\"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Partner Weight</label>
              <input
                type="text"
                name="expectedPartnerWeight"
                value={formData.expectedPartnerWeight}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 50-60kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Marital Status</label>
              <motion.select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                initial="hidden"
                animate="visible"
                variants={dropdownVariants}
              >
                <option value="">Select Marital Status</option>
                {maritalStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </motion.select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
            />
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="mt-4 w-32 h-32 object-cover rounded-full mx-auto"
                onError={() => {
                  setPreviewImage('https://via.placeholder.com/128?text=No+Image');
                }}
              />
            ) : (
              <div className="mt-4 w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full mx-auto text-gray-500">
                No Image
              </div>
            )}
          </div>
          <div className="text-center space-x-4">
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? 'Updating...' : 'Update Biodata'}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-block px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBiodata;