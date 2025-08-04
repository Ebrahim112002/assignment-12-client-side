import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Banner = () => {
  const headlines = [
    "Discover Your Soulmate",
    "Love Matrimonial: Where Love Begins",
    "Unite Hearts Forever",
    "Your Journey to Love Starts Here"
  ];

  const [currentHeadline, setCurrentHeadline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [headlines.length]);

  return (
    <div className="relative h-[700px] w-full overflow-hidden bg-[#F8BBD0]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://i.ibb.co/GvBK56tL/groom-putting-ring-bride-s-finger.jpg')`,
          filter: 'brightness(0.7) contrast(1.1)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#D81B60]/40 to-transparent"></div>
      </div>

      <div className="relative flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8 z-10 ">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFF8E1] animate-typewriter"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="inline-block" key={currentHeadline}>
              {headlines[currentHeadline]}
            </span>
          </h1>
          <p
            className="mt-12 text-base sm:text-lg text-[#FFF8E1] max-w-md mx-auto"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            At Love Matrimonial, we craft timeless connections with trust and elegance, guiding you to your perfect partner.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <NavLink
              to="/register"
              className="rounded-md bg-[#D81B60] px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-[#FFD700] hover:text-[#212121] transition duration-300 ease-in-out"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Get Started
            </NavLink>
            <NavLink
              to="/biodatas"
              className="rounded-md bg-[#FFF8E1] px-5 py-2.5 text-sm font-medium text-[#D81B60] shadow-md hover:bg-[#FFD700] hover:text-[#212121] transition duration-300 ease-in-out"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Browse Profiles
            </NavLink>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes typewriter {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          90% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 0; }
        }

        .animate-typewriter span {
          animation: typewriter 5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Banner;