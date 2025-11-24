import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function PartnersPage() {
  const location = useLocation();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/partners`);
        console.log('Partners response:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Partners data:', data);
        
        setPartners(
          Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : []
        );
        setLoading(false);
      } catch (err) {
        console.error('Error fetching partners:', err);
        if (err.message.includes('404')) {
          setError('Partners endpoint not found. Please check your backend configuration.');
        } else if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
          setError('Network error. Please check if your backend server is running.');
        } else {
          setError(`Failed to fetch partners: ${err.message}`);
        }
        setLoading(false);
      }
    };
    fetchPartners();
  }, [API_BASE_URL, location]);

  const getInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .filter(word => !["NGO", "-", "El", "The"].includes(word))
      .map(word => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Dynamic stats
  const filteredPartners = partners.filter(partner =>
    (partner.name || partner).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate unique countries (if partners have a country field)
  const countrySet = new Set();
  partners.forEach(p => {
    if (p.country) countrySet.add(p.country.trim());
  });
  const countriesCount = countrySet.size;

  // Calculate years experience (if partners have a start_year or similar field)
  let minYear = new Date().getFullYear();
  partners.forEach(p => {
    if (p.start_year && !isNaN(Number(p.start_year))) {
      minYear = Math.min(minYear, Number(p.start_year));
    }
  });
  const yearsExperience = minYear < new Date().getFullYear() ? (new Date().getFullYear() - minYear) : 1;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        duration: 0.6
      }
    },
    hover: {
      y: -20,
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: [0, 0.6, 0],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div
      className="w-full max-w-8xl rounded-2xl shadow-strong p-2 sm:p-4 md:p-8 text-sm sm:text-base overflow-x-auto"
      style={{
        background: 'rgba(243, 249, 255, 0.9)', // Light slate background
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 10px 40px rgba(15, 23, 42, 0.15)', // Strong professional shadow
      }}
    >
      <div className="min-h-screen relative overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="fixed inset-0 bg-slate-50">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-br from-primary-400/15 to-emerald-700/10 rounded-full blur-3xl"
            animate={{
              x: mousePosition.x * 0.02,
              y: mousePosition.y * 0.02,
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
            className="absolute w-80 h-80 bg-gradient-to-br from-emerald-700/15 to-primary-400/8 rounded-full blur-3xl"
            animate={{
              x: -mousePosition.x * 0.015,
              y: -mousePosition.y * 0.015,
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
            className="absolute w-72 h-72 bg-gradient-to-br from-primary-500/12 to-emerald-700/12 rounded-full blur-3xl"
            animate={{
              x: mousePosition.x * 0.01,
              y: mousePosition.y * 0.025,
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
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(71, 85, 105, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(71, 85, 105, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Particle System */}
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
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <motion.div 
              className="text-center mb-12 lg:mb-20"
              initial={{ opacity: 0, y: -100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {/* Animated Icon */}
              <motion.div
                className="relative inline-block mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 120 }}
              >
                
                
                {/* Pulsing Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                  Our Strategic
                  <span className="block text-primary-500 mt-2">
                    Partners
                  </span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-lg sm:text-xl lg:text-2xl text-slate-700 max-w-4xl mx-auto leading-relaxed font-light px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                Building tomorrow through collaborative partnerships that drive sustainable economic development and innovation across the region
              </motion.p>
              
              {/* Animated Divider */}
              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.6, duration: 1 }}
              >
                <motion.div
                  className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full"
                  animate={{ width: ["0%", "200px", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>

            {/* Enhanced Search Section */}
            <motion.div 
              className="max-w-lg mx-auto mb-16"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <div className="relative group">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-700 via-primary-500 to-emerald-700 rounded-3xl blur opacity-25"
                  animate={{ 
                    opacity: searchFocused ? 0.6 : 0.3,
                    scale: searchFocused ? 1.02 : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search our amazing partners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full px-8 py-5 bg-white/80 backdrop-blur-xl border border-slate-300/40 rounded-3xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-500 text-lg"
                  />
                  
                  <motion.div 
                    className="absolute right-6 top-1/2 transform -translate-y-1/2"
                    animate={{ 
                      rotate: searchTerm ? 180 : 0,
                      scale: searchFocused ? 1.2 : 1 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Partners Content */}
            <motion.div
              className="relative"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Glassmorphic Container */}
              <div className="relative bg-white/40 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-strong p-6 sm:p-8 lg:p-12 overflow-hidden">
                
                {/* Container Glow Effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary-400/10 via-emerald-700/10 to-primary-400/10 rounded-3xl blur-xl"
                  variants={glowVariants}
                  initial="initial"
                  animate="animate"
                />
                
                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div 
                        key="loading"
                        className="flex items-center justify-center py-32"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="text-center">
                          <motion.div
                            className="relative w-20 h-20 mx-auto mb-8"
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
                              className="absolute inset-4 border-4 border-primary-600 border-l-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                          </motion.div>
                          
                          <motion.h3
                            className="text-slate-900 text-2xl font-bold mb-4"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            Discovering Amazing Partners
                          </motion.h3>
                          
                          <motion.p
                            className="text-slate-600 text-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                          >
                            Building connections that matter...
                          </motion.p>
                        </div>
                      </motion.div>
                    ) : error ? (
                      <motion.div 
                        key="error"
                        className="text-center py-32"
                        initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.6, type: "spring" }}
                      >
                        <motion.div
                          className="relative w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm"
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
                          className="group relative px-10 py-4 bg-gradient-to-r from-emerald-700 to-primary-500 text-white rounded-2xl font-semibold transition-all duration-300 overflow-hidden"
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 20px 40px rgba(59, 139, 201, 0.3)"
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary-500 to-emerald-700"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "0%" }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="relative z-10">Try Again</span>
                        </motion.button>
                      </motion.div>
                    ) : filteredPartners.length === 0 ? (
                      <motion.div 
                        key="empty"
                        className="text-center py-32"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.6 }}
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
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          />
                          <span className="text-5xl relative z-10">🔍</span>
                        </motion.div>
                        
                        <motion.h3
                          className="text-slate-900 text-2xl mb-4 font-semibold"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {searchTerm ? `No partners found for "${searchTerm}"` : "No partners available yet"}
                        </motion.h3>
                        
                        <motion.p
                          className="text-slate-600 text-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {searchTerm ? "Try adjusting your search terms" : "We're constantly building new partnerships"}
                        </motion.p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="partners"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        variants={containerVariants}
                      >
                        {filteredPartners.map((partner, idx) => (
                          <Link 
                            key={partner.id || idx} 
                            to={`/partners/${partner.id}`} 
                            className="block h-full group"
                          >
                            <motion.div
                              className="group relative"
                              variants={cardVariants}
                              whileHover="hover"
                              onHoverStart={() => setHoveredCard(idx)}
                              onHoverEnd={() => setHoveredCard(null)}
                            >
                              {/* Card Background Glow */}
                              <motion.div
                                className="absolute -inset-2 bg-gradient-to-br from-primary-400/15 via-emerald-700/15 to-primary-400/15 rounded-3xl blur-lg opacity-0 group-hover:opacity-100"
                                transition={{ duration: 0.3 }}
                              />
                              {/* Main Card */}
                              <motion.div
                                className="relative h-full p-8 pb-12 bg-white/50 backdrop-blur-xl rounded-3xl border border-primary-300/40 hover:border-primary-400/60 shadow-medium cursor-pointer overflow-hidden flex flex-col items-center justify-between min-h-[340px] max-h-[340px]"
                                style={{
                                  background: hoveredCard === idx 
                                    ? "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)"
                                    : "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%)"
                                }}
                              >
                                {/* Floating Elements */}
                                <motion.div
                                  className="absolute top-4 right-4 w-2 h-2 bg-primary-500 rounded-full"
                                  animate={{ 
                                    scale: [1, 1.5, 1],
                                    opacity: [0.4, 1, 0.4]
                                  }}
                                  transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    delay: idx * 0.2 
                                  }}
                                />
                                {/* Partner Avatar */}
                                <motion.div
                                  className="mb-8 relative"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  {partner.image_url || partner.image ? (
                                    <motion.div
                                      className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary-400/60 shadow-strong"
                                      whileHover={{ borderColor: "rgba(66, 149, 189, 0.9)" }}
                                    >
                                      <img
                                        src={partner.image_url || partner.image}
                                        alt={partner.name || partner}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                      <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                      />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      className="w-24 h-24 bg-gradient-to-br from-primary-500 via-emerald-700 to-primary-600 rounded-full flex items-center justify-center shadow-strong relative overflow-hidden"
                                      whileHover={{ boxShadow: "0 0 40px rgba(66, 149, 189, 0.6)" }}
                                    >
                                      <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                      />
                                      <span className="text-2xl font-bold text-white select-none relative z-10">
                                        {getInitials(partner.name || partner)}
                                      </span>
                                    </motion.div>
                                  )}
                                  {/* Avatar Glow Ring */}
                                  <motion.div
                                    className="absolute inset-0 rounded-full border border-primary-400/40"
                                    animate={{ 
                                      scale: [1, 1.2, 1], 
                                      opacity: [0.3, 0, 0.3] 
                                    }}
                                    transition={{ 
                                      duration: 3, 
                                      repeat: Infinity, 
                                      delay: idx * 0.3 
                                    }}
                                  />
                                </motion.div>
                                {/* Partner Name */}
                                <motion.div
                                  className="flex-1 flex items-center text-center"
                                  initial={{ opacity: 0.8 }}
                                  whileHover={{ opacity: 1 }}
                                >
                                  <h3 className="text-slate-900 font-bold text-lg leading-tight break-words">
                                    {partner.name || partner}
                                  </h3>
                                </motion.div>
                                {/* Enhanced Badge */}
                                <motion.div
                                  className="mt-6 relative group/badge"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-emerald-700 to-primary-500 rounded-full blur opacity-30"
                                    animate={{ 
                                      opacity: hoveredCard === idx ? 0.6 : 0.3 
                                    }}
                                  />
                                  <span className="relative inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/60 backdrop-blur-sm text-slate-900 text-xs sm:text-sm font-semibold rounded-full border border-primary-300/40 transition-all duration-300 whitespace-nowrap">
                                    ✨ Strategic Partner
                                  </span>
                                </motion.div>
                                {/* Hover Overlay */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-br from-emerald-700/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100"
                                  transition={{ duration: 0.3 }}
                                />
                              </motion.div>
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Bottom Section */}
            <motion.div 
              className="text-center mt-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 1 }}
            >
              <motion.div
                className="flex justify-center items-center space-x-4 mb-8"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* <motion.div
                  className="w-3 h-3 bg-blue-400/60 rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="w-3 h-3 bg-purple-400/60 rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.div
                  className="w-3 h-3 bg-teal-400/60 rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />*/}
              </motion.div> 
              
              <motion.div
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                
              </motion.div>
              
              {/* Animated Connection Lines */}
              {/* <motion.div
                className="mt-12 flex justify-center items-center space-x-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3, duration: 1 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-px h-16 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
                    animate={{ 
                      scaleY: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div> */}
              
              {/* Footer Call to Action */}
              <motion.div
                className="mt-16 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.5, duration: 0.8 }}
              >
                <motion.div
                  className="group relative inline-block cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute -inset-6 bg-gradient-to-r from-gold/10 via-emerald/10 to-gold/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />
                  
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Custom Styles */}
        <style>{`
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          
          .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
          }
        `}</style>
      </div>
    </div>
  );
}