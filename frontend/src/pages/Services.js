import { useEffect, useState } from "react";
import SafeRichText from '../components/SafeRichText';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

// https://venturepoint-backend.onrender.com
// http://localhost:5000

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || "https://venturepoint-backend.onrender.com";
    axios.get(`${API_BASE_URL}/api/services`)
      .then(res => {
        setServices(Array.isArray(res.data) ? res.data : res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch services.");
        setLoading(false);
      });
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" }
    })
  };

  // Service icons mapping
  const getServiceIcon = (category, index) => {
    const icons = {
      'consulting': '💼',
      'development': '🚀',
      'strategy': '🎯',
      'analysis': '📊',
      'management': '⚙️',
      'research': '🔍',
      'planning': '📋',
      'implementation': '🛠️',
      'default': ['💡', '🌟', '⭐', '🎨', '🔧', '📈', '💎', '🚀'][index % 8]
    };
    
    const categoryKey = category ? category.toLowerCase() : 'default';
    return icons[categoryKey] || icons['default'];
  };

  return (
    <div className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-base sm:text-lg overflow-x-auto" style={{ background: 'rgba(245, 247, 255, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-slate-50" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,33,71,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,33,71,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        {/* Main Title */}
        <motion.h1 
          className="text-6xl font-poppins font-extrabold mb-12 text-center text-black tracking-wide" 
          style={{textShadow: '0 6px 32px rgba(0,33,71,0.3)'}}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Our <span className="text-primary-500">Services</span>
        </motion.h1>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/80 rounded-full shadow-lg border border-emerald/30">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald border-t-transparent mr-3"></div>
              <p className="text-xl font-medium text-navy">Loading services...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-red-50 rounded-full shadow-lg border border-red-200">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Service Categories Summary (if services exist) */}
        {!loading && !error && services.length > 0 && (
          <motion.div 
            className="mb-16 w-full max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-emerald/20 overflow-hidden px-8 pb-8 p-6 md:p-8 text-center mx-auto">
              <h3 className="text-3xl md:text-4xl font-poppins font-bold text-center text-navy mb-6">
                Why Choose Our <span className="text-emerald-400">Services?</span>
              </h3>
              {/* Key highlight - styled badge, no extra wrapper */}
              <div className="mb-6">
                <span className="inline-block bg-gradient-to-r from-emerald/15 to-primary/15 rounded-xl px-6 py-4 border border-primary/30">
                  <span className="text-3xl md:text-4xl font-bold text-emerald-400 mr-2 align-middle">{services.length}+</span>
                  <span className="text-base md:text-lg text-navy font-medium align-middle">Professional Services</span>
                </span>
              </div>
              <p className="text-black text-lg md:text-xl font-roboto leading-relaxed text-center max-w-3xl mx-auto">
                We provide comprehensive solutions tailored to your organization's unique needs. 
                Our experienced team combines <span className="font-semibold text-emerald-400">strategic thinking</span> with 
                <span className="font-semibold text-primary-500"> practical implementation</span> to deliver 
                <span className="font-semibold text-navy"> measurable results</span> that drive sustainable growth and development.
              </p>
            </div>
          </motion.div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              className="relative bg-white backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center text-center shadow-xl border-2 border-gray-100 hover:border-primary/40 transition-all duration-500 min-h-[360px] h-full group hover:shadow-2xl"
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{
                y: -20,
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(66,149,189,0.12)"
              }}
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-3xl rounded-tr-3xl"></div>
              {/* Service icon */}
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-emerald to-primary/70 rounded-2xl shadow-lg flex items-center justify-center mb-6"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-2xl text-emerald-500">
                  {getServiceIcon(service.category, idx)}
                </span>
              </motion.div>
              {/* Service Title */}
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-emerald-400 mb-3 drop-shadow-sm group-hover:text-primary-500 transition-colors duration-300">
                {service.title}
              </h2>
              {/* Service Category */}
              {service.category && (
                <div className="bg-primary/10 text-primary-500 px-3 py-1 rounded-full font-medium text-base mb-4 border border-primary/30 shadow-sm">
                  {service.category}
                </div>
              )}
              {/* Service Description */}
              <div className="text-black text-base md:text-lg font-roboto flex-grow text-center leading-relaxed">
                <SafeRichText content={service.description} />
              </div>
              {/* Learn more indicator */}
              <motion.div 
                className="mt-4 text-emerald-500 font-medium text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ y: 10 }}
                whileHover={{ y: 0 }}
              >
                Learn more →
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald to-primary/70 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-2xl font-poppins font-bold text-navy mb-2">No Services Yet</h3>
              <p className="text-navy/70">Services will be displayed here once they are added.</p>
            </div>
          </motion.div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;