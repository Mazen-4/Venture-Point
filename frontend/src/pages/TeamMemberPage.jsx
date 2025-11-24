import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SafeRichText from "../components/SafeRichText";

export default function TeamMemberPage() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("ID from URL:", id); // Debug: Check what ID we're getting
    
    if (id) {
  axios.get(`${process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com'}/api/team/${id}`)
        .then(res => {
          console.log("API Response:", res.data); // Debug: Check what data we're getting
          setMember(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("API Error:", err); // Debug: Check for errors
          setError("Failed to fetch member details");
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="text-center py-16 text-slate-900 font-semibold">Loading...</div>;
  if (error) return <div className="text-center py-16 text-red-600 font-semibold">{error}</div>;
  if (!member) return <div className="text-center py-16 text-slate-900 font-semibold">Member not found</div>;

  // Debug: Log the member object
  console.log("Member object:", member);

  return (
    <div className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-sm sm:text-base overflow-x-auto" style={{ background: 'rgba(243, 249, 255, 0.9)', backdropFilter: 'blur(16px)', boxShadow: '0 10px 40px rgba(15, 23, 42, 0.15)' }}>
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-slate-50" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto container">
            <div className="flex flex-col items-center">
              <img
                src={member.photo_url || "/images/default-profile.png"}
                alt={member.name}
                className="w-56 h-56 object-cover rounded-full shadow-2xl mb-6 border-4 border-primary-300/40"
                onLoad={() => console.log(`Image loaded successfully for ${member.name}:`, member.photo_url)}
                onError={(e) => {
                  console.log(`Image failed to load for ${member.name}:`, member.photo_url);
                  e.target.src = '/images/default-profile.png';
                }}
              />
              <h1 className="text-4xl font-poppins font-extrabold text-primary-500 mb-2 drop-shadow-lg">
                {member.name}
              </h1>
              <h2 className="text-xl font-poppins text-slate-700 font-semibold mb-4 italic">
                {member.role}
              </h2>
              <div className="text-lg text-slate-900 max-w-2xl text-center leading-relaxed mb-8">
                <SafeRichText content={member.bio} />
              </div>
              
              {/* Display the details field */}
              <div className="max-w-4xl bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-primary-300/40 p-6 sm:p-8">
                <h3 className="text-2xl font-poppins font-bold text-primary-500 mb-4 text-center">
                  About {member.name}
                </h3>
                {member.details ? (
                  <div className="text-slate-900 leading-relaxed whitespace-pre-line text-justify">
                    <SafeRichText content={member.details} />
                  </div>
                ) : (
                  <div className="text-red-600 text-center font-semibold">
                    No member data found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}