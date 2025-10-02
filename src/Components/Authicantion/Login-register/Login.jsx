import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { Authcontext } from '../Auth/Authcontext';

const Login = () => {
  const { signIn, googleSignIn } = useContext(Authcontext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      Swal.fire({
        title: 'Login Successful!',
        text: 'Welcome back to Love Matrimony!',
        icon: 'success',
        confirmButtonColor: '#D81B60',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
      Swal.fire({
        title: 'Login Failed',
        text: err.message || 'Invalid email or password. Please try again.',
        icon: 'error',
        confirmButtonColor: '#D81B60',
        showConfirmButton: true,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      Swal.fire({
        title: 'Login Successful!',
        text: 'Welcome back to Love Matrimony!',
        icon: 'success',
        confirmButtonColor: '#D81B60',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/');
    } catch (err) {
      Swal.fire({
        title: 'Google Login Failed',
        text: err.message || 'Failed to sign in with Google. Please try again.',
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
    <div className="flex items-center justify-center py-16 bg-[#FFF8E1] px-4">
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
          Login to Love Matrimony
        </motion.h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {[['Email', email, setEmail, 'email'], ['Password', password, setPassword, 'password']].map(([label, value, setter, type], i) => (
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
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D81B60] to-[#4A2C40] text-[#212121] font-lato font-semibold text-lg transition duration-300"
          >
            Login
          </motion.button>
        </form>

        <div className="mt-6">
          <p className="text-center text-[#757575] font-lato mb-4">Or sign in with</p>
          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 border border-[#E0E0E0] rounded-lg text-[#212121] font-lato font-semibold text-lg transition duration-300 bg-white hover:bg-[#F5F5F5]"
          >
            Continue with Google
          </motion.button>
        </div>

        <p className="text-center mt-6 text-[#212121] font-lato">
          Don't have an account?{' '}
          <a href="/register" className="text-[#D81B60] hover:underline font-semibold">
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;