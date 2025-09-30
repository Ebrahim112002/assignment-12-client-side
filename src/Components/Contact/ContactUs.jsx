import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => (
  <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 flex items-center justify-center p-6">
    <div className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl p-10">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-serif font-bold text-center text-[#D81B60]"
      >
        Get in Touch with Love Matrimoniyal
      </motion.h2>
      <p className="text-center text-gray-700 mt-3">
        We’re here to help you start your journey to forever—connect with us anytime!
      </p>

      {/* Contact Info */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {[
          {
            Icon: Mail,
            title: 'Email',
            detail: 'support@lovematrimoniyal.com'
          },
          {
            Icon: Phone,
            title: 'Phone',
            detail: '+880 1234-567890'
          },
          {
            Icon: MapPin,
            title: 'Location',
            detail: 'Dhaka, Bangladesh'
          }
        ].map((item, i) => (
          <motion.div
            key={item.title}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center p-6 bg-pink-100 rounded-2xl shadow-md"
          >
            <item.Icon className="w-10 h-10 text-[#D81B60] mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#D81B60] outline-none"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#D81B60] outline-none"
          />
        </div>
        <textarea
          rows="5"
          placeholder="Your Message"
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#D81B60] outline-none"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#D81B60] text-white py-3 rounded-xl font-semibold shadow-md"
        >
          Send Message
        </motion.button>
      </motion.form>

     
    </div>
  </div>
);

export default ContactUs;
