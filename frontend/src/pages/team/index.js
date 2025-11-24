import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SafeRichText from '../../components/SafeRichText';
// import { BrowserRouter } from "react-router-dom";


export default function TeamMemberPage() {
  const { slug } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';

    let active = true;
    const createdObjectUrls = [];

    async function load() {
      try {
        const res = await fetch(API_BASE + '/api/team');
        const data = await res.json();
        if (!active) return;

        // Preload binary photos served from the API and create object URLs
        await Promise.all(data.map(async (m) => {
          if (m && m.photo_url && (m.photo_url.startsWith('/api/') || m.photo_url.startsWith(API_BASE + '/api/'))) {
            try {
              const url = m.photo_url.startsWith('/api/') ? (API_BASE + m.photo_url) : m.photo_url;
              const r = await fetch(url);
              if (!r.ok) return;
              const blob = await r.blob();
              const obj = URL.createObjectURL(blob);
              m._photoSrc = obj;
              createdObjectUrls.push(obj);
            } catch (err) {
              // ignore individual photo failures
              console.debug('Failed to preload photo for', m.id, err);
            }
          }
        }));

        const found = data.find((m) => {
          const memberSlug = (m.name || '').toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return memberSlug === slug;
        });

        setMember(found);
        setLoading(false);
      } catch (err) {
        if (!active) return;
        setError("Failed to fetch team member.");
        setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
      // revoke created object URLs
      createdObjectUrls.forEach(u => URL.revokeObjectURL(u));
    };
  }, [slug]);

  if (loading) return <div className="py-16 text-center">Loading...</div>;
  if (error || !member) return <div className="py-16 text-center text-red-500">Team member not found.</div>;

  return (
    <div className="container mx-auto py-16 px-6">
      <div className="flex flex-col items-center">
        <img
          src={member._photoSrc || member.photo_url || "/images/default-profile.png"}
          alt={member.name}
          className="w-56 h-56 object-cover rounded-full shadow-2xl mb-6 border-4 border-emerald"
        />
        <h1 className="text-4xl font-poppins font-extrabold text-gold mb-2 drop-shadow-lg">{member.name}</h1>
        <h2 className="text-xl font-poppins text-emerald font-semibold mb-4 italic">{member.role}</h2>
  <div className="text-lg text-navy max-w-2xl text-center leading-relaxed mb-6"><SafeRichText content={member.bio} /></div>
        {typeof member.details !== 'undefined' && (
          <div className="w-full max-w-3xl bg-white/80 rounded-2xl shadow-xl border border-emerald/30 p-8 mt-4">
            <h3 className="text-2xl font-bold text-emerald font-poppins mb-3 text-center drop-shadow">Details</h3>
            <div className="text-base text-navy font-roboto leading-relaxed whitespace-pre-line text-center"><SafeRichText content={member.details || "No additional details available."} /></div>
          </div>
        )}
      </div>
    </div>
  );
}
