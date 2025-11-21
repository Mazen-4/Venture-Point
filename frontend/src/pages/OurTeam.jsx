import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import SafeRichText from '../components/SafeRichText';

export default function OurTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgErrors, setImgErrors] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';

  useEffect(() => {
    let active = true;
    const createdObjectUrls = [];
    async function loadTeam() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/team`);
        if (!active) return;
        const data = res.data || [];

        await Promise.all(data.map(async (m) => {
          if (m && m.photo_url && (m.photo_url.startsWith('/api/') || m.photo_url.startsWith(API_BASE_URL + '/api/'))) {
            try {
              const url = m.photo_url.startsWith('/api/') ? (API_BASE_URL + m.photo_url) : m.photo_url;
              const r = await fetch(url);
              if (!r.ok) return;
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
        setError('Failed to fetch team members.');
        setLoading(false);
      }
    }
    loadTeam();
    return () => {
      active = false;
      createdObjectUrls.forEach(u => URL.revokeObjectURL(u));
    };
  }, [API_BASE_URL]);

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.8, rotateX: -15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { delay: i * 0.12, type: 'spring', stiffness: 120, damping: 15, duration: 0.6 }
    }),
    hover: { y: -20, scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 25 } }
  };

  return (
    <div className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-sm sm:text-base overflow-x-auto" style={{ background: 'rgba(245, 247, 255, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Gradient background (same as OurStory) */}
        <div className="fixed inset-0 bg-slate-50" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-black">Our Team</h1>
              <p className="text-lg text-black max-w-2xl mx-auto">Meet the people behind VenturePoint — the experts and practitioners who drive our work.</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#73ab40]"></div>
                </div>
              )}

              {error && (
                <div className="text-center py-16">
                  <div className="bg-red-50 text-red-700 p-6 rounded-lg inline-block">{error}</div>
                </div>
              )}

              {/* First team member centered on its own row */}
              {team.length > 0 && (
                <div className="mb-8 flex justify-center">
                  {(() => {
                    const member = team[0];
                    const idx = 0;
                    let imgUrl = member._photoSrc || "/images/default-profile.png";
                    if (!member._photoSrc && member.photo_url) {
                      if (/^https?:\/\//i.test(member.photo_url)) imgUrl = member.photo_url;
                      else if (member.photo_url.startsWith('/images/')) imgUrl = `${API_BASE_URL}${member.photo_url}`;
                      else if (/^[\w\-.]+\.(jpg|jpeg|png|gif|webp)$/i.test(member.photo_url)) imgUrl = `${API_BASE_URL}/images/${member.photo_url}`;
                    }
                    return (
                      <Link key={member.id || 'first-member'} to={`/team/${member.id}`} className="block w-full sm:w-3/4 md:w-2/3 lg:w-1/2 group">
                        <motion.div className="relative" custom={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cardVariants} whileHover="hover" onHoverStart={() => setHoveredCard(idx)} onHoverEnd={() => setHoveredCard(null)}>
                          <div className="relative h-[420px] p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-emerald/20 hover:border-emerald/40 shadow-lg cursor-pointer overflow-hidden flex flex-col items-center text-center justify-between">
                            <div className="mb-6 relative">
                              <div className="relative">
                                <img src={imgUrl} alt={member.name} className="w-32 h-32 object-cover rounded-full shadow-2xl border-3 border-emerald/40" />
                              </div>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold mb-2 text-black">{member.name}</h3>
                            <div className="text-emerald-400 font-semibold text-sm mb-4">{member.role}</div>

                            <div className="text-black text-sm leading-relaxed flex-grow overflow-hidden max-h-[5rem]">
                              <SafeRichText content={member.bio ? member.bio.split(' ').slice(0, 12).join(' ') + (member.bio.split(' ').length > 12 ? '...' : '') : ''} />
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })()}
                </div>
              )}

              {/* Remaining members in grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.slice(1).map((member, idx) => {
                  const realIdx = idx + 1;
                  let imgUrl = member._photoSrc || "/images/default-profile.png";
                  if (!member._photoSrc && member.photo_url) {
                    if (/^https?:\/\//i.test(member.photo_url)) imgUrl = member.photo_url;
                    else if (member.photo_url.startsWith('/images/')) imgUrl = `${API_BASE_URL}${member.photo_url}`;
                    else if (/^[\w\-.]+\.(jpg|jpeg|png|gif|webp)$/i.test(member.photo_url)) imgUrl = `${API_BASE_URL}/images/${member.photo_url}`;
                  }
                  return (
                    <Link key={member.id || realIdx} to={`/team/${member.id}`} className="block h-full group">
                      <motion.div className="relative h-full" custom={realIdx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cardVariants} whileHover="hover" onHoverStart={() => setHoveredCard(realIdx)} onHoverEnd={() => setHoveredCard(null)}>
                        <div className="relative h-[420px] p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-emerald/20 hover:border-emerald/40 shadow-lg cursor-pointer overflow-hidden flex flex-col items-center text-center justify-between">
                          <div className="mb-6 relative">
                            <div className="relative">
                              <img src={imgUrl} alt={member.name} className="w-32 h-32 object-cover rounded-full shadow-2xl border-3 border-emerald/40" />
                            </div>
                          </div>

                          <h3 className="text-xl md:text-2xl font-bold mb-2 text-black">{member.name}</h3>
                          <div className="text-emerald-400 font-semibold text-sm mb-4">{member.role}</div>

                          <div className="text-black text-sm leading-relaxed flex-grow overflow-hidden max-h-[5rem]">
                            <SafeRichText content={member.bio ? member.bio.split(' ').slice(0, 12).join(' ') + (member.bio.split(' ').length > 12 ? '...' : '') : ''} />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {!loading && !error && team.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-white/5 rounded-2xl p-8 inline-block">No team members yet.</div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}