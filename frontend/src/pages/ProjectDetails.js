import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SafeRichText from "../components/SafeRichText";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectImgSrc, setProjectImgSrc] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Function to get initials from a name (used for initials circle)
  const getInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
    axios.get(`${API_BASE_URL}/api/projects/${id}`)
      .then(res => {
        setProject(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch project details.");
        setLoading(false);
      });
  }, [id]);

  // Create image src from image_data (longblob/Buffer/byte array) or fallback to image_url
  useEffect(() => {
    let createdUrl = null;
    async function resolveImage() {
      if (!project) return setProjectImgSrc(null);

      // 1) Prefer image_data if present
      if (project.image_data) {
        const imgData = project.image_data;

        // If data is already a data URL string
        if (typeof imgData === 'string') {
          if (imgData.startsWith('data:')) {
            setProjectImgSrc(imgData);
            return;
          }

          // assume raw base64 string -> wrap with mimetype if available
          const mime = project.image_mimetype || 'image/jpeg';
          setProjectImgSrc(`data:${mime};base64,${imgData}`);
          return;
        }

        // If it's an object like { type: 'Buffer', data: [...] }
        if (imgData && typeof imgData === 'object' && Array.isArray(imgData.data)) {
          try {
            const arr = new Uint8Array(imgData.data);
            const blob = new Blob([arr], { type: project.image_mimetype || 'image/jpeg' });
            createdUrl = URL.createObjectURL(blob);
            setProjectImgSrc(createdUrl);
            return;
          } catch (err) {
            console.debug('Failed to construct blob from image_data buffer', err);
          }
        }

        // If it's already an array of bytes
        if (Array.isArray(imgData)) {
          try {
            const arr = new Uint8Array(imgData);
            const blob = new Blob([arr], { type: project.image_mimetype || 'image/jpeg' });
            createdUrl = URL.createObjectURL(blob);
            setProjectImgSrc(createdUrl);
            return;
          } catch (err) {
            console.debug('Failed to construct blob from image_data array', err);
          }
        }
      }

      // 2) Fallback to image_url (may be a remote URL or an API path)
      if (project.image_url) {
        // If already blob or data URL
        if (project.image_url.startsWith('blob:') || project.image_url.startsWith('data:')) {
          setProjectImgSrc(project.image_url);
          return;
        }

        if (/^https?:\/\//i.test(project.image_url)) {
          setProjectImgSrc(project.image_url);
          return;
        }

        // If API endpoint path (starts with /api/) fetch binary and create object URL
        if (project.image_url.startsWith('/api/') || project.image_url.startsWith(API_BASE_URL + '/api/')) {
          try {
            const url = project.image_url.startsWith('/api/') ? (API_BASE_URL + project.image_url) : project.image_url;
            const r = await fetch(url);
            if (!r.ok) {
              setProjectImgSrc(null);
              return;
            }
            const blob = await r.blob();
            createdUrl = URL.createObjectURL(blob);
            setProjectImgSrc(createdUrl);
            return;
          } catch (err) {
            console.debug('Failed to fetch image_url for project', err);
            setProjectImgSrc(null);
            return;
          }
        }

        // If path like /images/..., prefix API_BASE_URL
        if (project.image_url.startsWith('/images/')) {
          setProjectImgSrc(`${API_BASE_URL}${project.image_url}`);
          return;
        }

        // Default: prefix API base if not already absolute
        setProjectImgSrc(`${API_BASE_URL}/${project.image_url}`);
        return;
      }

      // No image available
      setProjectImgSrc(null);
    }

    resolveImage();

    return () => {
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [project, API_BASE_URL]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  const detailVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" }
    })
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-slate-50">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent"></div>
        </div>

        {/* Floating Orbs */}
        <motion.div
          className="fixed inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-br from-primary-400/15 to-emerald-700/10 rounded-full blur-3xl"
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
            className="absolute w-80 h-80 bg-gradient-to-br from-emerald-700/15 to-primary-400/8 rounded-full blur-3xl"
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
            <motion.div className="relative w-24 h-24 mx-auto mb-8">
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
            </motion.div>
            
            <motion.h3
              className="text-slate-900 text-3xl font-bold mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Loading Project Details
            </motion.h3>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-slate-50">
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl">⚠️</span>
            </motion.div>
            
            <h3 className="text-red-700 text-3xl mb-6 font-bold">{error}</h3>
            
            <motion.button 
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-gradient-to-r from-emerald-700 to-primary-500 text-white rounded-2xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-slate-50"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-slate-300/20 to-slate-400/20 rounded-full flex items-center justify-center mx-auto mb-8"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="text-5xl">❓</span>
            </motion.div>
            
            <h3 className="text-slate-900 text-3xl mb-4 font-semibold">Project Not Found</h3>
            <p className="text-slate-700 text-xl mb-8">The requested project could not be located.</p>
            
            <motion.button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-gradient-to-r from-emerald-700 to-primary-500 text-white rounded-xl font-semibold"
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
      className="w-full max-w-8xl rounded-2xl shadow-strong p-2 sm:p-4 md:p-8 text-base sm:text-lg overflow-x-auto"
      style={{
        background: 'rgba(243, 249, 255, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 10px 40px rgba(15, 23, 42, 0.15)',
      }}
    >
      <div className="min-h-screen relative overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="fixed inset-0 bg-slate-50">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden">
          {/* Floating Orbs with Mouse Interaction */}
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-br from-primary-400/15 to-emerald-700/10 rounded-full blur-3xl"
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
            className="absolute w-80 h-80 bg-gradient-to-br from-emerald-700/15 to-primary-400/8 rounded-full blur-3xl"
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

          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
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
              className="group flex items-center gap-2 sm:gap-3 text-slate-700 hover:text-slate-900 font-semibold mb-6 sm:mb-12 transition-all duration-300 p-2 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-slate-200/30 backdrop-blur-sm border border-primary-300/40"
              onClick={() => navigate(-1)}
              variants={itemVariants}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="p-2 bg-gradient-to-r from-emerald-700 to-primary-500 rounded-full"
                whileHover={{ rotate: -180 }}
                transition={{ duration: 0.3 }}
              >
                <FaArrowLeft className="text-sm text-white" />
              </motion.div>
              <span className="text-base sm:text-lg">Back to Projects</span>
            </motion.button>

            {/* Main Content Card */}
            <motion.div
              variants={itemVariants}
              className="relative bg-white/40 backdrop-blur-xl rounded-xl sm:rounded-3xl border border-primary-300/40 shadow-strong overflow-hidden"
            >
              
              {/* Animated Glow Effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary-400/10 via-emerald-700/10 to-primary-400/10 rounded-3xl blur-xl opacity-60"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(66, 149, 189, 0.3)",
                    "0 0 60px rgba(5, 150, 105, 0.4)",
                    "0 0 20px rgba(66, 149, 189, 0.3)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Hero Section */}
              <div className="relative bg-gradient-to-br from-emerald-700/95 via-primary-500/90 to-emerald-700/95 text-white px-4 sm:px-8 py-10 sm:py-16 text-center overflow-hidden">
                
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                  <motion.div
                    className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-10 right-10 w-24 h-24 bg-white/20 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  />
                </div>

                <div className="relative z-10">
                  {/* Project Icon Badge */}
                  <motion.div
                    className="mb-6 sm:mb-8 flex justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                  >
                    <motion.div
                      className="relative w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-primary-500 via-emerald-700 to-primary-600 rounded-full border-4 border-white/40 shadow-strong flex items-center justify-center overflow-hidden"
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 0 60px rgba(66, 149, 189, 0.6)"
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="text-4xl sm:text-6xl font-bold text-white select-none relative z-10">{getInitials(project.name)}</span>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white/40"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Project Name */}
                  <motion.h1
                    className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 drop-shadow-2xl text-white"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    {project.name}
                  </motion.h1>

                  {/* Project Badge */}
                  <motion.div
                    className="inline-block"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative px-6 sm:px-10 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/40">
                      <span className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                        ✨ Strategic Initiative
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Content Section */}
              <div className="px-2 sm:px-8 py-6 sm:py-12">
                
                {/* Project Details Grid */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  {/* Region */}
                  {project.region && (
                    <motion.div
                      className="relative group bg-white/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-primary-300/40 p-4 sm:p-6"
                      custom={0}
                      initial="hidden"
                      animate="visible"
                      variants={detailVariants}
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-primary-400/15 to-emerald-700/15 rounded-2xl blur opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-700 to-primary-500 rounded-lg shadow-medium flex items-center justify-center mr-3">
                            <span className="text-lg font-bold text-white">🌍</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">Region</h3>
                        </div>
                        <p className="text-slate-800 text-base md:text-lg font-semibold">{project.region}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Budget */}
                  {project.budget && (
                    <motion.div
                      className="relative group bg-white/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-primary-300/40 p-4 sm:p-6"
                      custom={1}
                      initial="hidden"
                      animate="visible"
                      variants={detailVariants}
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-primary-400/15 to-emerald-700/15 rounded-2xl blur opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-700 rounded-lg shadow-medium flex items-center justify-center mr-3">
                            <span className="text-lg font-bold text-white">💰</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">Budget</h3>
                        </div>
                        <p className="text-primary-600 text-base md:text-lg font-semibold">{project.budget}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Start Date */}
                  {project.start_date && (
                    <motion.div
                      className="relative group bg-white/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-primary-300/40 p-4 sm:p-6"
                      custom={2}
                      initial="hidden"
                      animate="visible"
                      variants={detailVariants}
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-primary-400/15 to-emerald-700/15 rounded-2xl blur opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-emerald-700 rounded-lg shadow-medium flex items-center justify-center mr-3">
                            <span className="text-lg font-bold text-white">🚀</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">Start Year</h3>
                        </div>
                        <p className="text-slate-800 text-base md:text-lg font-semibold">{new Date(project.start_date).getFullYear()}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* End Date */}
                  {project.end_date && (
                    <motion.div
                      className="relative group bg-white/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-primary-300/40 p-4 sm:p-6"
                      custom={3}
                      initial="hidden"
                      animate="visible"
                      variants={detailVariants}
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-primary-400/15 to-emerald-700/15 rounded-2xl blur opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-700 to-slate-700 rounded-lg shadow-medium flex items-center justify-center mr-3">
                            <span className="text-lg font-bold text-white">🏁</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">End Year</h3>
                        </div>
                        <p className="text-slate-800 text-base md:text-lg font-semibold">{new Date(project.end_date).getFullYear()}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Project Image */}
                {projectImgSrc && (
                  <motion.div 
                    className="mb-6 sm:mb-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                  >
                    <div className="relative bg-white/40 backdrop-blur-xl rounded-xl sm:rounded-3xl border border-primary-300/40 p-2 sm:p-4 overflow-hidden group">
                      <motion.div
                        className="absolute -inset-2 bg-gradient-to-r from-primary-400/15 via-emerald-700/15 to-primary-400/15 rounded-3xl blur-xl opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.5 }}
                      />
                      <motion.img
                        src={projectImgSrc}
                        alt={project.name}
                        className="relative w-full max-w-4xl mx-auto rounded-xl sm:rounded-2xl shadow-medium"
                        style={{maxHeight: '400px', objectFit: 'cover'}}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          // fallback: if project.image_url exists and wasn't used yet, try it
                          if (project.image_url && !project.image_url.startsWith('blob:') && !project.image_url.startsWith('data:')) {
                            e.currentTarget.src = project.image_url.startsWith('/images/') ? `${API_BASE_URL}${project.image_url}` : `${API_BASE_URL}/${project.image_url}`;
                          } else {
                            e.currentTarget.style.display = 'none';
                          }
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Project Description */}
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-primary-400/15 via-emerald-700/15 to-primary-400/15 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />
                  
                  <div className="relative bg-white/40 backdrop-blur-xl border border-primary-300/40 rounded-xl sm:rounded-3xl p-4 sm:p-10 shadow-medium">
                    <motion.h2 
                      className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 text-center"
                      animate={{ 
                        backgroundImage: [
                          "linear-gradient(45deg, #0370a8, #0370a8, #0370a8)",
                          "linear-gradient(45deg, #0370a8, #0370a8, #0370a8)",
                          "linear-gradient(45deg, #0370a8, #0370a8, #0370a8)"
                        ],
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      style={{ 
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent"
                      }}
                    >
                      Project Overview
                    </motion.h2>
                    
                    <div className="text-slate-900 leading-relaxed text-base sm:text-lg lg:text-xl whitespace-pre-line text-justify">
                      <SafeRichText content={project.description || ""} />
                    </div>
                    
                    {/* Decorative Quote Marks */}
                    <motion.div
                      className="absolute top-6 left-6 text-5xl text-primary-500/20 font-serif"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.5, duration: 0.6 }}
                    >
                      "
                    </motion.div>
                    <motion.div
                      className="absolute bottom-6 right-6 text-5xl text-emerald-700/20 font-serif rotate-180"
                      initial={{ scale: 0, rotate: 135 }}
                      animate={{ scale: 1, rotate: 180 }}
                      transition={{ delay: 1.7, duration: 0.6 }}
                    >
                      "
                    </motion.div>
                  </div>
                </motion.div>

               
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProjectDetails;