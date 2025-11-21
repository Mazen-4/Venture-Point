import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import SafeRichText from "../../components/SafeRichText";

export default function TeamMemberPage() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://venturepoint-backend.onrender.com";
  const [imgError, setImgError] = useState(false);
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    let createdUrl = null;
    async function load() {
      if (!id) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/team/${id}`);
        if (!active) return;
        const m = res.data;
        if (m && m.photo_url && m.photo_url.startsWith('/api/')) {
          try {
            const r = await fetch(`${API_BASE_URL}${m.photo_url}`);
            if (!r.ok) {
              setMember(m);
              setLoading(false);
              return;
            }
            const blob = await r.blob();
            createdUrl = URL.createObjectURL(blob);
            setMember({ ...m, photo_url: createdUrl });
            setLoading(false);
          } catch (err) {
            setMember(m);
            setLoading(false);
          }
        } else {
          setMember(m);
          setLoading(false);
        }
      } catch (err) {
        if (!active) return;
        setError("Failed to fetch member details");
        setLoading(false);
      }
    }
    load();

    return () => {
      active = false;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [id]);
  
  // Reusable loading/error wrapper
  const Wrapper = ({ children }) => (
      <div className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-sm sm:text-base overflow-x-auto" style={{ background: 'rgba(245, 247, 255, 0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="min-h-screen relative overflow-hidden">
          <div className="fixed inset-0 bg-slate-50" />

          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="max-w-7xl mx-auto container">{children}</div>
          </div>
        </div>
      </div>
  );

  if (loading) {
    return (
      <Wrapper>
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center px-4 sm:px-6 py-3 bg-white/80 rounded-full shadow-lg border border-emerald/30">
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-transparent mr-2 sm:mr-3"></div>
              <p className="text-base sm:text-lg font-medium text-black">Loading team member...</p>
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center px-4 sm:px-6 py-3 bg-red-50 rounded-full shadow-lg border border-red-200 mb-4 sm:mb-6">
              <p className="text-red-600 font-medium text-sm sm:text-base">{error}</p>
            </div>
            <Link
              to="/team"
              className="inline-flex items-center px-4 sm:px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              ← Back to Team
            </Link>
        </motion.div>
      </Wrapper>
    );
  }

  if (!member) {
    return (
      <Wrapper>
        <motion.div
          className="text-center py-8 sm:py-12"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white/80 rounded-2xl shadow-lg border border-emerald/30 p-6 sm:p-8 max-w-md mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl sm:text-2xl">👤</span>
              </div>
              <h3 className="text-lg sm:text-xl font-poppins font-bold text-black mb-2">Team Member Not Found</h3>
              <p className="text-black mb-4 sm:mb-6 text-sm sm:text-base">The requested team member could not be found.</p>
              <Link
                to="/team"
                className="inline-flex items-center px-4 sm:px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                ← Back to Team
              </Link>
          </div>
        </motion.div>
      </Wrapper>
    );
  }

  // ✅ Main Page Layout
  return (
    <Wrapper>
      {/* Back Button - Top Left */}
      <motion.div
        className="mb-4 sm:mb-6 lg:mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/team"
          className="group inline-flex items-center px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm sm:text-base lg:text-lg"
        >
          <span className="mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform duration-300">←</span>
          Back to Team
        </Link>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins font-extrabold mb-6 sm:mb-8 lg:mb-12 text-center text-black tracking-wide px-2"
        style={{ textShadow: "0 6px 32px rgba(0,0,0,0.45)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Team Member <span className="text-primary-500">Profile</span>
      </motion.h1>

      {/* Profile Card */}
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative bg-white/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-white/30 overflow-hidden mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Profile Image + Info Container */}
            <div className="flex flex-col lg:flex-col items-center text-center">
              {/* Profile Image */}
              <div className="flex-shrink-0 mb-6 sm:mb-8 flex justify-center w-full">
                {(() => {
                  let imgUrl = "/images/default-profile.png";
                  if (member.photo_url) {
                    // Use blob: or data: URLs directly (created via URL.createObjectURL)
                    if (member.photo_url.startsWith('blob:') || member.photo_url.startsWith('data:')) {
                      imgUrl = member.photo_url;
                    } else if (/^https?:\/\//i.test(member.photo_url)) {
                      imgUrl = member.photo_url;
                    } else if (member.photo_url.startsWith('/api/')) {
                      // API endpoint that returns image binary
                      imgUrl = `${API_BASE_URL}${member.photo_url}`;
                    } else if (member.photo_url.startsWith("/images/")) {
                      imgUrl = `${API_BASE_URL}${member.photo_url}`;
                    } else if (/^[\w\-.]+\.(jpg|jpeg|png|gif|webp)$/i.test(member.photo_url)) {
                      imgUrl = `${API_BASE_URL}/images/${member.photo_url}`;
                    }
                  }

                  return !imgError ? (
                    <motion.img
                      src={imgUrl}
                      alt={member.name}
                      className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-cover rounded-full shadow-2xl border-4 border-emerald/30 transition-all duration-500"
                      onError={() => setImgError(true)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
                      whileHover={{ scale: 1.05 }}
                    />
                  ) : (
                    <motion.div
                      className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 flex items-center justify-center rounded-full shadow-2xl border-4 border-emerald/30 bg-gradient-to-br from-emerald/20 to-gold/20 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-navy"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {member.name && member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </motion.div>
                  );
                })()}
              </div>

              {/* Name, Role, and Bio */}
              <div className="flex-1 w-full">
                <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-poppins font-extrabold text-black mb-3 sm:mb-4 drop-shadow-lg px-2 break-words"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {member.name}
                </motion.h1>

                <motion.div
                  className="inline-block bg-white/5 text-primary-500 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-sm sm:text-base md:text-lg lg:text-xl border border-white/10 mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  {member.role}
                </motion.div>

                {/* Bio */}
                <motion.div
                  className="bg-white/10 rounded-xl sm:rounded-2xl shadow-lg border border-white/10 p-3 sm:p-4 md:p-6 lg:p-8"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-navy rounded-lg shadow-md flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-white">ℹ️</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-poppins font-bold text-black">About</h3>
                  </div>
                  <div className="text-sm sm:text-base md:text-lg lg:text-xl text-black font-roboto leading-relaxed text-justify break-words">
                    <SafeRichText content={member.bio} />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        {member.details && (
          <motion.div
            className="relative bg-white/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-white/30 overflow-hidden"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gold to-navy rounded-lg shadow-md flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <span className="text-sm sm:text-lg font-bold text-white">📋</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-poppins font-bold text-navy break-words">Experience & Details</h3>
              </div>

                <div className="bg-white/10 rounded-xl sm:rounded-2xl shadow-lg border border-white/10 p-3 sm:p-4 md:p-6 lg:p-8">
                  <div className="text-sm sm:text-base md:text-lg lg:text-xl text-black font-roboto leading-relaxed text-justify break-words">
                  <SafeRichText content={member.details} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Wrapper>
  );
}