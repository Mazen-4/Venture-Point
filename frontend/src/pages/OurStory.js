import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import axios from "axios";
// Note: Team cards moved to OurTeam page

const SafeRichText = ({ content }) => <div dangerouslySetInnerHTML={{ __html: content }} />;

function OurStory() {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let active = true;
    axios.get(`${API_BASE_URL}/api/about`)
      .then(res => { if (active) setAboutData(res.data); })
      .catch(err => { console.error('About API Error:', err); setAboutData(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [API_BASE_URL]);

  const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <div className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-sm sm:text-base overflow-x-auto" style={{ background: 'rgba(245, 247, 255, 0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-slate-50" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-12 lg:mb-20" initial="hidden" animate="visible" variants={heroVariants}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black mb-6 tracking-tight leading-tight">
                Our Story
              </h1>
              <motion.p className="text-lg sm:text-xl lg:text-2xl text-black max-w-4xl mx-auto leading-relaxed font-light px-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
                Discover our journey — who we are, what we believe, and how we deliver impact.
              </motion.p>
            </motion.div>

            {/* Who We Are Section */}
            {aboutData?.who_we_are && (
              <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                <div className="relative z-10">
                  <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">
                    Who We Are
                  </motion.h2>
                  <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl shadow-inner border border-emerald/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                    {aboutData.who_we_are}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Hardcoded sections (match Who We Are styling, avoid double frames) */}
            {aboutData && (
              <div className="w-full max-w-6xl mx-auto">
                {/* Our Story */}
                {aboutData.our_story && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">Our Story</motion.h2>
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                      {aboutData.our_story}
                    </div>
                  </motion.div>
                )}

                {/* Our Mission */}
                {aboutData.our_mission && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">Our Mission</motion.h2>
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                      {aboutData.our_mission}
                    </div>
                  </motion.div>
                )}

                {/* Our Mandate */}
                {aboutData.our_mandate && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">Our Mandate</motion.h2>
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                      {aboutData.our_mandate}
                    </div>
                  </motion.div>
                )}

                {/* Why Us */}
                {aboutData.why_us && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">Why Us</motion.h2>
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                      {aboutData.why_us}
                    </div>
                  </motion.div>
                )}

                {/* Our Approach */}
                {aboutData.our_approach && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">Our Approach</motion.h2>
                    {typeof aboutData.our_approach === 'string' && aboutData.our_approach.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <motion.img
                        src={`${API_BASE_URL}${aboutData.our_approach}`}
                        alt="Our Approach"
                        className="w-full max-w-3xl mx-auto mb-8 rounded-2xl shadow-lg border border-emerald/30 bg-white"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      />
                    ) : (
                      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                        {aboutData.our_approach}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* What We Offer */}
                {aboutData.what_we_offer && (
                  <motion.div className="mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
                    <motion.h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight text-black">What We Offer</motion.h2>
                    {typeof aboutData.what_we_offer === 'string' && aboutData.what_we_offer.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <motion.img
                        src={`${API_BASE_URL}${aboutData.what_we_offer}`}
                        alt="What We Offer"
                        className="w-full max-w-3xl mx-auto mb-8 rounded-2xl shadow-lg border border-emerald/30 bg-white"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      />
                    ) : (
                      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-emerald/20 p-6 md:p-8 text-base md:text-lg text-black leading-relaxed whitespace-pre-line" style={{textAlign: 'justify'}}>
                        {aboutData.what_we_offer}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {!aboutData && !loading && (
              <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-emerald/30">
                  <div className="text-5xl mb-6">📋</div>
                  <h3 className="text-2xl font-bold text-black mb-3">No About Data Available</h3>
                  <p className="text-black">Company information will be displayed here once it's added.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurStory;
