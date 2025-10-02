import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

// Counter animation variants
const counterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

// Section animation (fade + slide-up)
const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

// Card animation for success stories
const storyVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
  exit: { opacity: 0, scale: 0.9, y: 30 },
};

const SuccessCounter = () => {
  const loaderData = useLoaderData();

  // Ensure biodata is always an array
  const biodata = Array.isArray(loaderData) ? loaderData : loaderData?.biodata || [];

  const [successStories, setSuccessStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate stats
  const totalBiodata = biodata.length;
  const males = biodata.filter((entry) => entry.biodataType === "Male").length;
  const females = biodata.filter((entry) => entry.biodataType === "Female").length;
  const married = successStories.length;

  // Fetch success stories
  useEffect(() => {
    setIsLoading(true);
    fetch("https://matrimony-server-side-sigma.vercel.app/success-counter")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch success stories");
        return res.json();
      })
      .then((data) => {
        setSuccessStories(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#e8a4df] to-white py-20">
      {/* Counter Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-10 mb-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-5xl font-extrabold text-center text-rose-900 mb-14 relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Our Achievements
          <span className="block w-16 h-1 bg-rose-500 mx-auto mt-4 rounded-full"></span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Total Biodata", value: totalBiodata },
            { title: "Males", value: males },
            { title: "Females", value: females },
            { title: "Successful Marriages", value: married },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow-xl p-8 text-center border border-rose-100 hover:shadow-2xl transition duration-300"
              variants={counterVariants}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-3">{item.title}</h3>
              <p className="text-5xl font-bold text-rose-600">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Success Stories Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-10"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-5xl font-extrabold text-center text-rose-900 mb-14 relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Success Stories
          <span className="block w-16 h-1 bg-rose-500 mx-auto mt-4 rounded-full"></span>
        </motion.h2>

        {isLoading ? (
          <div className="text-center text-gray-600 text-lg">Loading stories...</div>
        ) : error ? (
          <div className="text-center text-rose-600 text-lg">Error: {error}</div>
        ) : successStories.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">No stories yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {successStories.map((story, i) => (
                <motion.div
                  key={story._id || i}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 border border-rose-100"
                  variants={storyVariants}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  exit="exit"
                  viewport={{ once: true }}
                >
                  <img
                    src={story.coupleImage || "https://via.placeholder.com/400x300"}
                    alt="Couple"
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-rose-900 mb-2">
                      {story.coupleName || "Happy Couple"}
                    </h3>
                    <p className="text-gray-500 mb-3">
                      Married on: {story.marriageDate || "N/A"}
                    </p>
                    <div className="flex items-center mb-4">
                      {[...Array(story.starReview || 5)].map((_, idx) => (
                        <svg
                          key={idx}
                          className="w-6 h-6 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.56 9.397c-.784-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {story.successStoryText ||
                        "An unforgettable journey of love and togetherness..."}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default SuccessCounter;
