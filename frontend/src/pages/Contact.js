import { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import axios from "axios";
import { motion } from "framer-motion";
const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY; // Secure the API key

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

// Enhanced smooth scroll and animation functions
const scrollToElement = (elementId, additionalElementId = null) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // Add smooth scale and glow animation
    element.classList.add('animate-smooth-highlight');
    
    // If there's an additional element (for visit us), animate it too
    if (additionalElementId) {
      const additionalElement = document.getElementById(additionalElementId);
      if (additionalElement) {
        setTimeout(() => {
          additionalElement.classList.add('animate-smooth-highlight');
        }, 300); // Staggered effect
        
        setTimeout(() => {
          additionalElement.classList.remove('animate-smooth-highlight');
        }, 2000);
      }
    }
    
    // Remove animation class after animation completes
    setTimeout(() => {
      element.classList.remove('animate-smooth-highlight');
    }, 2000);
  }
};

const handleMessageUs = () => scrollToElement('email-container');
const handleCallUs = () => scrollToElement('phone-container');
const handleVisitUs = () => scrollToElement('address-container', 'map-container');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      await axios.post((process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com') + '/api/contact', formData);
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("Failed to send message. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };


  return (
  <div
    className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-base sm:text-lg overflow-x-auto"
    style={{
      background: 'rgba(255, 255, 255, 0.65)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    }}
  >
    <style>
      {`
      .animate-smooth-highlight {
        animation: smoothHighlight 2s ease-in-out;
        transform-origin: center;
      }
      
      @keyframes smoothHighlight {
        0% { 
          transform: scale(1);
          box-shadow: 0 0 0 rgba(46, 125, 50, 0);
        }
        25% { 
          transform: scale(1.02);
          box-shadow: 0 0 25px rgba(46, 125, 50, 0.4);
        }
        50% { 
          transform: scale(1.03);
          box-shadow: 0 0 30px rgba(46, 125, 50, 0.6);
        }
        75% { 
          transform: scale(1.02);
          box-shadow: 0 0 25px rgba(46, 125, 50, 0.4);
        }
        100% { 
          transform: scale(1);
          box-shadow: 0 0 0 rgba(46, 125, 50, 0);
        }
      }
      `}
    </style>
    <style>
      {`
      .animate-smooth-highlight {
        animation: smoothHighlight 2s ease-in-out;
        transform-origin: center;
      }
      
      @keyframes smoothHighlight {
        0% { 
          transform: scale(1);
          box-shadow: 0 0 0 rgba(46, 203, 143, 0);
        }
        25% { 
          transform: scale(1.02);
          box-shadow: 0 0 25px rgba(46, 203, 143, 0.4);
        }
        50% { 
          transform: scale(1.03);
          box-shadow: 0 0 30px rgba(46, 203, 143, 0.6);
        }
        75% { 
          transform: scale(1.02);
          box-shadow: 0 0 25px rgba(46, 203, 143, 0.4);
        }
        100% { 
          transform: scale(1);
          box-shadow: 0 0 0 rgba(46, 203, 143, 0);
        }
      }
      `}
    </style>
  <div className="min-h-screen relative overflow-hidden">
    <div className="fixed inset-0 bg-secondary-50" />

    <div className="relative z-10 container mx-auto py-16 px-6">
        {/* Main Title */}
        <motion.h1 
          className="text-5xl font-poppins font-extrabold mb-12 text-center text-primary-900 tracking-wide" 
          style={{textShadow: '0 6px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(46, 125, 50, 0.15)'}}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Get In <span className="text-emerald-600">Touch</span>
        </motion.h1>

        {/* Contact Content Grid */}
        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Contact Form */}
          <motion.div
            id="email-container"
            variants={itemVariants}
            className="relative bg-white/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden"
          >
            {/* Decorative top border removed */}
            
            {/* Form icon badge */}
            <div className="flex justify-center pt-8 pb-4">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-2xl shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-2xl font-extrabold text-white drop-shadow-lg">✉️</span>
              </motion.div>
            </div>

            <div className="px-8 pb-8">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-8 text-center text-navy">
                Send Us a <span className="text-emerald-600">Message</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {["name", "email", "subject"].map((field, index) => (
                  <motion.div 
                    key={field}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  >
                    <label
                      className="flex items-center text-navy font-semibold mb-2 text-base md:text-lg"
                      htmlFor={field}
                    >
                      <span className="mr-2 text-xl">
                        {field === "name" ? "👤" : field === "email" ? "📧" : "📝"}
                      </span>
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-white/80 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition-all duration-300 text-navy shadow-sm hover:shadow-md"
                      type={field === "email" ? "email" : "text"}
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      placeholder={`Enter your ${field}...`}
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <label
                    className="flex items-center text-navy font-semibold mb-2 text-sm md:text-base"
                    htmlFor="message"
                  >
                    <span className="mr-2 text-xl">💬</span>
                    Message:
                  </label>
                  <div className="bg-white/80 rounded-xl shadow-sm border-2 border-emerald-200 hover:shadow-md transition-all duration-300">
                    <Editor
                      apiKey={TINYMCE_API_KEY}
                      value={formData.message}
                      onEditorChange={val => setFormData(f => ({ ...f, message: val }))}
                      init={{
                        height: 450,
                        menubar: false,
                        branding: false,
                        plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
                        toolbar:
                          'undo redo | formatselect | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | help',
                        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; }'
                      }}
                    />
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-400 text-lg md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    Send Message
                  </span>
                </motion.button>

                {status && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`mt-4 p-3 rounded-xl text-center font-medium ${
                      status.includes("successfully") 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300" 
                        : status.includes("Sending") 
                        ? "bg-primary-50 text-primary-600 border border-primary-300" 
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    <span className="mr-2">
                      {status.includes("successfully") ? "✅" : status.includes("Sending") ? "⏳" : "❌"}
                    </span>
                    {status}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={itemVariants}
            className="relative bg-white/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden"
          >
            {/* Decorative top border removed */}
            
            {/* Info icon badge */}
            <div className="flex justify-center pt-8 pb-4">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-navy to-primary-600 rounded-2xl shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-2xl font-extrabold text-white drop-shadow-lg">📍</span>
              </motion.div>
            </div>

            <div className="px-8 pb-8">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-8 text-center text-navy">
                Contact <span className="text-emerald-600">Information</span>
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <motion.div 
                  id="email-container"
                  className="bg-white/80 rounded-2xl shadow-lg border border-emerald-200 p-6 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg shadow-md flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-white">📧</span>
                    </div>
                    <h3 className="text-xl font-poppins font-bold text-navy">Email</h3>
                  </div>
                  <a
                    href="mailto:info@VenturePoint-Egypt.com"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300 font-medium underline decoration-emerald-300 hover:decoration-emerald-500"
                  >
                    info@VenturePoint-Egypt.com
                  </a>
                </motion.div>

                {/* Phone */}
                <motion.div 
                  id="phone-container"
                  className="bg-white/80 rounded-2xl shadow-lg border border-primary-200 p-6 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg shadow-md flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-white">📞</span>
                    </div>
                    <h3 className="text-xl font-poppins font-bold text-navy">Phone</h3>
                  </div>
                  <p className="text-navy font-medium">
                    <span className="text-emerald-600">+201003400202</span> | <span className="text-primary-600">+1202-390-4405</span>
                  </p>
                </motion.div>

                {/* Address */}
                <motion.div 
                  id="address-container"
                  className="bg-white/80 rounded-2xl shadow-lg border border-secondary-300 p-6 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-navy to-navy/70 rounded-lg shadow-md flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-white">🏢</span>
                    </div>
                    <h3 className="text-xl font-poppins font-bold text-navy">Address</h3>
                  </div>
                  <p className="text-text-primary font-medium leading-relaxed">
                    Street 44, El-Nakheel Compound, First settlement, Cairo, Egypt
                  </p>
                </motion.div>

                {/* Google Maps */}
                <motion.div 
                  id="map-container"
                  className="bg-white/80 rounded-2xl shadow-lg border border-emerald-200 p-4 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-lg shadow-md flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-white">🗺️</span>
                    </div>
                    <h3 className="text-xl font-poppins font-bold text-navy">Location</h3>
                  </div>
                  <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg border-2 border-emerald-200">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.7928348515466!2d31.287651976522167!3d30.014104374938935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145838c95e5b91b7%3A0x96f5b164fc296c20!2sStreet%2044%2C%20Al%20Abageyah%2C%20El%20Mokattam%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1758036735234!5m2!1sen!2seg"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Company Location Map"
                      className="hover:brightness-110 transition-all duration-300"
                    ></iframe>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Additional Contact CTA */}
        <motion.div 
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden">
            {/* Decorative top border removed */}
            
            <div className="p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-poppins font-bold text-navy mb-4">
                Ready to Start Your <span className="text-emerald-600">Project?</span>
              </h3>
              <p className="text-base md:text-lg text-text-primary font-roboto leading-relaxed max-w-2xl mx-auto mb-6">
                We're here to help you achieve your goals. Reach out to us today and let's discuss how we can support your organization's growth and development initiatives.
              </p>
              
              {/* Contact methods summary */}
              {/* <div className="flex flex-wrap justify-center gap-4">
                <motion.button 
                  className="group bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-6 py-3 rounded-full font-medium text-sm border border-emerald-300 focus:outline-none transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                  onClick={handleMessageUs}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4 inline mr-2 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Message Us
                </motion.button>
                
                <motion.button 
                  className="group bg-primary-50 hover:bg-primary-100 text-primary-600 px-6 py-3 rounded-full font-medium text-sm border border-primary-300 focus:outline-none transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                  onClick={handleCallUs}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4 inline mr-2 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Call Us
                </motion.button>
                
                <motion.button 
                  className="group bg-navy/10 hover:bg-navy/20 text-navy px-6 py-3 rounded-full font-medium text-sm border border-navy/30 focus:outline-none transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                  onClick={handleVisitUs}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4 inline mr-2 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Visit Us
                </motion.button>
              </div> */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </div>
  );
}

export default Contact;