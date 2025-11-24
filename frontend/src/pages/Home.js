import React, { useEffect, useState } from "react";
import axios from "axios";
import SafeRichText from '../components/SafeRichText';
import { FaHandsHelping, FaChartLine, FaProjectDiagram, FaUsers, FaGraduationCap, FaIndustry, FaLeaf, FaRegNewspaper, FaRegCalendarAlt, FaTrophy, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';


// Hero Section with clean overlay
function HeroSection() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] w-full flex items-center justify-center overflow-hidden rounded-b-3xl rounded-3xl">
      {/* Background image with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat w-full"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80')`,
        }}
      />
      {/* Gradient overlays for better text contrast and visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-800/30 to-slate-900/40" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight drop-shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          WHERE VISION MEETS<br />IMPLEMENTATION
        </motion.h1>
        
        {/* <motion.p
          className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-10 max-w-3xl mx-auto font-light drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We connect global development goals with on-the-ground results.
        </motion.p> */}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
        >
          {/* <Link
            to="/contact"
            className="inline-flex items-center justify-center bg-[#4295bd] hover:bg-[#3584ab] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-[#3584ab]/20"
          >
            Partner With Us
          </Link> */}
          <Link
            to="/services"
            className="inline-flex items-center justify-center border-2 border-white/20 hover:border-white/40 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-xl font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
          >
            Our Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=800&q=80" // New image URL
              alt="Team collaboration"
              className="rounded-lg shadow-xl w-full"
              style={{ maxHeight: "400px" }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              About VenturePoint
            </h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-700 mb-6">
              Built on Legacy. Driven by Impact.
            </h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              As the development landscape evolves, VenturePoint bridges donors and governments, policy and practice, vision and action.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              With decades of experience, we deliver evidence-based, practical solutions that advance inclusive and sustainable growth.
            </p>
            <div className="flex justify-center">
              <Link
                to="/about"
                className="inline-block bg-[#4295bd] hover:bg-[#3584ab] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const services = [
    {
      icon: FaChartLine,
      title: "Strategic Advisory",
      description: "Expert guidance for development initiatives"
    },
    {
      icon: FaProjectDiagram,
      title: "Program Design & Evaluation",
      description: "Evidence-based program development"
    },
    {
      icon: FaHandsHelping,
      title: "Partnership Facilitation",
      description: "Building effective collaborations"
    },
    {
      icon: FaUsers,
      title: "Capacity Development",
      description: "Empowering local institutions"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            What We Do
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-4">
                <service.icon className="text-5xl text-[#2e3b2e]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {service.title}
              </h3>
              <p className="text-slate-600 text-base">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-block bg-[#4295bd] hover:bg-[#3584ab] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Explore Our Services
          </Link>
        </div>
      </div>
    </section>
  );
}

// Projects Section
function ProjectsSection({ projects, apiBase }) {
  const projectImages = [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&q=80'
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Experience That Drives Our Vision
          </h2>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
            VenturePoint builds on the extensive experience of its founders, who have led and contributed to transformative USAID-funded programs in Egypt. While these programs were achieved before establishing the firm, they deeply influence how we bridge policy and practice, donor priorities and national needs, and vision and implementation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.slice(0, 3).map((project, index) => (
            <Link to={`/projects/${project.id}`} key={project.id}>
              <motion.div
                className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  {(() => {
                    const imgSrc = resolveImageSrc(project, apiBase || '') || projectImages[index];
                    return (
                      <img
                        src={imgSrc}
                        alt={project.title || project.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => { e.currentTarget.src = projectImages[index]; }}
                      />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                    {project.title || project.name}
                  </h3>
                  <div className="text-slate-600 text-sm line-clamp-3">
                    <SafeRichText content={project.description || project.content || ""} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/projects"
            className="inline-block bg-[#4295bd] hover:bg-[#3584ab] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}

// Partner CTA Section
function PartnerCTASection() {
  return (
    <section className="py-16 sm:py-24 bg-slate-800 rounded-t-3xl rounded-3xl">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Become Our Partner
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8">
              Let's build the future of development — together.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-[#4295bd] hover:bg-[#3584ab] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Partner With Us
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800"
              alt="Partnership"
              className="rounded-lg shadow-xl w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Main Home Component
export default function Home() {
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';

  // Debug: log renders and loading state to help diagnose disappearing content
  // Remove these logs when the issue is resolved
  // eslint-disable-next-line no-console
  console.debug('[Home] render', { loading, projectsCount: projects?.length, articlesCount: articles?.length, eventsCount: events?.length });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // eslint-disable-next-line no-console
        console.debug('[Home] fetching projects/articles/events from API');
        const [projectsRes, articlesRes, eventsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/projects`),
          axios.get(`${API_BASE_URL}/api/articles`),
          axios.get(`${API_BASE_URL}/api/events`)
        ]);
        // eslint-disable-next-line no-console
        console.debug('[Home] responses', { projects: projectsRes?.data, articles: articlesRes?.data, events: eventsRes?.data });
        setProjects(projectsRes.data || []);
        setArticles(articlesRes.data || []);
        setEvents(eventsRes.data || []);
        setLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#73ab40]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      {/* <StatsSection /> */}
      <ProjectsSection projects={projects} apiBase={API_BASE_URL} />
      {/* <ArticlesSection articles={articles} /> */}
      <EventsSection events={events} apiBase={API_BASE_URL} />
      <PartnerCTASection />
    </div>
  );
}

// // Stats Section
// function StatsSection() {
//   const stats = [
//     { icon: FaTrophy, value: '35+', label: 'Years Experience' },
//     { icon: FaGlobe, value: '20+', label: 'Countries' },
//     { icon: FaUsers, value: '50K+', label: 'Jobs Created' },
//     { icon: FaGraduationCap, value: '$2B+', label: 'Programs Managed' }
//   ];

//   return (
//     <section className="py-12 sm:py-16 bg-white">
//       <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
//         <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
//           {stats.map((s, i) => {
//             const Icon = s.icon;
//             return (
//               <div key={i} className="text-center bg-slate-50 rounded-lg p-6 shadow-sm">
//                 <div className="flex items-center justify-center w-12 h-12 bg-[#e8f1f7] rounded-md mx-auto mb-3">
//                   <Icon className="text-2xl text-[#4295bd]" />
//                 </div>
//                 <div className="text-2xl font-bold text-slate-800">{s.value}</div>
//                 <div className="text-base text-slate-600">{s.label}</div>
//               </div>
//             );
//           })}
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// Articles Section
// function ArticlesSection({ articles }) {
//   const articleImages = [
//     'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&q=80',
//     'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&q=80',
//     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&q=80'
//   ];

//   return (
//     <section className="py-16 sm:py-24 bg-slate-50">
//       <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
//         <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
//           <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Articles & Publications</h2>
//         </motion.div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
//           {articles.slice(0,3).map((a, idx) => (
//             <Link key={a.id || idx} to={`/articles/${a.id || ''}`}>
//               <motion.div 
//                 className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full" 
//                 initial={{ opacity: 0, y: 20 }} 
//                 animate={{ opacity: 1, y: 0 }} 
//                 transition={{ duration: 0.6, delay: idx * 0.08 }}
//                 whileHover={{ y: -5 }}
//               >
//                 <div className="relative h-40 sm:h-48 overflow-hidden">
//                   <img
//                     src={articleImages[idx]}
//                     alt={a.title || a.name}
//                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
//                 </div>
//                 <div className="p-4 sm:p-6">
//                   <div className="flex items-center gap-2 mb-4 text-[#4295bd]">
//                     <FaRegNewspaper className="text-xl" />
//                     <span className="text-base font-semibold">Article</span>
//                   </div>
//                   <h3 className="text-2xl font-bold text-slate-800 mb-3 line-clamp-2">{a.title || a.name}</h3>
//                   <div className="text-slate-600 text-base line-clamp-3"><SafeRichText content={a.description || a.content || ''} /></div>
//                 </div>
//               </motion.div>
//             </Link>
//           ))}
//         </div>

//         <div className="text-center mt-12">
//           <Link to="/articles" className="inline-block bg-[#4295bd] hover:bg-[#3584ab] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">View All Articles</Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// Events Section
function EventsSection({ events, apiBase }) {
  const eventImages = [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&q=80'
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Events and Publications</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {events.slice(0,3).map((e, idx) => (
            <motion.div 
              key={e.id || idx} 
              className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                {(() => {
                  const imgSrc = resolveImageSrc(e, apiBase || '') || eventImages[idx];
                  return (
                    <img
                      src={imgSrc}
                      alt={e.title || e.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(ev) => { ev.currentTarget.src = eventImages[idx]; }}
                    />
                  );
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#e8f1f7] rounded-md flex items-center justify-center">
                      <FaRegCalendarAlt className="text-xl text-[#3F93E6]" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{e.title || e.name}</div>
                      <div className="text-base text-[#3F93E6]">{e.date || e.startDate || ''}</div>
                    </div>
                  </div>
                </div>
                <div className="text-slate-600 text-sm line-clamp-3">
                  <SafeRichText content={e.description || e.content || ''} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/events" className="inline-block bg-[#4295bd] hover:bg-[#3584ab] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">View All Events</Link>
        </div>
      </div>
    </section>
  );
}

// Helper to resolve an image source from an object that may contain
// - _imageSrc (preloaded blob URL)
// - image_data (data URL string or byte buffer)
// - image_url (remote url or backend path)
function resolveImageSrc(item, apiBase) {
  if (!item) return null;
  // prefer preloaded object URL
  if (item._imageSrc) return item._imageSrc;

  // image_data may be a data: URL string, a base64 string, or a Buffer-like object
  if (item.image_data) {
    const d = item.image_data;
    if (typeof d === 'string') {
      if (d.startsWith('data:')) return d;
      // assume base64 string -> try to wrap with mimetype if available
      const mime = item.image_mimetype || 'image/jpeg';
      return `data:${mime};base64,${d}`;
    }
    // If Buffer-like object { type: 'Buffer', data: [...] } or array
    if (typeof d === 'object') {
      try {
        const arr = Array.isArray(d.data) ? new Uint8Array(d.data) : new Uint8Array(d);
        const blob = new Blob([arr], { type: item.image_mimetype || 'image/jpeg' });
        return URL.createObjectURL(blob);
      } catch (err) {
        // fallthrough to image_url
      }
    }
  }

  // image_url handling
  if (item.image_url) {
    const imageUrl = String(item.image_url);
    // absolute URL
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    // if starts with /images/ or /api/ or other backend path, prefix API base
    if (imageUrl.startsWith('/')) return `${apiBase}${imageUrl}`;
    // numeric id mapping (Admin used this pattern)
    if (!isNaN(Number(imageUrl.trim()))) return `${apiBase}/image/${imageUrl.trim()}`;
    // default: prefix with apiBase
    return `${apiBase}/${imageUrl}`;
  }

  return null;
}