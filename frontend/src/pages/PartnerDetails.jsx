import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://venturepoint-backend.onrender.com";

export default function PartnerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    async function fetchPartner() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/partners/${id}`);
        let partnerData = null;
        if (res.data && res.data.data) {
          partnerData = res.data.data;
        } else if (res.data && typeof res.data === 'object') {
          partnerData = res.data;
        }
        setPartner(partnerData);
      } catch (err) {
        setError("Failed to fetch partner data.");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchPartner();
    }
  }, [id]);

  useEffect(() => {
    if (!loading && partner) {
      setTimeout(() => setIsVisible(true), 200);
    }
  }, [loading, partner]);

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.3)",
        "0 0 60px rgba(16, 185, 129, 0.4)",
        "0 0 20px rgba(59, 130, 246, 0.3)"
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-slate-50">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-slate-50/90">
          <div className="absolute inset-0 bg-slate-50"></div>
        </div>

        {/* Floating Orbs */}
        <motion.div
          className="fixed inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-br from-primary-500/20 to-emerald-700/15 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ top: '10%', left: '10%' }}
          />
          
          <motion.div
            className="absolute w-80 h-80 bg-gradient-to-br from-emerald-700/20 to-primary-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            style={{ top: '60%', right: '15%' }}
          />
        </motion.div>

        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative w-24 h-24 mx-auto mb-8"
            >
              <motion.div
                className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-2 border-4 border-emerald-700 border-b-transparent rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 border-4 border-primary-500/60 border-l-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            
            <motion.h3
              className="text-slate-900 text-2xl font-bold mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Loading Partner Details
            </motion.h3>
            
            <motion.p
              className="text-slate-700 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Discovering partnership excellence...
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-slate-50">
        {/* Background */}
        <div className="fixed inset-0 bg-slate-50/90">
          <div className="absolute inset-0 bg-slate-50"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div
              className="relative w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm"
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(239, 68, 68, 0.4)",
                  "0 0 20px 10px rgba(239, 68, 68, 0)",
                  "0 0 0 0 rgba(239, 68, 68, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl">⚠️</span>
            </motion.div>
            
            <h3 className="text-red-600 text-2xl mb-6 font-bold">{error}</h3>
            
            <motion.button 
              onClick={() => window.location.reload()}
              className="group relative px-10 py-4 bg-gradient-to-r from-primary-500 to-emerald-700 text-white rounded-2xl font-semibold transition-all duration-300 overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-primary-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Try Again</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-slate-50">
        {/* Background */}
        <div className="fixed inset-0 bg-slate-50/90">
          <div className="absolute inset-0 bg-slate-50"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-slate-300/20 to-slate-400/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm relative overflow-hidden"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <span className="text-5xl relative z-10">❓</span>
            </motion.div>
            
            <h3 className="text-slate-900 text-2xl mb-4 font-semibold">
              Partner Not Found
            </h3>
            
            <p className="text-slate-700 text-lg mb-8">
              The requested partner could not be located.
            </p>
            
            <motion.button
              onClick={() => navigate(-1)}
              className="group relative px-8 py-3 bg-gradient-to-r from-primary-500 to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft className="inline mr-2" />
              Go Back
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-xs sm:text-base overflow-x-auto bg-slate-50/90 backdrop-blur-xl"
    >
      <div className="min-h-screen relative overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="fixed inset-0 bg-slate-50">
          <div className="absolute inset-0 bg-slate-50/80"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden">
          {/* Floating Orbs with Mouse Interaction */}
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-br from-primary-500/20 to-emerald-700/15 rounded-full blur-3xl"
            animate={{
              x: mousePosition.x * 0.02,
              y: mousePosition.y * 0.02 - scrollY * 0.1,
              scale: [1, 1.2, 1],
            }}
            transition={{
              x: { type: "spring", stiffness: 50 },
              y: { type: "spring", stiffness: 50 },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ top: '10%', left: '10%' }}
          />
          
          <motion.div
            className="absolute w-80 h-80 bg-gradient-to-br from-emerald-700/20 to-primary-500/10 rounded-full blur-3xl"
            animate={{
              x: -mousePosition.x * 0.015,
              y: -mousePosition.y * 0.015 - scrollY * 0.05,
              scale: [1, 1.1, 1],
            }}
            transition={{
              x: { type: "spring", stiffness: 50 },
              y: { type: "spring", stiffness: 50 },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
            style={{ top: '60%', right: '15%' }}
          />
          
          <motion.div
            className="absolute w-72 h-72 bg-gradient-to-br from-primary-500/15 to-emerald-700/15 rounded-full blur-3xl"
            animate={{
              x: mousePosition.x * 0.01,
              y: mousePosition.y * 0.025 - scrollY * 0.08,
              scale: [1, 1.15, 1],
            }}
            transition={{
              x: { type: "spring", stiffness: 50 },
              y: { type: "spring", stiffness: 50 },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }
            }}
            style={{ bottom: '20%', left: '30%' }}
          />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.015]">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(44,62,80,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(44,62,80,0.08) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-500/40 rounded-full"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          className="relative z-10 px-2 sm:px-6 lg:px-8 py-4 sm:py-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-6xl mx-auto">
            
            {/* Enhanced Back Button */}
            <motion.button
              className="group flex items-center gap-2 sm:gap-3 text-primary-500 hover:text-white font-semibold mb-6 sm:mb-12 transition-all duration-300 p-2 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-primary-500/10 backdrop-blur-sm border border-primary-300/40"
              onClick={() => navigate(-1)}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                x: -5,
                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="p-2 bg-primary-500 rounded-full"
                whileHover={{ rotate: -180 }}
                transition={{ duration: 0.3 }}
              >
                <FaArrowLeft className="text-sm text-white" />
              </motion.div>
              <span className="text-base sm:text-lg">Back to Partners</span>
            </motion.button>

            {/* Main Content Card */}
            <motion.div
              variants={itemVariants}
              className="relative bg-white/60 backdrop-blur-xl rounded-xl sm:rounded-3xl border border-primary-300/40 shadow-2xl overflow-hidden"
            >
              
              {/* Animated Glow Effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary-500/15 via-emerald-700/15 to-primary-500/15 rounded-3xl blur-xl opacity-60"
                variants={glowVariants}
                animate="animate"
              />

              {/* Hero Section */}
              <div className="relative bg-gradient-to-br from-primary-500/90 via-emerald-700/90 to-primary-500/90 text-white px-4 sm:px-8 py-10 sm:py-20 text-center overflow-hidden">
                
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-10">
                  <motion.div
                    className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-10 right-10 w-24 h-24 bg-white/20 rounded-full"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  />
                  <motion.div
                    className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/25 rounded-full"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.25, 0.7, 0.25]
                    }}
                    transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>

                <div className="relative z-10">
                  {/* Profile Image or Initials Circle */}
                  <motion.div
                    className="mb-6 sm:mb-10 flex justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 120 }}
                  >
                    {partner.image ? (
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img
                          src={partner.image}
                          alt={partner.name}
                          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-full border-4 border-primary-300/40 shadow-2xl"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-primary-300/50"
                          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="relative w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-primary-500 via-emerald-700 to-primary-600 rounded-full border-4 border-primary-300/40 shadow-2xl flex items-center justify-center overflow-hidden"
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0 0 60px rgba(59, 130, 246, 0.6)"
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="text-4xl sm:text-6xl font-bold text-white select-none relative z-10">
                          {getInitials(partner.name)}
                        </span>
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-primary-300/40"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Partner Name */}
                    <h1
                      className="text-2xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 drop-shadow-2xl text-white"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      {partner.name}
                    </h1>

                  {/* Enhanced Partnership Badge */}
                  <motion.div
                    className="inline-block relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-white/30 to-white/10 rounded-full blur"
                      animate={{ 
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative px-6 sm:px-10 py-2 sm:py-4 bg-white/60 backdrop-blur-sm rounded-full border border-primary-300/40">
                      <span className="text-base sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
                        ✨ Strategic Partner
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Content Section */}
              <div className="px-2 sm:px-8 py-6 sm:py-16">
                <AnimatePresence>
                  {partner.details ? (
                    <motion.div
                      key="details"
                      className="max-w-5xl mx-auto"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 0.8 }}
                    >
                      {/* Section Header */}
                      <motion.div 
                        className="text-center mb-12"
                        whileInView={{ scale: [0.9, 1] }}
                        transition={{ duration: 0.6 }}
                      >
                        <motion.h2 
                          className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          Partnership Overview
                        </motion.h2>
                        
                        <motion.div 
                          className="flex justify-center items-center space-x-4 mb-4"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 1, delay: 1.8 }}
                        >
                          <motion.div
                            className="h-1 bg-white/40 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: ["0%", "100px", "0%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </motion.div>
                      </motion.div>
                      
                      {/* Details Content */}
                      <motion.div
                        className="relative group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 via-emerald-700/10 to-primary-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100"
                          transition={{ duration: 0.5 }}
                        />
                        
                        <div className="relative bg-white/60 backdrop-blur-xl border border-primary-300/40 rounded-xl sm:rounded-3xl p-4 sm:p-12 shadow-xl">
                          <motion.div
                            className="text-slate-900 leading-relaxed text-base sm:text-lg lg:text-xl whitespace-pre-line text-justify"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2, duration: 1 }}
                          >
                            {partner.details.split('\n').map((paragraph, index) => (
                              <motion.p
                                key={index}
                                className="mb-4 sm:mb-6 last:mb-0"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 2.2 + index * 0.3, duration: 0.8 }}
                              >
                                {paragraph}
                              </motion.p>
                            ))}
                          </motion.div>
                          
                          {/* Decorative Quote Marks */}
                          <motion.div
                            className="absolute top-8 left-8 text-6xl text-primary-500/20 font-serif"
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 2.5, duration: 0.8 }}
                          >
                            "
                          </motion.div>
                          <motion.div
                            className="absolute bottom-8 right-8 text-6xl text-emerald-700/20 font-serif transform rotate-180"
                            initial={{ scale: 0, rotate: 135 }}
                            animate={{ scale: 1, rotate: 180 }}
                            transition={{ delay: 2.8, duration: 0.8 }}
                          >
                            "
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-details"
                      className="max-w-2xl mx-auto text-center"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 0.8 }}
                    >
                      <motion.div 
                        className="relative p-16 rounded-3xl border border-primary-300/40 overflow-hidden"
                        style={{
                          background: 'rgba(243, 249, 255, 0.6)',
                          backdropFilter: 'blur(20px)'
                        }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {/* Background Animation */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-emerald-700/5 to-primary-500/5"
                          animate={{ 
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                          }}
                          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                          style={{ backgroundSize: "200% 100%" }}
                        />
                        
                        <div className="relative z-10">
                          <motion.div 
                            className="w-24 h-24 bg-gradient-to-br from-primary-500/20 via-emerald-700/20 to-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm"
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: 4, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                          >
                            <span className="text-4xl">🤝</span>
                          </motion.div>
                          
                          <motion.h3 
                            className="text-3xl font-bold text-primary-500 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2, duration: 0.8 }}
                          >
                            Welcome, {partner.name}!
                          </motion.h3>
                          
                          <motion.p 
                            className="text-xl text-slate-700 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.3, duration: 0.8 }}
                          >
                            We're excited about this strategic partnership. More details about our collaboration will be available soon.
                          </motion.p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}