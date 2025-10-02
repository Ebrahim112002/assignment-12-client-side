import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Authcontext } from '../Auth/Authcontext';

const Register = () => {
  const { createUser } = useContext(Authcontext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let photoURL = '';
      if (photo) {
        if (!(photo instanceof File)) {
          throw new Error('Invalid file selected. Please choose an image.');
        }
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
        if (!validTypes.includes(photo.type)) {
          throw new Error('Unsupported image format. Use JPG, PNG, GIF, or BMP.');
        }
        if (photo.size > 32 * 1024 * 1024) {
          throw new Error('Image size exceeds 32 MB limit.');
        }

        const formData = new FormData();
        formData.append('image', photo);
        const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

        if (!imgbbKey) {
          throw new Error('ImgBB API key is missing. Check your .env file.');
        }
        formData.append('key', imgbbKey);

        console.log('Photo object:', photo);
        console.log('ImgBB Key:', imgbbKey);
        console.log('FormData entries:', [...formData.entries()]);

        const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
          timeout: 15000,
        });
        if (response.data.success) {
          photoURL = response.data.data.url;
          console.log('ImgBB upload successful:', photoURL);
        } else {
          throw new Error(response.data.error?.message || 'Failed to upload image to ImgBB');
        }
      }

      await createUser(email, password, name, photoURL);

      Swal.fire({
        title: 'Registration Successful!',
        text: 'Welcome to Love Matrimony! Your account has been created.',
        icon: 'success',
        confirmButtonColor: '#D81B60',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
      console.error('Registration error:', err);
      Swal.fire({
        title: 'Registration Failed',
        text: err.message || 'Unable to create account. Please try again.',
        icon: 'error',
        confirmButtonColor: '#D81B60',
        showConfirmButton: true,
      });
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.4, ease: 'easeOut' },
    }),
  };

  return (
    <div className="py-16 flex items-center justify-center bg-[#FFF8E1] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white/90 backdrop-blur-xl border border-[#FFD700] shadow-xl rounded-2xl p-10"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center text-3xl font-bold text-[#D81B60] mb-6 font-playfair"
        >
          Create Your Account
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            ['Name', name, setName, 'text'],
            ['Email', email, setEmail, 'email'],
            ['Password', password, setPassword, 'password'],
          ].map(([label, value, setter, type], i) => (
            <motion.div key={label} custom={i} initial="hidden" animate="visible" variants={inputVariants}>
              <label className="block text-[#212121] font-lato font-semibold mb-1">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                className="w-full p-3 bg-[#FFF8E1] border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#D81B60] outline-none font-lato"
                placeholder={`Enter your ${label.toLowerCase()}`}
              />
            </motion.div>
          ))}

          <motion.div custom={3} initial="hidden" animate="visible" variants={inputVariants}>
            <label className="block text-[#212121] font-lato font-semibold mb-1">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full p-2 border border-[#E0E0E0] bg-white rounded-lg font-lato"
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-[#EF5350] font-lato text-sm"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D81B60] to-[#4A2C40] text-white font-lato font-semibold text-lg transition duration-300"
          >
            Register
          </motion.button>
        </form>

        <p className="text-center mt-6 text-[#212121] font-lato">
          Already have an account?{' '}
          <a href="/login" className="text-[#D81B60] hover:underline font-semibold">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;