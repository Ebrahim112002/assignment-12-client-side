import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Authcontext } from '../../Authicantion/Auth/Authcontext';

const Create_Biodata = () => {
  const { user, token } = useContext(Authcontext);
  const navigate = useNavigate();
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
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user || !user.email || !token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'Please log in to create a biodata.',
        confirmButtonColor: '#D81B60',
      }).then(() => {
        navigate('/login');
      });
      return;
    }
    console.log('Firebase user:', JSON.stringify(user, null, 2));
    console.log('Firebase ID Token:', token);
    setFormData((prev) => ({ ...prev, contactEmail: user.email }));
  }, [user, token, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.biodataType) newErrors.biodataType = 'Biodata type is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.height) newErrors.height = 'Height is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.age || formData.age < 18) newErrors.age = 'Age must be 18 or older';
    if (!formData.occupation) newErrors.occupation = 'Occupation is required';
    if (!formData.race) newErrors.race = 'Race is required';
    if (!formData.fatherName) newErrors.fatherName = 'Father’s name is required';
    if (!formData.motherName) newErrors.motherName = 'Mother’s name is required';
    if (!formData.permanentDivision) newErrors.permanentDivision = 'Permanent division is required';
    if (!formData.presentDivision) newErrors.presentDivision = 'Present division is required';
    if (!formData.expectedPartnerAge || !/^\d{2}-\d{2}$/.test(formData.expectedPartnerAge) || parseInt(formData.expectedPartnerAge.split('-')[0]) < 18) {
      newErrors.expectedPartnerAge = 'Expected partner age must be a range (e.g., 18-30) with minimum 18';
    }
    if (!formData.expectedPartnerHeight) newErrors.expectedPartnerHeight = 'Expected partner height is required';
    if (!formData.expectedPartnerWeight) newErrors.expectedPartnerWeight = 'Expected partner weight is required';
    if (!formData.contactEmail || !/\S+@\S+\.\S+/.test(formData.contactEmail)) newErrors.contactEmail = 'Valid email is required';
    if (!formData.mobileNumber || !/^\d{10,}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Valid mobile number is required';
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
    if (!imageFile) newErrors.profileImage = 'Profile image is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Image size must be less than 2MB.',
          confirmButtonColor: '#D81B60',
        });
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Only JPEG and PNG images are allowed.',
          confirmButtonColor: '#D81B60',
        });
        return;
      }
      setImageFile(file);
      setErrors((prev) => ({ ...prev, profileImage: '' }));
      console.log('Selected image:', file.name, file.size, file.type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('Validation errors:', JSON.stringify(validationErrors, null, 2));
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: Object.values(validationErrors).join('\n'),
        confirmButtonColor: '#D81B60',
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      if (imageFile) {
        formDataToSend.append('profileImage', imageFile);
      }
      console.log('Form data being sent:', Object.fromEntries(formDataToSend));

      const response = await axios.post('http://localhost:3000/biodatas', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      Swal.fire({
        icon: 'success',
        title: 'Biodata Created!',
        text: response.data.message,
        confirmButtonColor: '#D81B60',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating biodata:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        code: error.code,
      }, null, 2));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to create biodata.',
        confirmButtonColor: '#D81B60',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-b from-[#F8BBD0] to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-center text-[#D81B60] font-[Playfair Display]"
        >
          Create Your Biodata
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-gray-600 font-[Poppins] mt-2"
        >
          Share your details to find your perfect match
        </motion.p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="biodataType" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Biodata Type
              </label>
              <select
                id="biodataType"
                name="biodataType"
                value={formData.biodataType}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.biodataType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              >
                <option value="">Select Type</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.biodataType && <p className="text-red-500 text-xs mt-1">{errors.biodataType}</p>}
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Height
              </label>
              <input
                id="height"
                name="height"
                type="text"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g., 5'9&quot;"
                className={`mt-1 p-2 w-full border ${errors.height ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Weight
              </label>
              <input
                id="weight"
                name="weight"
                type="text"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 75kg"
                className={`mt-1 p-2 w-full border ${errors.weight ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
            </div>
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Occupation
              </label>
              <input
                id="occupation"
                name="occupation"
                type="text"
                value={formData.occupation}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.occupation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
            </div>
            <div>
              <label htmlFor="race" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Race
              </label>
              <input
                id="race"
                name="race"
                type="text"
                value={formData.race}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.race ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.race && <p className="text-red-500 text-xs mt-1">{errors.race}</p>}
            </div>
            <div>
              <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Father’s Name
              </label>
              <input
                id="fatherName"
                name="fatherName"
                type="text"
                value={formData.fatherName}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.fatherName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
            </div>
            <div>
              <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Mother’s Name
              </label>
              <input
                id="motherName"
                name="motherName"
                type="text"
                value={formData.motherName}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.motherName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.motherName && <p className="text-red-500 text-xs mt-1">{errors.motherName}</p>}
            </div>
            <div>
              <label htmlFor="permanentDivision" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Permanent Division
              </label>
              <select
                id="permanentDivision"
                name="permanentDivision"
                value={formData.permanentDivision}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.permanentDivision ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              >
                <option value="">Select Division</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Barisal">Barisal</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
              {errors.permanentDivision && <p className="text-red-500 text-xs mt-1">{errors.permanentDivision}</p>}
            </div>
            <div>
              <label htmlFor="presentDivision" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Present Division
              </label>
              <select
                id="presentDivision"
                name="presentDivision"
                value={formData.presentDivision}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.presentDivision ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              >
                <option value="">Select Division</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Barisal">Barisal</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
              {errors.presentDivision && <p className="text-red-500 text-xs mt-1">{errors.presentDivision}</p>}
            </div>
            <div>
              <label htmlFor="expectedPartnerAge" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Expected Partner Age
              </label>
              <input
                id="expectedPartnerAge"
                name="expectedPartnerAge"
                type="text"
                value={formData.expectedPartnerAge}
                onChange={handleChange}
                placeholder="e.g., 18-30"
                className={`mt-1 p-2 w-full border ${errors.expectedPartnerAge ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.expectedPartnerAge && <p className="text-red-500 text-xs mt-1">{errors.expectedPartnerAge}</p>}
            </div>
            <div>
              <label htmlFor="expectedPartnerHeight" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Expected Partner Height
              </label>
              <input
                id="expectedPartnerHeight"
                name="expectedPartnerHeight"
                type="text"
                value={formData.expectedPartnerHeight}
                onChange={handleChange}
                placeholder="e.g., 5'0&quot;-5'5&quot;"
                className={`mt-1 p-2 w-full border ${errors.expectedPartnerHeight ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.expectedPartnerHeight && <p className="text-red-500 text-xs mt-1">{errors.expectedPartnerHeight}</p>}
            </div>
            <div>
              <label htmlFor="expectedPartnerWeight" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Expected Partner Weight
              </label>
              <input
                id="expectedPartnerWeight"
                name="expectedPartnerWeight"
                type="text"
                value={formData.expectedPartnerWeight}
                onChange={handleChange}
                placeholder="e.g., 50-60kg"
                className={`mt-1 p-2 w-full border ${errors.expectedPartnerWeight ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.expectedPartnerWeight && <p className="text-red-500 text-xs mt-1">{errors.expectedPartnerWeight}</p>}
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Contact Email
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
                disabled
              />
              {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
            </div>
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="text"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="e.g., 01711111113"
                className={`mt-1 p-2 w-full border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
            </div>
            <div>
              <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Marital Status
              </label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border ${errors.maritalStatus ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              >
                <option value="">Select Status</option>
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {errors.maritalStatus && <p className="text-red-500 text-xs mt-1">{errors.maritalStatus}</p>}
            </div>
            <div className="col-span-2">
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 font-[Poppins]">
                Profile Image
              </label>
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                className={`mt-1 p-2 w-full border ${errors.profileImage ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#D81B60] focus:border-[#D81B60] font-[Poppins]`}
              />
              {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage}</p>}
            </div>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-[#D81B60] text-white font-[Poppins] py-2 px-4 rounded-md hover:bg-[#B71C1C] transition-colors"
          >
            Create Biodata
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Create_Biodata;