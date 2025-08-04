import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// Variants for staggered card animations
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
  hover: { scale: 1.05, boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', transition: { duration: 0.3 } },
};

// Variants for section container
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const HowItWorks = () => {
  const steps = [
    {
      title: 'Register',
      description: 'Sign up easily with your details to join our community of singles seeking love.',
      icon: (
        <svg className="w-12 h-12 text-[#D81B60]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      title: 'Create Profile',
      description: 'Build a detailed profile with your preferences, photos, and personal story.',
      icon: (
        <svg className="w-12 h-12 text-[#D81B60]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.414 1.414 0 000-2l-2-2a1.414 1.414 0 00-2 0l-1.83 1.83 3.75 3.75L20.71 7.04z" />
        </svg>
      ),
    },
    {
      title: 'Search & Match',
      description: 'Use advanced filters to find your ideal partner based on your preferences.',
      icon: (
        <svg className="w-12 h-12 text-[#D81B60]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15.5 14h-.79l-.28-.27a6.51 6.51 0 001.48-4.23 6.5 6.5 0 10-6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" />
        </svg>
      ),
    },
    {
      title: 'Connect',
      description: 'Chat, share interests, and build connections with your matches securely.',
      icon: (
        <svg className="w-12 h-12 text-[#D81B60]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-gradient-to-r my-10 py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-[#FFF8E1] text-center mb-12"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            How ForeverVows Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
                className="bg-[#FFF8E1] rounded-lg p-6 text-center shadow-md"
              >
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3
                  className="text-lg font-semibold text-[#D81B60]"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-2 text-sm text-[#212121]"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <NavLink
              to="/register"
              className="inline-block bg-[#D81B60] text-[#FFF8E1] font-semibold py-3 px-6 rounded-full hover:bg-[#FFD700] hover:text-[#212121] transition-colors duration-300"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              Join Now
            </NavLink>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for Accessibility */}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            .motion-div {
              animation: none;
              transition: none;
            }
            .hover\\:scale-105 {
              transform: none;
            }
          }
        `}
      </style>
    </section>
  );
};

export default HowItWorks;