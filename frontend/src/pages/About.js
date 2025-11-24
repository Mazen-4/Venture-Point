import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";

// SafeRichText component placeholder
const SafeRichText = ({ content }) => <div dangerouslySetInnerHTML={{ __html: content }} />;

function About() {
    // Inject style override for section titles
    React.useEffect(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        .about-section-title, .about-section-title * {
          color: #111 !important;
          text-shadow: none !important;
          -webkit-text-fill-color: #111 !important;
        }
      `;
      document.head.appendChild(style);
      return () => { document.head.removeChild(style); };
    }, []);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [imgErrors, setImgErrors] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let active = true;
    const createdObjectUrls = [];

    async function loadTeam() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/team`);
        if (!active) {
          return;
        }
        const data = res.data || [];

        await Promise.all(data.map(async (m) => {
          if (m && m.photo_url && (m.photo_url.startsWith('/api/') || m.photo_url.startsWith(API_BASE_URL + '/api/'))) {
            try {
              const url = m.photo_url.startsWith('/api/') ? (API_BASE_URL + m.photo_url) : m.photo_url;
              const r = await fetch(url);
              if (!r.ok) {
                return;
              }
              const blob = await r.blob();
              const obj = URL.createObjectURL(blob);
              m._photoSrc = obj;
              createdObjectUrls.push(obj);
            } catch (err) {
              console.debug('Failed to preload photo for', m.id, err);
            }
          }
        }));

        setTeam(data);
        setLoading(false);
      } catch (err) {
        if (!active) {
          return;
        }
        setError("Failed to fetch team members.");
        setLoading(false);
      }
    }

    loadTeam();

    axios.get(`${API_BASE_URL}/api/about`)
      .then(res => {
        setAboutData(res.data);
      })
      .catch((error) => {
        console.error("About API Error:", error);
        setAboutData(null);
      });

    return () => {
      active = false;
      createdObjectUrls.forEach(u => URL.revokeObjectURL(u));
    };
  }, [API_BASE_URL]);

  const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: -15
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        delay: i * 0.15,
        type: "spring",
        stiffness: 120,
        damping: 15,
        duration: 0.6
      }
    }),
    hover: {
      y: -20,
      scale: 1.05,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <div
      className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-sm sm:text-base overflow-x-auto"
      style={{
        background: 'rgba(245, 247, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(44, 62, 80, 0.10)',
      }}
    >
      <div className="min-h-screen relative overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="fixed inset-0 bg-slate-50">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald/30 via-transparent to-transparent"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-br from-gold/20 to-emerald/15 rounded-full blur-3xl"
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
            className="absolute w-80 h-80 bg-gradient-to-br from-emerald/20 to-gold/10 rounded-full blur-3xl"
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
            className="absolute w-72 h-72 bg-gradient-to-br from-gold/15 to-emerald/15 rounded-full blur-3xl"
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
          <div className="absolute inset-0 opacity-[0.015]">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(44,62,80,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(44,62,80,0.08) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Particle System */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold/40 rounded-full"
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
            
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-12 lg:mb-20"
              initial="hidden"
              animate="visible"
              variants={heroVariants}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black mb-6 tracking-tight leading-tight">
                  About{" "}
                  <motion.span 
                    className="inline-block bg-gradient-to-r from-gold via-emerald to-gold bg-clip-text text-transparent"
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
                    Us
                  </motion.span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-lg sm:text-xl lg:text-2xl text-black max-w-4xl mx-auto leading-relaxed font-light px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                Discover our journey, meet our extraordinary team, and explore what makes us unique
              </motion.p>
              
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

            {/* Who We Are Section */}
            {aboutData?.who_we_are && (
              <motion.div 
                className="mb-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
              >
                <motion.h2
                  className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black"
                >
                  Who We Are
                </motion.h2>

                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-gold/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                  {aboutData.who_we_are}
                </div>
              </motion.div>
            )}

            {/* Team Section */}
            <motion.div
              className="mb-24"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-12 text-center tracking-tight text-black"
              >
                Meet Our <span className="text-black">Team</span>
              </motion.h2>

              {/* Loading State */}
              {loading && (
                <motion.div 
                  className="flex items-center justify-center py-32"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center">
                    <motion.div className="relative w-20 h-20 mx-auto mb-8">
                      <motion.div
                        className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute inset-2 border-4 border-emerald border-b-transparent rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                    <h3 className="text-black text-2xl font-bold mb-4">Loading team members...</h3>
                  </div>
                </motion.div>
              )}

              {/* Error State */}
              {error && (
                <motion.div 
                  className="text-center py-32"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-red-500/30">
                    <p className="text-red-400 font-medium text-xl">{error}</p>
                    <motion.button 
                      onClick={() => window.location.reload()} 
                      className="mt-6 px-8 py-3 bg-gradient-to-r from-emerald to-gold text-white rounded-2xl font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Try Again
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Team Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {team.map((member, idx) => (
                  <Link
                    key={idx}
                    to={`/team/${member.id}`}
                    className="block h-full group"
                  >
                    <motion.div
                      className="relative h-full"
                      custom={idx}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={cardVariants}
                      whileHover="hover"
                      onHoverStart={() => setHoveredCard(idx)}
                      onHoverEnd={() => setHoveredCard(null)}
                    >
                      <motion.div
                        className="absolute -inset-2 bg-gradient-to-br from-gold/15 via-emerald/15 to-gold/15 rounded-3xl blur-lg opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                      
                      <motion.div
                        className="relative h-[460px] p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-gold/30 hover:border-gold/50 shadow-xl cursor-pointer overflow-hidden flex flex-col items-center text-center justify-between"
                        style={{
                          background: hoveredCard === idx 
                            ? "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)"
                            : "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%)"
                        }}
                      >
                        <motion.div
                          className="absolute top-4 right-4 w-2 h-2 bg-gold rounded-full"
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

                        {/* Profile Image */}
                        <motion.div
                          className="mb-6 relative"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {(() => {
                            // Prefer preloaded object URL when available
                            let imgUrl = member._photoSrc || "/images/default-profile.png";
                            if (!member._photoSrc && member.photo_url) {
                              if (/^https?:\/\//i.test(member.photo_url)) {
                                imgUrl = member.photo_url;
                              } else if (member.photo_url.startsWith("/images/")) {
                                imgUrl = `${API_BASE_URL}${member.photo_url}`;
                              } else if (/^[\w\-.]+\.(jpg|jpeg|png|gif|webp)$/i.test(member.photo_url)) {
                                imgUrl = `${API_BASE_URL}/images/${member.photo_url}`;
                              }
                            }

                            if (!imgErrors[idx]) {
                              return (
                                <motion.div
                                  className="relative"
                                >
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-gold to-emerald rounded-full blur-md"
                                    animate={{
                                      scale: [1, 1.1, 1],
                                      opacity: [0.5, 0.8, 0.5],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  />
                                  <img
                                    src={imgUrl}
                                    alt={member.name}
                                    className="relative w-32 h-32 object-cover rounded-full shadow-2xl border-3 border-gold/50"
                                    onError={() => {
                                      setImgErrors(errors => {
                                        const newErrors = [...errors];
                                        newErrors[idx] = true;
                                        return newErrors;
                                      });
                                    }}
                                  />
                                </motion.div>
                              );
                            } else {
                              return (
                                <motion.div
                                  className="relative"
                                >
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-gold to-emerald rounded-full blur-md"
                                    animate={{
                                      scale: [1, 1.1, 1],
                                      opacity: [0.5, 0.8, 0.5],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  />
                                  <div className="relative w-32 h-32 flex items-center justify-center rounded-full shadow-2xl border-3 border-gold/50 bg-gradient-to-br from-emerald/30 to-gold/30 text-3xl font-bold text-black">
                                    {member.name && member.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                                  </div>
                                </motion.div>
                              );
                            }
                          })()}

                        </motion.div>

                        <h3 
                          className="text-xl md:text-2xl font-bold mb-3 text-black"
                        >
                          {member.name}
                        </h3>

                        <motion.div 
                          className="bg-gradient-to-r from-emerald/20 to-gold/20 backdrop-blur-sm text-gold px-4 py-2 rounded-full font-semibold text-sm mb-6 border border-gold/30"
                          whileHover={{ scale: 1.05 }}
                        >
                          {member.role}
                        </motion.div>

                        <div className="text-black text-sm leading-relaxed flex-grow overflow-hidden max-h-[6.25rem]">
                          <SafeRichText content={member.bio ? member.bio.split(' ').slice(0, 20).join(' ') + (member.bio.split(' ').length > 20 ? '...' : '') : ''} />
                        </div>

                        <motion.div 
                          className="mt-6 text-gold font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center"
                          initial={{ y: 10 }}
                          whileHover={{ y: 0, x: 5 }}
                        >
                          <span className="mr-2">View Profile</span>
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Empty Team State */}
              {!loading && !error && team.length === 0 && (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-gold/30">
                    <div className="text-5xl mb-6">👥</div>
                    <h3 className="text-2xl font-bold text-gold mb-3">No Team Members Yet</h3>
                    <p className="text-black">Team members will be displayed here once they are added.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Hardcoded About Sections in specified order */}
            {aboutData && (
              <div className="w-full max-w-6xl mx-auto">
                {/* Our Story */}
                {aboutData.our_story && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">Our Story</motion.h2>
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-gold/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                      {aboutData.our_story}
                    </div>
                  </motion.div>
                )}
                {/* Our Mission */}
                {aboutData.our_mission && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">Our Mission</motion.h2>
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-gold/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                      {aboutData.our_mission}
                    </div>
                  </motion.div>
                )}
                {/* Our Mandate */}
                {aboutData.our_mandate && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">Our Mandate</motion.h2>
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-gold/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                      {aboutData.our_mandate}
                    </div>
                  </motion.div>
                )}
                {/* Why Us */}
                {aboutData.why_us && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">Why Us</motion.h2>
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-gold/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                      {aboutData.why_us}
                    </div>
                  </motion.div>
                )}
                {/* Our Approach */}
                {aboutData.our_approach && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">Our Approach</motion.h2>
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-gold/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                      {aboutData.our_approach}
                    </div>
                  </motion.div>
                )}
                {/* What We Offer */}
                {aboutData.what_we_offer && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">What We Offer</motion.h2>
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-gold/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                      {aboutData.what_we_offer}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* No About Data State */}
            {!aboutData && !loading && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-gold/30">
                  <div className="text-5xl mb-6">📋</div>
                  <h3 className="text-2xl font-bold text-gold mb-3">No About Data Available</h3>
                  <p className="text-black">Company information will be displayed here once it's added.</p>
                </div>
              </motion.div>
            )}

            {/* Bottom Section */}
            <motion.div 
              className="text-center mt-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 1 }}
            >
              <motion.div
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="relative text-gray-300 text-xl font-light tracking-wide">
                  <motion.span
                    className="inline-block"
                    animate={{ 
                      backgroundImage: [
                        "linear-gradient(45deg, #C9A635, #2E7D32, #C9A635)",
                        "linear-gradient(45deg, #2E7D32, #C9A635, #2E7D32)",
                        "linear-gradient(45deg, #C9A635, #2E7D32, #C9A635)"
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ 
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent"
                    }}
                  >
                    Together, we're building a brighter future
                  </motion.span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;