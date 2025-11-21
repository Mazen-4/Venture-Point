import { useEffect, useState } from "react";
import SafeRichText from '../components/SafeRichText';
import { motion } from "framer-motion";
import { FaProjectDiagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get((process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com') + '/api/projects')
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch projects.");
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

  return (
    <div className="w-full max-w-8xl rounded-2xl shadow-strong p-2 sm:p-4 md:p-8 text-base sm:text-lg overflow-x-auto" style={{ background: 'rgba(243, 249, 255, 0.9)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 10px 40px rgba(15, 23, 42, 0.15)' }}>
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-slate-50" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 opacity-[0.02] pointer-events-none">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(71, 85, 105, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(71, 85, 105, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        {/* Main Title */}
        <motion.h1 
          className="text-6xl font-poppins font-extrabold mb-12 text-center text-slate-900 tracking-wide" 
          style={{textShadow: '0 6px 32px rgba(15, 23, 42, 0.3)'}}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Our <span className="text-primary-500">Projects</span>
        </motion.h1>

        {/* Past Performance Section */}
        <motion.div 
          className="w-full max-w-6xl mx-auto mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-strong border border-primary-300/30 overflow-hidden px-8 pb-8 p-6 md:p-8 text-center mx-auto">

            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-center text-slate-900 mb-6 tracking-wide" 
                style={{textShadow: '0 4px 16px rgba(15, 23, 42, 0.2), 0 1px 4px rgba(66, 149, 189, 0.15)'}}>
              Past Performance 
                <span className="text-3xl md:text-4xl text-emerald-700 font-semibold mt-2">
                (Founders' Experience)
              </span>
            </h2>

            {/* Key highlight - now just styled spans, no extra wrapper */}
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-emerald-700/15 to-primary-500/15 rounded-xl px-6 py-4 border border-primary-400/30">
                <span className="text-3xl md:text-4xl font-bold text-emerald-700 mr-2 align-middle">30+ Years</span>
                <span className="text-base md:text-lg text-slate-700 font-medium align-middle">of proven experience</span>
              </span>
            </div>

            <p className="text-lg md:text-xl lg:text-2xl text-slate-900 font-roboto leading-relaxed">
              While <span className="font-bold text-emerald-700">VenturePoint for Economic Development</span> is a newly established organization, its founders have extensive experience in designing, managing, implementing, and monitoring <span className="font-bold text-slate-900">multi-million-dollar economic growth and reform projects</span> funded by:
            </p>

            {/* Partner badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <div className="bg-emerald-700/15 text-emerald-700 px-4 py-2 rounded-full font-semibold text-base border border-emerald-700/40 shadow-sm">
                USAID/Egypt
              </div>
              <div className="bg-slate-800/15 text-slate-800 px-4 py-2 rounded-full font-semibold text-base border border-slate-800/40 shadow-sm">
                World Bank
              </div>
              <div className="bg-primary-500/15 text-primary-600 px-4 py-2 rounded-full font-semibold text-base border border-primary-500/30 shadow-sm">
                International Donors
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading and Error States */}
        {loading && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/80 rounded-full shadow-medium border border-primary-300/40">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent mr-3"></div>
              <p className="text-xl font-medium text-slate-800">Loading projects...</p>
            </div>
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-red-50 rounded-full shadow-medium border border-red-200/60">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {projects.map((project, idx) => (
            <Link
              key={project.id || idx}
              to={`/projects/${project.id}`}
              className="w-full group"
            >
              <motion.div
                className="relative bg-white backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center text-center shadow-medium border-2 border-slate-200 hover:border-primary-400/60 transition-all duration-500 min-h-[280px] h-full cursor-pointer group-hover:shadow-strong"
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{
                  y: -20,
                  scale: 1.05,
                  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.15)"
                }}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary-500/15 to-transparent rounded-bl-3xl rounded-tr-3xl"></div>

                {/* Project icon placeholder */}
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-emerald-700 to-primary-500 rounded-xl shadow-medium flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaProjectDiagram className="text-white text-3xl drop-shadow-lg" />
                </motion.div>

                {/* Project name */}
                <h2 className="text-2xl md:text-3xl font-poppins font-bold text-emerald-700 mb-3 drop-shadow-sm group-hover:text-primary-600 transition-colors duration-300">
                  {project.name}
                </h2>

                {/* Project description */}
                <div className="text-slate-700 text-base md:text-lg leading-relaxed flex-grow">
                  <SafeRichText 
                    content={project.description && project.description.length > 200
                      ? project.description.slice(0, 200) + '...'
                      : project.description} 
                  />
                </div>

                {/* Read more indicator */}
                <motion.div 
                  className="mt-4 text-primary-600 font-medium text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                >
                  Learn more →
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-medium border-2 border-slate-200 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-700 to-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-medium">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-2xl font-poppins font-bold text-slate-900 mb-2">No Projects Yet</h3>
              <p className="text-slate-600">Projects will be displayed here once they are added.</p>
            </div>
          </motion.div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;