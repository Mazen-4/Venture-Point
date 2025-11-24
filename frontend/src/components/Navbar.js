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
  const [showDesktop, setShowDesktop] = useState(true);

  // More conservative breakpoint - show hamburger menu earlier to prevent overflow
  useEffect(() => {
    let timer = null;
    const measure = () => {
      const width = window.innerWidth;
      // Show desktop navigation only on screens 1400px and above
      // This ensures enough space for all buttons without overflow
      if (width >= 1400) {
        setShowDesktop(true);
      } else {
        setShowDesktop(false);
      }
    };

    const onResize = () => { 
      clearTimeout(timer); 
      timer = setTimeout(measure, 120); 
    };
    
    window.addEventListener('resize', onResize);
    measure();
    const initTimer = setTimeout(measure, 400);
    
    if (document && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(measure, 80)).catch(() => {});
    }

    return () => { 
      window.removeEventListener('resize', onResize); 
      clearTimeout(timer); 
      clearTimeout(initTimer); 
    };
  }, []);

  const location = useLocation();
  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Partners', path: '/partners-list', icon: <FaHandshake /> },
    { name: 'Contact us', path: '/contact', icon: <FaEnvelope /> },
  ];
  
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutOpenMobile, setAboutOpenMobile] = useState(false);
  const [teamSubmenuOpen, setTeamSubmenuOpen] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [scopeOpenMobile, setScopeOpenMobile] = useState(false);
  const [screenSize, setScreenSize] = useState('lg');
  
  const aboutRef = useRef(null);
  const scopeRef = useRef(null);

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

  // Close scope dropdown when clicking outside
  useEffect(() => {
    if (!scopeOpen) return;
    function handleClick(e) {
      if (scopeRef.current && !scopeRef.current.contains(e.target)) {
        setScopeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [scopeOpen]);

  const aboutDropdown = [
    { name: 'Our Story', path: '/about' },
    { 
      name: 'Meet Our Team', 
      submenu: [
        { name: 'Founders', path: '/team' },
        { name: 'Advisors', path: '/advisors' },
      ]
    },
    { name: 'Legacy For Impacts', path: '/projects' },
  ];
  
  const scopeDropdown = [
    { name: 'Services', path: '/services' },
    { name: 'Events', path: '/events' },
    { name: 'Publications', path: '/articles' },
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
        <div className="flex justify-between items-center h-20 min-h-[80px] gap-3">
          {/* Logo - Compact on smaller screens */}
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 min-w-max">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
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
                  const px = (x / rect.width) * 2 - 1;
                  const py = (y / rect.height) * 2 - 1;
                  const rotateY = px * 12;
                  const rotateX = -py * 8;
                  const translateZ = 18 - Math.abs(py) * 6;
                  img.style.transform = `translate3d(0,-8px,${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.035)`;
                  const shadow = el.querySelector('.logo-shadow');
                  if (shadow) {
                    shadow.style.transform = `translateX(${-px * 10}px) scale(${1 - Math.abs(py) * 0.08})`;
                    shadow.style.opacity = `${0.9 - Math.abs(py) * 0.3}`;
                  }
                }}
                onMouseLeave={() => {
                  const img = logoImgRef.current;
                  const el = logoWrapperRef.current;
                  if (img) img.style.transform = '';
                  if (el) {
                    const shadow = el.querySelector('.logo-shadow');
                    if (shadow) { 
                      shadow.style.transform = 'translateX(0) scale(1)'; 
                      shadow.style.opacity = '0.9'; 
                    }
                  }
                }}
              >
                <img
                  ref={logoImgRef}
                  src="/VPED-logo.png"
                  alt="VenturePoint Logo"
                  className="logo h-14 sm:h-16 w-auto object-contain animate-spin-slow group-hover:scale-110 transition-transform duration-500 flex-shrink-0"
                  style={{ maxHeight: '64px' }}
                />
                <div className="logo-shadow pointer-events-none absolute left-1/2 transform -translate-x-1/2" />
              </div>
              <span className="flex flex-col leading-tight whitespace-nowrap" style={{letterSpacing: '0.03em'}}>
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-wide text-[#ffffff] drop-shadow-lg animate-gradient-x">
                  VenturePoint
                </span>
                <span className="text-xs sm:text-xs md:text-sm font-semibold text-[#3F93E6] -mt-0.5">
                  for economic development
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Only shows on screens >= 1400px */}
          {showDesktop && (
            <div className="flex items-center gap-0.5">
              {/* Home Link */}
              {(() => {
                const link = navLinks[0];
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-1.5 text-base font-medium px-2.5 py-2 rounded-md transition-all duration-300 relative whitespace-nowrap ${
                      isActive ? 'text-[#3F93E6] font-bold' : 'text-gray-50 hover:text-[#3F93E6]'
                    } group`}
                  >
                    <span className={`transition-transform duration-300 text-base flex-shrink-0 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      {link.icon}
                    </span>
                    <span className="text-base">{link.name}</span>
                    {isActive && (
                      <span className="absolute left-0 bottom-0 w-full h-1 bg-[#3F93E6] rounded-full animate-underline"></span>
                    )}
                  </Link>
                );
              })()}

              {/* About Dropdown */}
              <div className="relative group" ref={aboutRef}>
                <button
                  className={`flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-2 rounded-md text-base font-medium transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${
                    ['/about','/team','/projects','/advisors'].includes(location.pathname) 
                      ? 'text-[#3F93E6] font-bold' 
                      : 'text-gray-50 hover:text-[#3F93E6]'
                  } group focus:outline-none`}
                  aria-haspopup="true"
                  aria-expanded={aboutOpen}
                  onClick={(e) => {
                    e.preventDefault();
                    setAboutOpen(v => !v);
                  }}
                  type="button"
                >
                  <FaInfoCircle className="transition-transform duration-300 group-hover:scale-110 text-base flex-shrink-0" />
                  <span className="text-base">About Us</span>
                  <svg 
                    className={`w-3 h-3 transition-transform duration-200 flex-shrink-0 ${aboutOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {['/about','/team','/projects','/advisors'].includes(location.pathname) && (
                    <span className="absolute left-0 bottom-0 w-full h-1 bg-[#3F93E6] rounded-full animate-underline"></span>
                  )}
                </button>
                
                {aboutOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-slate-900/95 border border-gray-700/30 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                    {aboutDropdown.map((item) => (
                      item.submenu ? (
                        <div key={item.name} className="relative group">
                          <button
                          className="w-full text-left px-5 py-2 text-base rounded-lg transition-all duration-200 hover:bg-blue-400/20 hover:text-[#3F93E6] text-gray-50 flex items-center justify-between"
                            onClick={() => setTeamSubmenuOpen(!teamSubmenuOpen)}
                          >
                            <span>{item.name}</span>
                            <svg className={`w-3 h-3 transition-transform ${teamSubmenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {teamSubmenuOpen && (
                            <div className="bg-slate-800/80 ml-6 mt-1 rounded-lg overflow-hidden">
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.name}
                                  to={subitem.path}
                                className={`block px-5 py-2 text-base rounded-lg transition-all duration-200 hover:bg-blue-400/20 hover:text-[#3F93E6] ${
                                    location.pathname === subitem.path ? 'text-[#3F93E6] font-semibold' : 'text-gray-50'
                                  }`}
                                  onClick={() => { setAboutOpen(false); setTeamSubmenuOpen(false); }}
                                >
                                  {subitem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`block px-5 py-2 text-base rounded-lg transition-all duration-200 hover:bg-blue-400/20 hover:text-[#3F93E6] ${
                            location.pathname === item.path ? 'text-[#3F93E6] font-semibold' : 'text-gray-50'
                          }`}
                          onClick={() => setAboutOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>

              {/* Scope Dropdown */}
              <div
                className="relative group"
                ref={scopeRef}
              >
                <button
                  className={`flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-2 rounded-md text-base font-medium transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${
                    ['/services', '/events', '/articles'].includes(location.pathname) 
                      ? 'text-[#3F93E6] font-bold' 
                      : 'text-gray-50 hover:text-[#3F93E6]'
                  } group focus:outline-none`}
                  aria-haspopup="true"
                  aria-expanded={scopeOpen}
                  onClick={(e) => {
                    e.preventDefault();
                    setScopeOpen(v => !v);
                  }}
                  type="button"
                  title={screenSize === 'md' ? 'Scope' : ''}
                >
                  <FaServicestack className="transition-transform duration-300 group-hover:scale-110 text-base lg:text-xl flex-shrink-0" />
                  {screenSize === 'lg' && <span>Scope</span>}
                  {screenSize === 'lg' && <svg className={`w-3 h-3 transition-transform duration-200 flex-shrink-0 ${scopeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>}
                  {['/services', '/events', '/articles'].includes(location.pathname) && (
                    <span className="absolute left-0 bottom-0 w-full h-1 bg-[#124b78] rounded-full animate-underline"></span>
                  )}
                </button>

                {scopeOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-slate-900/95 border border-gray-700/30 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                    {scopeDropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`block px-5 py-2 text-base rounded-lg transition-all duration-200 hover:bg-blue-400/20 hover:text-[#3F93E6] ${
                          location.pathname === item.path ? 'text-[#3F93E6] font-semibold' : 'text-gray-50'
                        }`}
                        onClick={() => setScopeOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Navigation Links */}
              {navLinks.slice(1).map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md text-base font-medium transition-all duration-300 relative whitespace-nowrap ${
                      isActive ? 'text-[#3F93E6] font-bold' : 'text-gray-50 hover:text-[#3F93E6]'
                    } group`}
                  >
                    <span className={`transition-transform duration-300 text-base flex-shrink-0 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      {link.icon}
                    </span>
                    <span className="text-base">{link.name}</span>
                    {isActive && (
                      <span className="absolute left-0 bottom-0 w-full h-1 bg-[#3F93E6] rounded-full animate-underline"></span>
                    )}
                  </Link>
                );
              })}

              {/* Admin Button */}
              <div className="ml-1 pl-2 border-l border-gray-700">
                {authenticated ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 bg-blue-500 text-white px-2.5 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors shadow-md whitespace-nowrap"
                  >
                    <FaUserShield className="text-base flex-shrink-0" /> 
                    <span className="text-base">Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/admin/login"
                    className="flex items-center gap-1.5 text-[#3F93E6] px-2.5 py-2 rounded-md text-base font-medium hover:bg-[#244E77] hover:text-white transition-colors shadow-md whitespace-nowrap"
                  >
                    <FaSignInAlt className="text-base flex-shrink-0" />
                    <span className="text-base">Admin</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          {!showDesktop && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#3F93E6] hover:text-gray-50 focus:outline-none focus:text-[#3F93E6] transition-transform duration-300 flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="h-7 w-7 sm:h-8 sm:w-8 animate-fade-in" />
              ) : (
                <FaBars className="h-7 w-7 sm:h-8 sm:w-8 animate-fade-in" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && !showDesktop && (
        <div className="animate-slide-down">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-[#2F3A36]/95 backdrop-blur-lg shadow-lg rounded-b-xl">
            {/* Home Link */}
            {(() => {
              const link = navLinks[0];
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md transition-all duration-300 relative ${
                    isActive ? 'bg-slate-900/40 text-[#3F93E6] font-bold' : 'text-gray-50 hover:text-[#3F93E6]'
                  } group`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`transition-transform duration-300 text-xl flex-shrink-0 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {link.icon}
                  </span>
                  {link.name}
                  {isActive && (
                    <span className="absolute left-0 bottom-0 w-full h-1 bg-[#3F93E6] rounded-full animate-underline"></span>
                  )}
                </Link>
              );
            })()}

            {/* About Dropdown for mobile */}
            <div className="relative">
              <button
                className={`flex items-center gap-3 text-base font-medium px-3 py-2 rounded-md transition-all duration-300 relative ${
                  ['/about','/team','/projects','/advisors'].includes(location.pathname) 
                    ? 'text-[#3F93E6] font-bold' 
                    : 'text-gray-50 hover:text-[#3F93E6]'
                } group focus:outline-none`}
                aria-haspopup="true"
                aria-expanded={aboutOpenMobile}
                onClick={() => setAboutOpenMobile(v => !v)}
              >
                <FaInfoCircle className="transition-transform duration-300 group-hover:scale-110 text-xl flex-shrink-0" />
                About Us
                <svg 
                  className={`ml-auto w-3 h-3 transition-transform duration-200 flex-shrink-0 ${aboutOpenMobile ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {['/about','/team','/projects','/advisors'].includes(location.pathname) && (
                  <span className="absolute left-0 bottom-0 w-full h-1 bg-[#3F93E6] rounded-full animate-underline"></span>
                )}
              </button>
              
              {aboutOpenMobile && (
                <div className="mt-2 ml-10 space-y-1 animate-fade-in">
                  {aboutDropdown.map((item) => (
                    item.submenu ? (
                      <div key={item.name} className="relative">
                        <button
                          className="w-full text-left px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-blue-400/20 hover:text-[#3F93E6] text-gray-50 flex items-center justify-between"
                          onClick={() => setTeamSubmenuOpen(!teamSubmenuOpen)}
                        >
                          <span>{item.name}</span>
                          <svg className={`w-3 h-3 transition-transform ${teamSubmenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {teamSubmenuOpen && (
                          <div className="mt-1 ml-4 space-y-1">
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.name}
                                to={subitem.path}
                                className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-blue-400/20 hover:text-[#3F93E6] ${
                                  location.pathname === subitem.path ? 'text-[#3F93E6] font-semibold bg-blue-400/10' : 'text-gray-50'
                                }`}
                                onClick={() => { 
                                  setAboutOpenMobile(false); 
                                  setTeamSubmenuOpen(false);
                                  setIsMenuOpen(false); 
                                }}
                              >
                                {subitem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-blue-400/20 hover:text-[#3F93E6] ${
                          location.pathname === item.path ? 'text-[#3F93E6] font-semibold bg-blue-400/10' : 'text-gray-50'
                        }`}
                        onClick={() => { 
                          setAboutOpenMobile(false); 
                          setIsMenuOpen(false); 
                        }}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Scope Dropdown for mobile */}
            <div className="relative">
              <button
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-base font-medium transition-all duration-300 relative ${
                  ['/services', '/events', '/articles'].includes(location.pathname) 
                    ? 'text-[#3F93E6] font-bold' 
                    : 'text-gray-50 hover:text-[#3F93E6]'
                } group focus:outline-none`}
                aria-haspopup="true"
                aria-expanded={scopeOpenMobile}
                onClick={() => setScopeOpenMobile(v => !v)}
              >
                <FaServicestack className="transition-transform duration-300 group-hover:scale-110 text-xl flex-shrink-0" />
                Scope
                <svg 
                  className={`ml-auto w-3 h-3 transition-transform duration-200 flex-shrink-0 ${scopeOpenMobile ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {['/services', '/events', '/articles'].includes(location.pathname) && (
                  <span className="absolute left-0 bottom-0 w-full h-1 bg-[#3F93E6] rounded-full animate-underline"></span>
                )}
              </button>
              
              {scopeOpenMobile && (
                <div className="mt-2 ml-8 space-y-1 animate-fade-in">
                  {scopeDropdown.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block px-4 py-2 text-base rounded-lg transition-all duration-200 hover:bg-blue-400/20 hover:text-[#3F93E6] ${
                        location.pathname === item.path ? 'text-[#3F93E6] font-semibold' : 'text-gray-50'
                      }`}
                      onClick={() => { 
                        setScopeOpenMobile(false); 
                        setIsMenuOpen(false); 
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other Navigation Links */}
            {navLinks.slice(1).map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md transition-all duration-300 relative ${
                    isActive ? 'bg-slate-900/40 text-[#3F93E6] font-bold' : 'text-gray-50 hover:text-[#3F93E6]'
                  } group`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`transition-transform duration-300 text-xl flex-shrink-0 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {link.icon}
                  </span>
                  {link.name}
                  {isActive && (
                    <span className="absolute left-0 bottom-0 w-full h-1 bg-[#3F93E6] rounded-full animate-underline"></span>
                  )}
                </Link>
              );
            })}

            {/* Mobile Admin Button */}
            <div className="border-t border-gray-700 pt-2 mt-2">
              {authenticated ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 bg-blue-500 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserShield className="text-xl flex-shrink-0" /> Dashboard
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="flex items-center gap-3 text-[#3F93E6] px-3 py-2 rounded-md text-base font-medium hover:bg-[#244E77] hover:text-white shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaSignInAlt className="text-xl flex-shrink-0" /> Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
}