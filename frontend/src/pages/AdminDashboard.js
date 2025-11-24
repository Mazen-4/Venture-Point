import React, { useEffect } from "react";
import ReactDOM from 'react-dom';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/authUtils';
import { FaHome, FaUserShield, FaUsers, FaServicestack, FaProjectDiagram, FaCalendarAlt, FaNewspaper, FaEnvelope, FaBook } from 'react-icons/fa';

// Sidebar navigation items
import { FaHandshake } from 'react-icons/fa';
const navItems = [
  { name: 'Dashboard Home', path: '/admin', icon: <FaHome className="text-green-700 text-xl md:text-2xl" /> },
  { name: 'Admin Management', path: '/admin/admin-management', icon: <FaUserShield className="text-green-700 text-xl md:text-2xl" /> },
  { name: 'Members Management', path: '/admin/members', icon: <FaUsers className="text-green-700 text-xl md:text-2xl" /> },
  { name: 'Partners Management', path: '/admin/partners', icon: <FaHandshake className="text-green-700 text-xl md:text-2xl" /> },
  { name: 'Advisors Management', path: '/admin/advisors', icon: <FaUserShield className="text-green-700 text-xl md:text-2xl" /> },
  { name: 'Authors Management', path: '/admin/authors', icon: <FaBook className="text-green-700 text-base md:text-lg" /> },
  { name: 'Services', path: '/admin/services', icon: <FaServicestack className="text-green-700" /> },
  { name: 'Projects', path: '/admin/projects', icon: <FaProjectDiagram className="text-green-700" /> },
  { name: 'Events', path: '/admin/events', icon: <FaCalendarAlt className="text-green-700" /> },
  { name: 'Articles', path: '/admin/articles', icon: <FaNewspaper className="text-green-700" /> },
  { name: 'Contact Messages', path: '/admin/contact-messages', icon: <FaEnvelope className="text-green-700" /> },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const isAdmin = authAPI.hasRole('admin') || authAPI.hasRole('superadmin');

  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  // Use global unread count from contact messages
  const [unreadCount, setUnreadCount] = React.useState(window.contactMessagesUnreadCount || 0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setUnreadCount(window.contactMessagesUnreadCount || 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // State for mobile sidebar drawer
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

    {/* CSS moved into <style> tag below */}
  return (
    <>
      {/* Floating Contact Messages Button rendered via portal */}
      {isAdmin && ReactDOM.createPortal(
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
          <button
            className="bg-gradient-to-br from-blue-600 to-emerald-400 text-white rounded-full shadow-2xl w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform duration-300 border-4 border-white/70 backdrop-blur-lg animate-float relative"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
            onClick={() => window.location.href = '/admin/contact-messages'}
            aria-label="Contact Messages"
          >
            <FaEnvelope className="text-3xl animate-bounce" />
          </button>
        </div>,
        document.body
      )}
      <div
        className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-sm sm:text-base overflow-x-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}
      >
        <div className="relative min-h-screen flex flex-col md:flex-row overflow-hidden p-2 md:p-4 w-full md:max-w-screen-2xl md:mx-auto min-w-0">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0">
          {/* ...existing code... */}
          <style>{`
            @keyframes gradientMove {
              0% { background-position: 0% 0%; }
              100% { background-position: 100% 100%; }
            }
            ${[...Array(12)].map((_, i) => `@keyframes floatParticle${i} {
              0% { transform: translateY(0) scale(1); opacity: 0.4; }
              25% { transform: translateY(-40px) scale(1.3); opacity: 0.6; }
              50% { transform: translateY(-80px) scale(0.7); opacity: 0.3; }
              75% { transform: translateY(-120px) scale(1.1); opacity: 0.5; }
              100% { transform: translateY(-160px) scale(0); opacity: 0; }
            }`).join('\n')}
            .golden-frame {
              position: relative;
              border: 2px solid #C9A635;
              transition: border-color 0.2s ease;
            }
            .golden-frame:hover {
              border-color: #E6C55A;
            }
            .logout-button {
              border: 2px solid #DC2626 !important;
            }
          `}</style>
        </div>

        {/* ...existing code... */}
        {/* Sidebar for desktop */}
          <aside className="hidden md:flex flex-col min-w-72 w-72 max-w-72 bg-white/90 backdrop-blur-lg shadow-2xl p-4 rounded-3xl animate-slidein-left transition-all duration-700 border-2 border-blue-200 fixed h-[calc(97vh)] z-30 landscape:static landscape:relative top-6 left-2 md:top-8 md:left-3 overflow-hidden">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-center text-blue-700">Admin Panel</h2>
            </div>
            <nav className="flex-1 overflow-y-auto pr-2">
              <ul className="space-y-3">
                {navItems.map((item, idx) => (
                  <li key={item.name} className="animate-fadein" style={{ animationDelay: `${idx * 0.07}s` }}>
                    <Link
                      to={item.path}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 text-green-900 font-semibold transition-all duration-300 golden-frame truncate"
                    >
                      {item.icon}
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          {/* Logout button at bottom of sidebar */}
          <div className="pt-4 border-t flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border-2 border-red-300 logout-button font-semibold"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Hamburger menu for mobile landscape */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-3 shadow-xl border-2 border-blue-400 hover:scale-105 hover:shadow-emerald/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Sidebar drawer overlay for mobile landscape */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex flex-col">
            {/* Overlay background */}
            <div
              className="bg-black/50 flex-1 animate-fadein"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            />
            {/* Sidebar drawer */}
            <aside className="w-72 bg-gray-900 text-white p-4 flex flex-col animate-slidein-left transition-all duration-700 rounded-3xl shadow-2xl border-2 border-blue-800 fixed top-0 left-0 h-full overflow-hidden">
              <nav className="flex-1 overflow-y-auto pr-2">
                <ul className="space-y-3">
                  {navItems.map((item) => (
                    <li key={item.name}>
                        <Link
                          to={item.path}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-800 text-white font-semibold transition-all duration-300 golden-frame truncate"
                          onClick={() => setSidebarOpen(false)}
                        >
                          {item.icon}
                          <span className="truncate">{item.name}</span>
                        </Link>
                      </li>
                  ))}
                </ul>
              </nav>
              <div className="pt-4 border-t border-blue-800 flex-shrink-0">
                <button
                  onClick={() => { setSidebarOpen(false); handleLogout(); }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border-2 border-red-300 logout-button font-semibold"
                >
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content (changes with nested routes) */}
          <main className="flex-1 p-2 md:p-10 transition-all duration-700 md:ml-76 flex flex-col h-auto min-h-screen">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-2 md:p-8 border-2 border-blue-200 w-full min-w-0 flex flex-col justify-start items-center overflow-auto mx-2 md:mx-8" style={{marginTop: 0}}>
            <Outlet />
          </div>
        </main>
        </div>
      </div> 
    </>
  );
}