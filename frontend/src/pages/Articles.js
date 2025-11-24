import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import SafeRichText from '../components/SafeRichText';


function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get((process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com') + '/api/articles')
      .then(res => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch articles.");
        setLoading(false);
      });
  }, []);

  // Article icons mapping
  const getArticleIcon = (category, index) => {
    const icons = {
      'insight': '💡',
      'news': '📰',
      'event': '📅',
      'research': '🔬',
      'update': '🔔',
      'default': ['📝', '📚', '📖', '🧠', '🌟', '🧩', '📈', '🗞️'][index % 8]
    };
    const categoryKey = category ? category.toLowerCase() : 'default';
    return icons[categoryKey] || icons['default'];
  };

  // Card animation variants (copied from Services)
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" }
    })
  };

  // Helper to download article file by fetching the backend file endpoint
  const downloadArticle = async (article) => {
    try {
      const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com');
      // article.article_url may be a relative path like '/api/articles/1/file' (set by backend).
      // Resolve it to the backend origin so the request goes to the backend (not the frontend dev server).
      let fileUrl = article.article_url || `${API_BASE}/api/articles/${article.id}/file`;
      if (fileUrl && fileUrl.startsWith('/')) {
        // avoid double slashes
        fileUrl = API_BASE.replace(/\/$/, '') + fileUrl;
      }
      const resp = await fetch(fileUrl);
      if (!resp.ok) throw new Error('Failed to download file');
  const arrayBuffer = await resp.arrayBuffer();
  const contentType = resp.headers.get('content-type') || 'application/octet-stream';
  const blob = new Blob([arrayBuffer], { type: contentType });
  const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const cd = resp.headers.get('content-disposition');
      let filename = article.title?.replace(/[^a-z0-9.-]/gi, '_') + '.pdf';
      if (cd) {
        // Try RFC5987: filename*=UTF-8''encoded
        let match = /filename\*=UTF-8''([^;\n]+)/i.exec(cd);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1].trim().replace(/"/g, ''));
        } else {
          // Fallback: filename="name.ext" or filename=name.ext
          match = /filename="?([^";]+)"?/i.exec(cd);
          if (match && match[1]) filename = match[1].trim();
        }
      }
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download article file.');
    }
  };

  return (
    <div className="w-full max-w-8xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 text-base sm:text-lg overflow-x-auto" style={{ background: 'rgba(245, 247, 255, 0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-slate-50" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto container">
            {/* Main Title */}
            <motion.h1 
              className="text-5xl font-poppins font-extrabold mb-12 text-center text-black tracking-wide" 
              style={{textShadow: '0 6px 32px rgba(0,0,0,0.45)'}}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-[#3F93E6]">Publications</span>
            </motion.h1>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/80 rounded-full shadow-lg border border-white/20">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-transparent mr-3"></div>
              <p className="text-xl font-medium text-black">Loading articles...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-red-50 rounded-full shadow-lg border border-red-200">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {articles.map((article, idx) => (
              <motion.div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => downloadArticle(article)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); downloadArticle(article); } }}
                className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center text-center shadow-xl border border-white/10 transition-all duration-500 h-[340px] group hover:shadow-2xl cursor-pointer"
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{
                  y: -20,
                  scale: 1.05,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)"
                }}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-3xl rounded-tr-3xl"></div>
                {/* Article icon */}
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl shadow-lg flex items-center justify-center mb-4 flex-none"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-2xl leading-none text-emerald-500" style={{fontSize: '1.25rem'}}>
                    {getArticleIcon(article.category, idx)}
                  </span>
                </motion.div>
                {/* Article Title */}
                <h2 className="text-2xl md:text-3xl font-poppins font-bold text-black mb-3 drop-shadow-sm group-hover:text-primary-500 transition-colors duration-300">
                  {article.title}
                </h2>
                {/* Article Date */}
                {article.date && (
                  <div className="bg-primary/10 text-primary-500 px-3 py-1 rounded-full font-medium text-base mb-4 border border-primary/30">
                    {article.date}
                  </div>
                )}
                {/* Article Excerpt */}
                <div className="text-black text-base md:text-base font-roboto flex-grow text-center leading-relaxed overflow-hidden">
                  <div className="max-h-[6.5rem] overflow-hidden text-ellipsis">
                    <SafeRichText content={article.content?.slice(0, 60) + '...'} />
                  </div>
                </div>
                {/* Read more indicator */}
                <motion.div 
                  className="mt-4 text-primary-500 font-medium text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                >
                  Read more →
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/10 rounded-2xl shadow-lg border border-white/10 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📰</span>
              </div>
              <h3 className="text-2xl font-poppins font-bold text-black mb-2">No Articles Yet</h3>
              <p className="text-black">Articles will be displayed here once they are added.</p>
            </div>
          </motion.div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Articles;
