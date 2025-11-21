import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { authAPI } from '../utils/authUtils';
import './logo.css';
import { FaHome, FaInfoCircle, FaServicestack, FaEnvelope, FaUserShield, FaSignInAlt, FaBars, FaTimes, FaHandshake } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authenticated = authAPI.hasRole('admin') || authAPI.hasRole('superadmin');

  const logoWrapperRef = useRef(null);
  const logoImgRef = useRef(null);
  const navRootRef = useRef(null);
  const navItemsRef = useRef(null);
  const adminBtnRef = useRef(null);
  const [showDesktop, setShowDesktop] = useState(true);

  useEffect(() => {
    const MIN_W = 1280; // Tailwind 'xl' breakpoint
    let timer = null;
    const measure = () => {
      const isWide = window.innerWidth >= MIN_W;
      if (!isWide) { setShowDesktop(false); return; }
      const navW = navRootRef.current ? navRootRef.current.clientWidth : window.innerWidth;
      const logoW = logoWrapperRef.current ? logoWrapperRef.current.offsetWidth : 0;
      // Use scrollWidth for total content width (includes gaps, borders and overflow)
      const itemsW = navItemsRef.current ? navItemsRef.current.scrollWidth : 0;
      const aboutW = aboutRef.current ? aboutRef.current.offsetWidth : 0;
      const buffer = 140; // buffer to account for paddings, gaps and potential borders
      setShowDesktop((logoW + aboutW + itemsW + buffer) <= navW);
    };

    const onResize = () => { clearTimeout(timer); timer = setTimeout(measure, 120); };
    window.addEventListener('resize', onResize);
    // measure initially and after a short delay (fonts/images)
    measure();
    const initTimer = setTimeout(measure, 400);
    // re-measure once fonts are ready (where supported)
    if (document && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(measure, 80)).catch(() => {});
    }

    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer); clearTimeout(initTimer); };
  }, []);

  const location = useLocation();
  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Services', path: '/services', icon: <FaServicestack /> },
    { name: 'Partners', path: '/partners-list', icon: <FaHandshake /> },
    { name: 'Contact us', path: '/contact', icon: <FaEnvelope /> },
  ];
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutOpenMobile, setAboutOpenMobile] = useState(false);
  const aboutRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!aboutOpen) return;
    function handleClick(e) {
      if (aboutRef.current && !aboutRef.current.contains(e.target)) {
        setAboutOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [aboutOpen]);
  const aboutDropdown = [
  { name: 'Our Story', path: '/about' },
  { name: 'Meet Our Team', path: '/team' },
  { name: 'Legacy For Impacts', path: '/projects' },
  { name: 'Advisors', path: '/advisors' },
  { name: 'Events', path: '/events' },
  { name: 'Articles', path: '/articles' },
  ];

  return (
    <motion.nav
  initial={{ opacity: 0, scale: 0.96, y: -20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  className="sticky top-0 z-50 w-full sm:w-[95%] mx-auto font-inter backdrop-blur-lg bg-[#2F3A36]/90 shadow-xl transition-all duration-500 rounded-b-3xl"
  style={{ fontFamily: 'Georgia, serif' }}
  ref={navRootRef}
>


  <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
  <div className="flex justify-between items-center h-20 min-h-[80px]">
          {/* Logo - Fixed width with responsive sizing */}
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-max">
              <Link to="/" className="flex items-center gap-1.5 sm:gap-2 md:gap-3 group">
              <div
                ref={logoWrapperRef}
                className="logo-wrapper relative inline-block"
                onMouseMove={(e) => {
                  const el = logoWrapperRef.current;
                  const img = logoImgRef.current;
                  if (!el || !img) return;
                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const px = (x / rect.width) * 2 - 1; // -1 .. 1
                  const py = (y / rect.height) * 2 - 1; // -1 .. 1
                  const rotateY = px * 12; // degrees
                  const rotateX = -py * 8; // degrees
                  const translateZ = 18 - Math.abs(py) * 6;
                  img.style.transform = `translate3d(0,-8px,${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.035)`;
                  const shadow = el.querySelector('.logo-shadow');
                  if (shadow) {
                    shadow.style.transform = `translateX(${ -px * 10 }px) scale(${1 - Math.abs(py) * 0.08})`;
                    shadow.style.opacity = `${0.9 - Math.abs(py) * 0.3}`;
                  }
                }}
                onMouseLeave={() => {
                  const img = logoImgRef.current;
                  const el = logoWrapperRef.current;
                  if (img) img.style.transform = '';
                  if (el) {
                    const shadow = el.querySelector('.logo-shadow');
                    if (shadow) { shadow.style.transform = 'translateX(0) scale(1)'; shadow.style.opacity = '0.9'; }
                  }
                }}
                onFocus={() => { /* keyboard accessibility: can add focus styles */ }}
              >
                <img
                  ref={logoImgRef}
                  src="/VPED-logo.png"
                  alt="VenturePoint Logo"
                  className="logo h-12 sm:h-13 md:h-14 w-auto object-contain animate-spin-slow group-hover:scale-110 transition-transform duration-500 flex-shrink-0"
                  style={{ maxHeight: '56px' }}
                />
                <div className="logo-shadow pointer-events-none absolute left-1/2 transform -translate-x-1/2" />
              </div>
              <span className="flex flex-col leading-tight whitespace-nowrap" style={{letterSpacing: '0.03em'}}>
                <span className="text-base sm:text-lg md:text-xl lg:text-3xl font-extrabold tracking-wide text-[#ffffff] drop-shadow-lg animate-gradient-x">VenturePoint</span>
                <span className="text-xs sm:text-sm md:text-sm lg:text-sm font-semibold text-[#3F93E6] -mt-0.5">for economic development</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Flexbox with proper spacing */}
          <div className={`${showDesktop ? 'flex' : 'hidden'} items-center flex-1 justify-end ml-4 relative`}> 
            <div ref={navItemsRef} className="flex items-center gap-1 lg:gap-2 flex-nowrap justify-end w-full overflow-x-hidden">
              {/* Home (first) */}
              {(() => {
                const link = navLinks[0];
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-1.5 lg:gap-2 text-sm font-medium px-2 lg:px-3 py-2 rounded-md transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${isActive ? 'text-[#3F93E6] font-bold' : 'text-gray-50 hover:text-[#3F93E6]'} group`}
                  >
                    <span className={`transition-transform duration-300 text-lg lg:text-2xl flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{link.icon}</span>
                    <span className="hidden sm:inline">{link.name}</span>
                    {isActive && (
                      <span className="absolute left-0 bottom-0 w-full h-1 bg-[#3F93E6] rounded-full animate-underline"></span>
                    )}
                  </Link>
                );
              })()}
            </div>
              {/* About Dropdown */}
              <div
                className="relative group"
                ref={aboutRef}
              >
                <button
                  className={`flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${['/about','/projects','/articles','/events','/advisors'].includes(location.pathname) ? 'text-[#3F93E6] font-bold' : 'text-gray-50 hover:text-[#3F93E6]'} group focus:outline-none`}
                  aria-haspopup="true"
                  aria-expanded={aboutOpen}
                  onClick={e => {
                    e.preventDefault();
                    setAboutOpen(v => !v);
                  }}
                  type="button"
                >
                  <FaInfoCircle className="transition-transform duration-300 group-hover:scale-110 text-lg lg:text-2xl flex-shrink-0" />
                  <span className="hidden sm:inline">Our Story</span>
                  <svg className={`w-3 h-3 transition-transform duration-200 flex-shrink-0 ${aboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  {['/about','/projects','/articles','/events','/advisors'].includes(location.pathname) && (
                    <span className="absolute left-0 bottom-0 w-full h-1 bg-[#124b78] rounded-full animate-underline"></span>
                  )}
                </button>
                    {/* Dropdown menu */}
                {aboutOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-slate-900/95 border border-gray-700/30 rounded-xl shadow-xl py-2 z-50 animate-fade-in"
                  >
                    {aboutDropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`block px-5 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-blue-400/20 hover:text-[#3F93E6] ${location.pathname === item.path ? 'text-[#3F93E6] font-semibold' : 'text-gray-50'}`}
                        onClick={() => setAboutOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div ref={navItemsRef} className="flex items-center gap-1 lg:gap-2 flex-nowrap">
              {navLinks.slice(1).map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${isActive ? 'bg-slate-900/40 text-[#3F93E6] font-bold' : 'text-gray-50 hover:text-[#3F93E6]'} group`}
                  >
                    <span className={`transition-transform duration-300 text-lg lg:text-2xl flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{link.icon}</span>
                    <span className="hidden sm:inline">{link.name}</span>
                    {isActive && (
                      <span className="absolute left-0 bottom-0 w-full h-1 bg-[#124b78] rounded-full animate-underline"></span>
                    )}
                  </Link>
                );
              })}
              {/* Admin Button */}
              <div ref={adminBtnRef} className="ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-gray-700 flex-shrink-0">
                {authenticated ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 lg:gap-2 bg-blue-500 text-white px-2 lg:px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors shadow-md whitespace-nowrap flex-shrink-0"
                  >
                    <FaUserShield className="text-lg lg:text-2xl flex-shrink-0" /> 
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/admin/login"
                    className="flex items-center gap-1.5 lg:gap-2 text-[#3F93E6] px-2 lg:px-4 py-2 rounded-md text-sm font-medium hover:bg-[#244E77] hover:text-white transition-colors shadow-md whitespace-nowrap flex-shrink-0"
                  >
                    <FaSignInAlt className="text-lg lg:text-2xl flex-shrink-0" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
              </div>
              </div>
            </div>

          {/* Mobile menu button */}
          <div className={`${showDesktop ? 'hidden' : ''}`}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#3F93E6] hover:text-gray-50 focus:outline-none focus:text-[#3F93E6] transition-transform duration-300"
            >
              {isMenuOpen ? (
                <FaTimes className="h-8 w-8 animate-fade-in" />
              ) : (
                <FaBars className="h-8 w-8 animate-fade-in" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="animate-slide-down">
            <div className="px-4 pt-2 pb-3 space-y-1 bg-navy/90 backdrop-blur-lg shadow-lg rounded-b-xl">
            {/* Home (first) */}
            {(() => {
              const link = navLinks[0];
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium block px-3 py-2 rounded-md transition-all duration-300 relative ${isActive ? 'bg-slate-900/40 text-[#124b78] font-bold' : 'text-gray-50 hover:text-[#124b78]'} group`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`transition-transform duration-300 text-2xl ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{link.icon}</span>
                  {link.name}
                  {isActive && (
                    <span className="absolute left-0 bottom-0 w-full h-1 bg-[#124b78] rounded-full animate-underline"></span>
                  )}
                </Link>
              );
            })()}
            {/* About Dropdown for mobile */}
            <div className="relative">
              <button
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative ${['/about','/projects','/articles','/events','/advisors'].includes(location.pathname) ? 'text-[#3F93E6] font-bold' : 'text-gray-50 hover:text-[#3F93E6]'} group focus:outline-none`}
                aria-haspopup="true"
                aria-expanded={aboutOpenMobile}
                onClick={() => setAboutOpenMobile((v) => !v)}
              >
                <FaInfoCircle className="transition-transform duration-300 group-hover:scale-110 text-2xl" />
                Our Story
                <svg className={`ml-1 w-3 h-3 transition-transform duration-200 ${aboutOpenMobile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                {['/about','/projects','/articles','/events','/advisors'].includes(location.pathname) && (
                  <span className="absolute left-0 bottom-0 w-full h-1 bg-[#124b78] rounded-full animate-underline"></span>
                )}
              </button>
              {aboutOpenMobile && (
                <div className="mt-2 w-full bg-navy/95 border border-blue-400/30 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                  {aboutDropdown.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block px-5 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-blue-400/20 hover:text-[#3F93E6] ${location.pathname === item.path ? 'text-[#3F93E6] font-semibold' : 'text-gray-50'}`}
                      onClick={() => { setAboutOpenMobile(false); setIsMenuOpen(false); }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
                  {navLinks.slice(1).map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium block px-3 py-2 rounded-md transition-all duration-300 relative ${isActive ? 'bg-slate-900/40 text-[#124b78] font-bold' : 'text-gray-50 hover:text-[#124b78]'} group`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`transition-transform duration-300 text-2xl ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{link.icon}</span>
                  {link.name}
                  {isActive && (
                    <span className="absolute left-0 bottom-0 w-full h-1 bg-[#124b78] rounded-full animate-underline"></span>
                  )}
                </Link>
              );
            })}
            {/* Mobile Admin Button */}
            <div className="border-t border-blue-400 pt-2 mt-2">
              {authenticated ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 bg-blue-400 text-navy block px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-400 hover:text-white shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserShield className="text-2xl" /> Dashboard
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="flex items-center gap-2 text-[#3F93E6] block px-3 py-2 rounded-md text-sm font-medium hover:bg-[#244E77] hover:text-white shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaSignInAlt className="text-2xl" /> Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
// Custom animations (add to your global CSS or Tailwind config)
// .animate-spin-slow { animation: spin 4s linear infinite; }
// .animate-gradient-x { animation: gradient-x 3s ease-in-out infinite alternate; }
// .animate-fade-in { animation: fadeIn 0.5s ease; }
// .animate-slide-down { animation: slideDown 0.4s cubic-bezier(0.4,0,0.2,1); }