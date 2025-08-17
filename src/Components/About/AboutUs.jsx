import React from 'react';
import { motion } from 'framer-motion';

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 },
  },
};

// Animation variants for child elements
const childVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-br from-pink-50  to-rose-50 ">
      <div className="relative backdrop-blur-sm min-h-screen py-16">
        

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-rose-800 font-serif">
              About Love Matrimony
            </h1>
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-16 bg-yellow-400 rounded-full"></div>
              <span className="mx-4 text-2xl text-yellow-400">♥</span>
              <div className="h-1 w-16 bg-yellow-400 rounded-full"></div>
            </div>
          </motion.div>

          <div className="space-y-20">
            {/* Our Story Section */}
            <motion.section
              className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 lg:p-12 border border-rose-100"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2
                variants={childVariants}
                className="text-2xl sm:text-3xl font-semibold text-rose-800 mb-6 font-serif"
              >
                Our Story
              </motion.h2>
              <motion.p
                variants={childVariants}
                className="text-gray-600 text-lg sm:text-xl font-sans leading-relaxed"
              >
                Founded with a passion for uniting souls, Love Matrimony has been crafting love stories for over a decade. Inspired by industry leaders like BharatMatrimony and Shaadi.com, we blend cultural traditions with modern technology to connect Indians and NRIs worldwide. From Delhi to Dubai, our platform has helped thousands find their perfect match, fostering relationships built on trust and shared values.
              </motion.p>
            </motion.section>

            {/* Our Mission Section */}
            <motion.section
              className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 lg:p-12 border border-rose-100"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2
                variants={childVariants}
                className="text-2xl sm:text-3xl font-semibold text-rose-800 mb-6 font-serif"
              >
                Our Mission
              </motion.h2>
              <motion.p
                variants={childVariants}
                className="text-gray-600 text-lg sm:text-xl font-sans leading-relaxed"
              >
                At Love Matrimony, we strive to create meaningful connections that honor cultural heritage while embracing modern aspirations. Like Wedgate Matrimony, we treat every match as a sacred journey, offering a secure and personalized experience. Our goal is to foster lasting relationships rooted in compatibility, trust, and mutual respect.
              </motion.p>
            </motion.section>

            {/* Our Services Section */}
            <motion.section
              className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 lg:p-12 border border-rose-100"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2
                variants={childVariants}
                className="text-2xl sm:text-3xl font-semibold text-rose-800 mb-6 font-serif"
              >
                Our Services
              </motion.h2>
              <motion.ul
                variants={childVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 text-lg sm:text-xl font-sans"
              >
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Personalized matchmaking with verified profiles and dedicated coordinators.
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Advanced search filters for age, community, profession, and biodata preferences.
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Astro-matching, grooming, counseling, and premium portfolio services.
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Exclusive offerings for elites and NRIs with global connectivity.
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Secure, intuitive platform with inspiring success stories and community support.
                </li>
              </motion.ul>
            </motion.section>

            {/* Success Stories Section */}
            <motion.section
              className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 lg:p-12 border border-rose-100"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2
                variants={childVariants}
                className="text-2xl sm:text-3xl font-semibold text-rose-800 mb-6 font-serif"
              >
                Success Stories
              </motion.h2>
              <motion.p
                variants={childVariants}
                className="text-gray-600 text-lg sm:text-xl font-sans leading-relaxed"
              >
                Our platform has sparked countless love stories, turning introductions into lifelong partnerships. Drawing from the success of Matrimony.com and Blessings Matrimonials, we’ve facilitated thousands of weddings, often within weeks. Our personalized approach ensures every match is a step toward a joyful, enduring union.
              </motion.p>
            </motion.section>

            {/* Unique Features Section */}
            <motion.section
              className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 lg:p-12 border border-rose-100"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2
                variants={childVariants}
                className="text-2xl sm:text-3xl font-semibold text-rose-800 mb-6 font-serif"
              >
                What Makes Us Unique
              </motion.h2>
              <motion.p
                variants={childVariants}
                className="text-gray-600 text-lg sm:text-xl font-sans leading-relaxed"
              >
                Love Matrimony combines cutting-edge technology with heartfelt expertise, setting us apart in the matrimonial space. Our commitment to ethical practices, confidentiality, and personalized care ensures every match is crafted with precision, serving diverse communities from Delhi NCR to global NRIs.
              </motion.p>
            </motion.section>
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <a
              href="/join"
              className="inline-block bg-rose-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-rose-700 transition-colors duration-300"
            >
              Join Love Matrimony Today
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;