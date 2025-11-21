import React, { useState } from 'react';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// Import your logo if available
const logo = '/VPED-logo.png';


export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const response = await fetch((process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com') + '/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-sm sm:text-base overflow-x-auto flex flex-col items-center justify-center bg-gradient-to-br from-secondary-50 via-secondary-50 to-navy"
      style={{
        background: 'linear-gradient(to bottom right, rgba(248, 250, 252, 1), rgba(248, 250, 252, 1), rgba(47, 58, 54, 1))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
    >
      <div className="backdrop-blur-lg bg-secondary-50/80 border border-emerald-600 border-t-8 border-t-emerald-600 rounded-2xl shadow-lg w-full max-w-2xl p-8 animate-fadein" style={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border-2 border-emerald-600 bg-white p-3 flex items-center justify-center overflow-hidden">
                <img src={logo} alt="VPED Logo" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-navy mb-2">VPED Admin Login</h2>
            <p className="text-sm text-emerald-600">Access your admin dashboard</p>
          </div>
          <form className="space-y-6 bg-emerald-50 rounded-lg p-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-navy mb-1">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                    <FaUser />
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full pl-10 pr-4 py-2 border border-emerald-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-navy placeholder-text-muted bg-white"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-navy mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                    <FaLock />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-10 pr-4 py-2 border border-emerald-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-navy placeholder-text-muted bg-white"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-100 p-3">
                <div className="text-sm text-red-700 text-center">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 hover:text-white hover:scale-105 active:scale-95 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ transition: 'transform 0.2s, background 0.2s' }}
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
              ) : (
                <FaSignInAlt className="mr-2" />
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="mt-8 text-center text-text-secondary text-xs opacity-70">
            &copy; {new Date().getFullYear()} VPED. All rights reserved.
          </div>
        </div>
    </div>
  );
}