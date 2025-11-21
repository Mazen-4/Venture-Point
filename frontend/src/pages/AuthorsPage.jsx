import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthorsPage() {
  const location = useLocation();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/authors`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAuthors(
          Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : []
        );
        setLoading(false);
      } catch (err) {
        if (err.message.includes('404')) {
          setError('Authors endpoint not found. Please check your backend configuration.');
        } else if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
          setError('Network error. Please check if your backend server is running.');
        } else {
          setError(`Failed to fetch authors: ${err.message}`);
        }
        setLoading(false);
      }
    };
    fetchAuthors();
  }, [API_BASE_URL, location]);

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const filteredAuthors = authors.filter(author =>
    (author.name || author).toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-sm sm:text-base overflow-x-auto"
      style={{
        background: 'rgba(245, 247, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(44, 62, 80, 0.10)',
      }}
    >
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent"></div>
        </div>
        <div className="fixed inset-0 overflow-hidden">
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-br from-blue-600/30 to-cyan-400/20 rounded-full blur-3xl"
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
            className="absolute w-80 h-80 bg-gradient-to-br from-indigo-400/25 to-emerald-300/15 rounded-full blur-3xl"
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
            className="absolute w-72 h-72 bg-gradient-to-br from-teal-500/20 to-blue-300/10 rounded-full blur-3xl"
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
          <div className="absolute inset-0 opacity-[0.015]">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(44,62,80,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(44,62,80,0.08) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/40 rounded-full"
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
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12 lg:mb-20"
              initial={{ opacity: 0, y: -100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.div
                className="relative inline-block mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 120 }}
              >
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-blue-700 via-indigo-500 to-teal-400 rounded-full flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 360,
                    boxShadow: "0 0 50px rgba(59, 130, 246, 0.5)"
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-4xl relative z-10">🧑‍💼</span>
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                  Our
                  <motion.span 
                    className="block bg-gradient-to-r from-blue-700 via-emerald-400 to-teal-400 bg-clip-text text-transparent mt-2"
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
                    Authors
                  </motion.span>
                </h1>
              </motion.div>
              <motion.p 
                className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                Meet the brilliant minds behind our content and research.
              </motion.p>
              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.6, duration: 1 }}
              >
                <motion.div
                  className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"
                  animate={{ width: ["0%", "200px", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
            <motion.div 
              className="max-w-lg mx-auto mb-16"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <div className="relative group">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-700 via-emerald-400 to-teal-400 rounded-3xl blur opacity-30"
                  animate={{ 
                    opacity: searchFocused ? 0.6 : 0.3,
                    scale: searchFocused ? 1.02 : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full px-8 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-500 text-lg"
                  />
                  <motion.div 
                    className="absolute right-6 top-1/2 transform -translate-y-1/2"
                    animate={{ 
                      rotate: searchTerm ? 180 : 0,
                      scale: searchFocused ? 1.2 : 1 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 lg:p-12 overflow-hidden">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-700/20 via-emerald-400/20 to-teal-400/20 rounded-3xl blur-xl"
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
                              className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                              className="absolute inset-2 border-4 border-purple-400 border-b-transparent rounded-full"
                              animate={{ rotate: -360 }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                              className="absolute inset-4 border-4 border-teal-400 border-l-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                          </motion.div>
                          <motion.h3
                            className="text-white text-2xl font-bold mb-4"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            Discovering Authors
                          </motion.h3>
                          <motion.p
                            className="text-gray-400 text-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                          >
                            Meet the creators behind our work...
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
                        <h3 className="text-red-400 text-2xl mb-6 font-bold">{error}</h3>
                        <motion.button 
                          onClick={() => window.location.reload()} 
                          className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold transition-all duration-300 overflow-hidden"
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "0%" }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="relative z-10">Try Again</span>
                        </motion.button>
                      </motion.div>
                    ) : filteredAuthors.length === 0 ? (
                      <motion.div 
                        key="empty"
                        className="text-center py-32"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.6 }}
                      >
                        <motion.div
                          className="w-32 h-32 bg-gradient-to-br from-gray-400/20 to-slate-400/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm relative overflow-hidden"
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
                          className="text-gray-300 text-2xl mb-4 font-semibold"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {searchTerm ? `No authors found for "${searchTerm}"` : "No authors available yet"}
                        </motion.h3>
                        <motion.p
                          className="text-gray-400 text-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {searchTerm ? "Try adjusting your search terms" : "We're constantly adding new authors"}
                        </motion.p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="authors"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        variants={containerVariants}
                      >
                        {filteredAuthors.map((author, idx) => (
                          <div 
                            key={author.id || idx} 
                            className="block h-full group"
                          >
                            <motion.div
                              className="group relative"
                              variants={cardVariants}
                              whileHover="hover"
                              onHoverStart={() => setHoveredCard(idx)}
                              onHoverEnd={() => setHoveredCard(null)}
                            >
                              <motion.div
                                className="absolute -inset-2 bg-gradient-to-br from-blue-700/20 via-emerald-400/20 to-teal-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100"
                                transition={{ duration: 0.3 }}
                              />
                              <motion.div
                                className="relative h-full p-8 bg-white/20 backdrop-blur-xl rounded-3xl border border-blue-100 shadow-xl cursor-pointer overflow-hidden flex flex-col items-center justify-between min-h-[220px] max-h-[220px]"
                                style={{
                                  background: hoveredCard === idx 
                                    ? "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)"
                                    : "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%)"
                                }}
                              >
                                <motion.div
                                  className="mb-8 relative"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <motion.div
                                    className="w-24 h-24 bg-gradient-to-br from-blue-700 via-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden"
                                    whileHover={{ 
                                      boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" 
                                    }}
                                  >
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span className="text-2xl font-bold text-white select-none relative z-10">
                                      {getInitials(author.name || author)}
                                    </span>
                                  </motion.div>
                                  <motion.div
                                    className="absolute inset-0 rounded-full border border-blue-300/30"
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
                                <motion.div
                                  className="flex-1 flex items-center text-center"
                                  initial={{ opacity: 0.8 }}
                                  whileHover={{ opacity: 1 }}
                                >
                                  <h3 className="text-white font-bold text-xl leading-tight break-words">
                                    {author.name || author}
                                  </h3>
                                </motion.div>
                                <motion.div
                                  className="mt-6 relative group/badge"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-blue-700 to-emerald-400 rounded-full blur opacity-30"
                                    animate={{ 
                                      opacity: hoveredCard === idx ? 0.6 : 0.3 
                                    }}
                                  />
                                  <span className="relative inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30 transition-all duration-300">
                                    ✨ Author
                                  </span>
                                </motion.div>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100"
                                  transition={{ duration: 0.3 }}
                                />
                              </motion.div>
                            </motion.div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
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
                <p className="relative text-gray-300 text-xl font-light tracking-wide">
                  <motion.span
                    className="inline-block"
                    animate={{ 
                      backgroundImage: [
                        "linear-gradient(45deg, #60a5fa, #a78bfa, #34d399)",
                        "linear-gradient(45deg, #a78bfa, #34d399, #60a5fa)",
                        "linear-gradient(45deg, #34d399, #60a5fa, #a78bfa)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ 
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent"
                    }}
                  >
                    Celebrating our creative minds
                  </motion.span>
                </p>
              </motion.div>
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
                    className="absolute -inset-6 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <style jsx>{`
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
