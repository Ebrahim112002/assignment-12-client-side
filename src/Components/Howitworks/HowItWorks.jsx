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
  hover: { scale: 1.05, boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)', transition: { duration: 0.3 } },
};

// Variants for icon animations
const iconVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
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
      tagline: 'Secure Sign-Up',
      description:
        'Join ForeverVows with a quick and secure registration process. Sign up using your email, phone, or social media accounts. Premium members enjoy priority profile verification for added trust.',
      icon: (
        <motion.svg
          className="w-16 h-16 text-[#D81B60]"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          variants={iconVariants}
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </motion.svg>
      ),
    },
    {
      title: 'Create Profile',
      tagline: 'Personalized Profiles',
      description:
        'Craft a detailed profile with your preferences, lifestyle, and photos. Add personal stories and interests to stand out. Premium members can highlight their profiles for greater visibility.',
      icon: (
        <motion.svg
          className="w-16 h-16 text-[#D81B60]"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          variants={iconVariants}
        >
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.414 1.414 0 000-2l-2-2a1.414 1.414 0 00-2 0l-1.83 1.83 3.75 3.75L20.71 7.04z" />
        </motion.svg>
      ),
    },
    {
      title: 'Search & Match',
      tagline: 'Advanced Filters',
      description:
        'Use powerful search tools to find your ideal partner based on criteria like religion, education, and location. Premium members unlock advanced filters and AI-driven match suggestions.',
      icon: (
        <motion.svg
          className="w-16 h-16 text-[#D81B60]"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          variants={iconVariants}
        >
          <path d="M15.5 14h-.79l-.28-.27a6.51 6.51 0 001.48-4.23 6.5 6.5 0 10-6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" />
        </motion.svg>
      ),
    },
    {
      title: 'Connect',
      tagline: 'Secure Communication',
      description:
        'Start conversations with matches through secure chat or video calls. Premium members enjoy priority messaging and exclusive access to virtual events to build meaningful connections.',
      icon: (
        <motion.svg
          className="w-16 h-16 text-[#D81B60]"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          variants={iconVariants}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </motion.svg>
      ),
    },
  ];

  return (
    <section className="bg-[#FFF8E1] py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-[#D81B60] text-center mb-12"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            How Love Matrimonial Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
                className="bg-white rounded-lg p-8 text-center shadow-lg border border-[#D81B60] min-h-[300px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-center mb-4">{step.icon}</div>
                  <h3
                    className="text-lg font-semibold text-[#D81B60]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm text-[#212121] font-medium mt-2"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    {step.tagline}
                  </p>
                  <p
                    className="mt-3 text-sm text-[#212121]"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <NavLink
              to="/register"
              className="inline-block bg-[#D81B60] text-[#FFF8E1] font-semibold py-3 px-8 rounded-md hover:bg-[#FFD700] hover:text-[#212121] transition-colors duration-300"
              style={{ fontFamily: 'Lato, sans-serif' }}
              aria-label="Start your journey with ForeverVows"
            >
              Start Your Journey
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