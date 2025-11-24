import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function AdvisorsDetailPage() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';
  const [imgError, setImgError] = useState(false);
  const { id } = useParams();
  const [advisor, setAdvisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE_URL}/api/advisors/${id}`)
        .then((res) => {
          setAdvisor(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch advisor details");
          setLoading(false);
        });
    }
  }, [id, API_BASE_URL]);

  // Reusable wrapper component
  const Wrapper = ({ children }) => (
    <div 
      className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-sm sm:text-base overflow-x-auto" 
      style={{
        background: 'rgba(243, 249, 255, 0.9)',
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)', 
        boxShadow: '0 10px 40px rgba(15, 23, 42, 0.15)'
      }}
    >
      <div className="container mx-auto py-4 sm:py-8 lg:py-16 px-3 sm:px-6">{children}</div>
    </div>
  );

  if (loading) {
    return (
      <Wrapper>
        <motion.div 
          className="text-center" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center px-4 sm:px-6 py-3 bg-white/40 rounded-full shadow-lg border border-primary-300/40 text-slate-900">
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-primary-500 border-t-transparent mr-2 sm:mr-3"></div>
            <p className="text-base sm:text-lg font-medium text-slate-900">Loading advisor...</p>
          </div>
        </motion.div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <motion.div 
          className="text-center" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center px-4 sm:px-6 py-3 bg-red-50 rounded-full shadow-lg border border-red-300/50 mb-4 sm:mb-6">
            <p className="text-red-600 font-medium text-sm sm:text-base">{error}</p>
          </div>
          <Link 
            to="/advisors" 
            className="inline-flex items-center px-4 sm:px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            ← Back to Advisors
          </Link>
        </motion.div>
      </Wrapper>
    );
  }

  if (!advisor) {
    return (
      <Wrapper>
        <motion.div 
          className="text-center py-8 sm:py-12" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/60 rounded-2xl shadow-lg border border-primary-300/40 p-6 sm:p-8 max-w-md mx-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-xl sm:text-2xl">👤</span>
            </div>
            <h3 className="text-lg sm:text-xl font-poppins font-bold text-slate-900 mb-2">Advisor Not Found</h3>
            <p className="text-slate-700 mb-4 sm:mb-6 text-sm sm:text-base">The requested advisor could not be found.</p>
            <Link 
              to="/advisors" 
              className="inline-flex items-center px-4 sm:px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              ← Back to Advisors
            </Link>
          </div>
        </motion.div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* Dynamic gradient background (navy -> white) matching PartnerDetails */}
      <div className="fixed inset-0 bg-slate-50">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent"></div>
      </div>
      {/* Back Button - Top Left with Mobile Responsive Sizing */}
      <div className="relative z-10">
      <motion.div
        className="mb-4 sm:mb-6 lg:mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link 
          to="/advisors" 
          className="group inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl text-xs sm:text-sm md:text-base lg:text-lg border border-primary-300/40"
        >
          <span className="mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="hidden xs:inline sm:inline">Back to Advisors</span>
          <span className="inline xs:hidden sm:hidden">Back</span>
        </Link>
      </motion.div>

      {/* Main Title */}
        <motion.h1 
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins font-extrabold mb-6 sm:mb-8 lg:mb-12 text-center tracking-wide px-2 text-primary-500 drop-shadow-lg" 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Advisor 
          <motion.span 
          className="inline-block text-primary-500"
          animate={{ 
            backgroundPosition: ["0%", "100%", "0%"],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{ backgroundSize: "200% 100%" }}
        >
          Profile
        </motion.span>
      </motion.h1>

      {/* Advisor Profile Card */}
      <motion.div 
        className="max-w-5xl mx-auto" 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-primary-300/40 overflow-hidden mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 bg-white/80">
            {/* Profile Image Section */}
            <div className="flex justify-center mb-6 sm:mb-8">
              {(() => {
                let imgUrl = "/images/default-profile.png";
                if (advisor.photo_url) {
                  if (/^https?:\/\//i.test(advisor.photo_url)) {
                    imgUrl = advisor.photo_url;
                  } else if (advisor.photo_url.startsWith("/images/")) {
                    imgUrl = `${API_BASE_URL}${advisor.photo_url}`;
                  } else if (/^[\w\-.]+\.(jpg|jpeg|png|gif|webp)$/i.test(advisor.photo_url)) {
                    imgUrl = `${API_BASE_URL}/images/${advisor.photo_url}`;
                  }
                }
                if (!imgError) {
                  return (
                    <motion.img 
                      src={imgUrl} 
                      alt={advisor.name} 
                      className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-cover rounded-full shadow-2xl border-4 border-primary-300/40 transition-all duration-500 bg-white" 
                      onError={() => setImgError(true)} 
                      initial={{ opacity: 0, scale: 0.8 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }} 
                      whileHover={{ scale: 1.05 }} 
                    />
                  );
                } else {
                  return (
                    <motion.div 
                      className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 flex items-center justify-center rounded-full shadow-2xl border-4 border-primary-300/40 bg-gradient-to-br from-primary-500 via-emerald-700 to-primary-600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white" 
                      initial={{ opacity: 0, scale: 0.8 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }} 
                      whileHover={{ scale: 1.05 }}
                    >
                      {advisor.name && advisor.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </motion.div>
                  );
                }
              })()}
            </div>

            {/* Name and Title */}
            <div className="text-center mb-6 sm:mb-8">
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-poppins font-extrabold text-primary-500 mb-3 sm:mb-4 drop-shadow-lg px-2 break-words" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {advisor.name}
              </motion.h1>
              <motion.div 
                className="inline-block bg-white/60 text-slate-900 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-sm sm:text-base md:text-lg lg:text-xl border border-primary-300/40" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {advisor.area_of_focus}
              </motion.div>
            </div>

            {/* Bio Section */}
            <motion.div 
              className="bg-white/40 rounded-xl sm:rounded-2xl shadow-lg border border-primary-300/40 p-3 sm:p-4 md:p-6 lg:p-8 mb-6 sm:mb-8" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-emerald-700 rounded-lg shadow-md flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-white">ℹ️</span>
                </div>
                <h3 className="text-lg sm:text-xl font-poppins font-bold text-slate-900">About</h3>
                            {/* About section header uses primary accent for icon and light background */}
              </div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-700 font-roboto leading-relaxed max-w-4xl mx-auto text-justify break-words">
                {advisor.bio}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Details Section */}
        {advisor.details && (
          <motion.div 
            className="relative bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-primary-300/40 overflow-hidden" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-emerald-700 rounded-lg shadow-md flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <span className="text-sm sm:text-lg font-bold text-white">📋</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-poppins font-bold text-slate-900 break-words">Experience & Details</h3>
                            {/* Experience section header uses primary accent for icon and light background */}
              </div>
              <div className="bg-white/40 rounded-xl sm:rounded-2xl shadow-lg border border-primary-300/40 p-3 sm:p-4 md:p-6 lg:p-8">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-700 font-roboto leading-relaxed text-justify break-words">
                  {advisor.details}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      </div>
    </Wrapper>
  );
}