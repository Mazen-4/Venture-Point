import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { authAPI, adminAPI, memberAPI, projectAPI, serviceAPI } from '../utils/authUtils';
import AdminAnalyticsChart from '../components/AdminAnalyticsChart';

console.log('DEBUG React object in AdminHome/AdminAnalyticsChart:', React);
console.log('DEBUG React.useRef exists:', React?.useRef);

export default function AdminHome() {
  const [stats, setStats] = useState({ admins: 0, members: 0, projects: 0, services: 0, events: 0, articles: 0 });
  const [user, setUser] = useState({ username: '', role: '' });


  useEffect(() => {
    // Fetch stats in parallel
    Promise.all([
      adminAPI.getAdmins().then(res => res.data.length).catch(() => 0),
      memberAPI.getMembers().then(res => res.data.length).catch(() => 0),
      projectAPI.getProjects().then(res => res.data.length).catch(() => 0),
      serviceAPI.getServices().then(res => res.data.length).catch(() => 0),
      (window.eventAPI ? window.eventAPI.getEvents() : import('../utils/authUtils').then(m => m.eventAPI.getEvents())).then(res => res.data.length).catch(() => 0),
      (window.articleAPI ? window.articleAPI.getArticles() : import('../utils/authUtils').then(m => m.articleAPI.getArticles())).then(res => res.data.length).catch(() => 0)
    ]).then(([admins, members, projects, services, events, articles]) => {
      setStats({ admins, members, projects, services, events, articles });
    });
  }, []);


  const cards = [
    {
      name: 'Admin Management',
      count: stats.admins,
      icon: '👤',
      link: '/admin/admin-management',
      color: 'bg-blue-50',
      accent: 'text-blue-700',
      desc: 'Manage admins and superadmins.'
    },
    {
      name: 'Members Management',
      count: stats.members,
      icon: '🧑‍💼',
      link: '/admin/members',
      color: 'bg-purple-50',
      accent: 'text-purple-700',
      desc: 'Edit founders, advisors, and team.'
    },
    {
      name: 'Services',
      count: stats.services,
      icon: '💼',
      link: '/admin/services',
      color: 'bg-green-50',
      accent: 'text-green-700',
      desc: 'Manage consulting and development services.'
    },
    {
      name: 'Projects',
      count: stats.projects,
      icon: '📁',
      link: '/admin/projects',
      color: 'bg-yellow-50',
      accent: 'text-yellow-700',
      desc: 'Track and update project information.'
    },
    {
      name: 'Events',
      count: stats.events,
      icon: '📅',
      link: '/admin/events',
      color: 'bg-pink-50',
      accent: 'text-pink-700',
      desc: 'Manage company events.'
    },
    {
      name: 'Articles',
      count: stats.articles,
      icon: '📰',
      link: '/admin/articles',
      color: 'bg-indigo-50',
      accent: 'text-indigo-700',
      desc: 'Publish and edit articles.'
    }
  ];

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-2 md:px-4 py-4 flex flex-col items-center justify-center">
      <header className="mb-8 w-full flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-2 drop-shadow-lg text-center">Admin Dashboard</h1>
        <p className="mt-2 text-gray-400 text-lg text-center">Here you can manage all aspects of VenturePoint.</p>
      </header>
      {/* Upcoming Events Section */}
      <div className="w-full flex justify-center mb-8">
        <UpcomingEventsSection />
      </div>
      <section className="mb-10 w-full flex justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 flex flex-col items-center w-full">
          <div className="w-full">
            <AdminAnalyticsChart />
          </div>
        </div>
      </section>
      <section
        className="flex flex-wrap gap-10 w-full max-w-5xl justify-center items-stretch"
      >
        {cards.map((card, idx) => (
          <Link
            to={card.link}
            key={card.name}
            className={`flex flex-col items-center justify-center ${card.color} rounded-2xl shadow-xl hover:shadow-emerald/40 p-4 sm:p-6 md:p-8 transition-all duration-500 group border-2 border-transparent hover:border-blue-300 w-64 h-72 md:w-80 md:h-80 text-center`}
            style={{ wordBreak: 'break-word', minWidth: '0' }}
          >
            <div className="flex flex-col items-center justify-center mb-4 w-full">
              <span className={`text-4xl md:text-5xl ${card.accent}`}>{card.icon}</span>
              {card.count !== undefined && <span className="text-xl md:text-2xl font-bold text-gray-700 mt-2">{card.count}</span>}
            </div>
            <h3 className={`font-bold text-base md:text-lg mb-2 ${card.accent} w-full text-center`}>{card.name}</h3>
            <p className="text-gray-600 mb-2 text-sm md:text-base w-full text-center" style={{wordBreak: 'break-word'}}>{card.desc}</p>
            <span className="text-blue-500 font-medium group-hover:underline mt-auto">Go to {card.name}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
// Helper component for upcoming events
function UpcomingEventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let res;
        if (window.eventAPI) {
          res = await window.eventAPI.getEvents();
        } else {
          const m = await import('../utils/authUtils');
          res = await m.eventAPI.getEvents();
        }
        setEvents(res.data || []);
        // Debug: log events data
        console.log('Fetched events:', res.data);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Show all upcoming events (any future date)
  const now = new Date();
  let upcoming = events.filter(ev => {
    const dateStr = ev.date || ev.event_date;
    if (!dateStr) return false;
    const eventDate = new Date(dateStr);
    if (isNaN(eventDate)) return false;
    return eventDate >= now;
  });
  // Sort by soonest event first
  upcoming = upcoming.sort((a, b) => {
    const aDate = new Date(a.date || a.event_date);
    const bDate = new Date(b.date || b.event_date);
    return aDate - bDate;
  });

  if (loading) return <section className="mb-6"><div className="text-gray-400">Loading upcoming events...</div></section>;

  return (
    <section className="mb-6">
      <div className="relative bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-200 overflow-hidden animate-fadein-slow">
        {/* No animated branding particles for a more professional look */}
        <h2 className="relative z-10 text-3xl font-extrabold text-gray-800 mb-4 flex items-center gap-3 animate-fadein">
          <span className="inline-block bg-blue-100 rounded-full p-3 text-3xl shadow">📅</span>
          Upcoming Events
        </h2>
        {upcoming.length === 0 ? (
          <div className="relative z-10 text-gray-400 text-lg font-medium py-6 text-center animate-fadein">No upcoming events found.</div>
        ) : (
          <ul className="relative z-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((ev, idx) => (
              <li
                key={ev.id || ev._id || ev.name}
                className="bg-white rounded-2xl shadow-lg hover:shadow-blue-200 transition-all duration-400 p-6 flex flex-col gap-2 border border-gray-200 hover:scale-[1.03] animate-fadein-up"
                style={{ animationDelay: `${0.1 * idx}s` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg text-gray-900 truncate drop-shadow-sm animate-fadein">
                    {ev.name || ev.title}
                  </span>
                  <div className="w-12 h-12 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden animate-pop-in">
                    {(ev.image_url || ev.image) ? (
                      <img
                        src={
                          (ev.image_url || ev.image).startsWith('http')
                            ? (ev.image_url || ev.image)
                            : 'https://venturepoint-backend.onrender.com/' + (ev.image_url || ev.image).replace(/^\/+/, '')
                        }
                        alt="event"
                        className="w-full h-full object-cover rounded-full"
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = '/images/default-profile.png';
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-2xl">🖼️</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 animate-fadein">
                  <span className="inline-block bg-gray-100 px-3 py-1 rounded text-gray-800 font-semibold shadow">
                    {(ev.date || ev.event_date) ? new Date(ev.date || ev.event_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'No date'}
                  </span>
                  {ev.location && <span className="ml-2 text-gray-500">{ev.location}</span>}
                </div>
                {ev.description && (
                  <div className="mt-2 text-gray-800 text-sm line-clamp-3 animate-fadein" dangerouslySetInnerHTML={{ __html: ev.description }} />
                )}
              </li>
            ))}
          </ul>
        )}
        {/* Animations */}
        <style>{`
          @keyframes fadein-slow { 0% { opacity: 0; transform: translateY(30px);} 100% { opacity: 1; transform: none; } }
          .animate-fadein-slow { animation: fadein-slow 1.2s cubic-bezier(.4,0,.2,1) both; }
          @keyframes fadein-up { 0% { opacity: 0; transform: translateY(40px);} 100% { opacity: 1; transform: none; } }
          .animate-fadein-up { animation: fadein-up 0.9s cubic-bezier(.4,0,.2,1) both; }
          @keyframes pop-in { 0% { transform: scale(0.7); opacity: 0.2; } 100% { transform: scale(1); opacity: 1; } }
          .animate-pop-in { animation: pop-in 0.7s cubic-bezier(.4,0,.2,1) both; }
          @keyframes fadein { 0% { opacity: 0;} 100% { opacity: 1;} }
          .animate-fadein { animation: fadein 1.1s both; }
        `}</style>
      </div>
    </section>
  );
}
