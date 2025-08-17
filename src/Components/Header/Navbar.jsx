import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import Logo from '../../Hook/Logo';
import { Authcontext } from '../Authicantion/Auth/Authcontext';

// Variants for navigation links (staggered animation)
const navLinkVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.4, duration: 0.7, ease: 'easeOut' },
  }),
  hover: { scale: 1.1, y: -2, transition: { duration: 0.3 } },
};

// Variants for mobile menu
const mobileMenuVariants = {
  hidden: { opacity: 0, y: -20, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

// Variants for hamburger icon
const hamburgerVariants = {
  closed: { rotate: 0 },
  open: { rotate: 45 },
};

const Navbar = () => {
  const { user, logout } = useContext(Authcontext);
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Biodatas', path: '/all-biodatas' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    ...(user ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close mobile menu on logout
    Swal.fire({
      title: 'Logged Out Successfully!',
      text: 'You have been logged out of ForeverVows.',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#D81B60',
      background: '#FFF8E1',
      color: '#212121',
      iconColor: '#FFD700',
      customClass: {
        title: 'font-playfair text-2xl',
        content: 'font-lato text-base',
        confirmButton: 'font-lato rounded-md px-4 py-2 shadow-sm hover:bg-[#FFD700] hover:text-[#212121] transition-colors duration-300',
      },
      backdrop: `
        rgba(248, 187, 208, 0.4)
        url("https://www.transparenttextures.com/patterns/hearts.png")
        center
        no-repeat
      `,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: true,
      willOpen: () => {
        Swal.getPopup().animate({
          scale: [0.8, 1.05, 1],
          opacity: [0, 1],
        }, {
          duration: 600,
          easing: 'ease-out',
        });
      },
    });
  };

  return (
    <div>
      <header className="bg-[#F8BBD0] shadow-sm">
        <div className="mx-auto w-[98%] py-2 px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1 md:flex md:items-center md:gap-12">
              <NavLink to="/">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  className="block text-[#D81B60]"
                  style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px' }}
                >
                  <span className="sr-only">Home</span>
                  <Logo />
                </motion.div>
              </NavLink>
            </div>

            <div className="md:flex md:items-center md:gap-12">
              <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={navLinkVariants}
                      whileHover="hover"
                    >
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          `relative text-[#212121] transition-colors duration-300 hover:text-[#D81B60] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D81B60] after:transition-all after:duration-300 hover:after:w-full ${
                            isActive ? 'text-[#D81B60] font-bold after:w-full' : ''
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center gap-4">
                <div className="sm:flex sm:gap-4">
                  {user ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                      whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                      className="rounded-md bg-[#D81B60] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#FFD700] hover:text-[#212121] transition-colors duration-300 cursor-pointer"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                      onClick={handleLogout}
                    >
                      Logout
                    </motion.div>
                  ) : (
                    <>
                      <NavLink to="/login">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                          whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                          className="rounded-md bg-[#D81B60] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#FFD700] hover:text-[#212121] transition-colors duration-300"
                          style={{ fontFamily: 'Lato, sans-serif' }}
                        >
                          Login
                        </motion.div>
                      </NavLink>

                      <div className="hidden sm:flex">
                        <NavLink to="/register">
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
                            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                            className="rounded-md bg-[#FFF8E1] px-5 py-2.5 text-sm font-medium text-[#D81B60] hover:bg-[#FFD700] hover:text-[#212121] transition-colors duration-300"
                            style={{ fontFamily: 'Lato, sans-serif' }}
                          >
                            Register
                          </motion.div>
                        </NavLink>
                      </div>
                    </>
                  )}
                </div>

                <div className="block md:hidden">
                  <motion.button
                    onClick={toggleMenu}
                    variants={hamburgerVariants}
                    animate={isOpen ? 'open' : 'closed'}
                    transition={{ duration: 0.3 }}
                    className="rounded-sm bg-[#FFF8E1] p-2 text-[#212121] hover:text-[#D81B60] transition-colors duration-300"
                    aria-expanded={isOpen}
                    aria-label="Toggle menu"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      {isOpen ? (
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.3 }}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.3 }}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      )}
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="md:hidden overflow-hidden"
              >
                <ul className="flex flex-col items-start gap-4 py-4 px-4 bg-[#FFF8E1] rounded-md" style={{ fontFamily: 'Lato, sans-serif' }}>
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      custom={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <NavLink
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `text-[#212121] transition-colors duration-300 hover:text-[#D81B60] ${
                            isActive ? 'text-[#D81B60] font-bold' : ''
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    </motion.li>
                  ))}
                  {user ? (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: navLinks.length * 0.1 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="text-[#212121] transition-colors duration-300 hover:text-[#D81B60] cursor-pointer"
                      >
                        Logout
                      </button>
                    </motion.li>
                  ) : (
                    <>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: navLinks.length * 0.1 }}
                      >
                        <NavLink
                          to="/login"
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `text-[#212121] transition-colors duration-300 hover:text-[#D81B60] ${
                              isActive ? 'text-[#D81B60] font-bold' : ''
                            }`
                          }
                        >
                          Login
                        </NavLink>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: (navLinks.length + 1) * 0.1 }}
                      >
                        <NavLink
                          to="/register"
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `text-[#212121] transition-colors duration-300 hover:text-[#D81B60] ${
                              isActive ? 'text-[#D81B60] font-bold' : ''
                            }`
                          }
                        >
                          Register
                        </NavLink>
                      </motion.li>
                    </>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Custom CSS for Tailwind Underline Animation */}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            .animate-logo, .animate-button, .motion-div, .motion-li, .motion-button, .motion-path {
              animation: none;
              transition: none;
            }
            .hover\\:scale-105, .hover\\:scale-110, .hover\\:rotate-2, .hover\\:rotate--2 {
              transform: none;
            }
          }
          .font-playfair {
            font-family: 'Playfair Display', serif;
          }
          .font-lato {
            font-family: 'Lato', sans-serif;
          }
        `}
      </style>
    </div>
  );
};

export default Navbar;