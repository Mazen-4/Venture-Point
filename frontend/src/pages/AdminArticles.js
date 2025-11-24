import React, { useEffect, useState, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { authAPI, articleAPI } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import SafeRichText from '../components/SafeRichText';

// Add animation keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-modal-slide-up {
  animation: modalSlideUp 0.3s ease-out forwards;
}
`;

export default function AdminArticles() {
  // =======================
  // State Declarations
  // =======================
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    title: '',
    content: '',
    author_name: '',
    created_at: ''
  });
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    content: '',
    author_name: '',
    created_at: ''
  });
  // Helper to get API URL (use deployed backend if not localhost)
  const getApiUrl = (path) => {
    const backend =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? (process.env.REACT_APP_API_BASE_URL || '')
        : 'https://venturepoint-backend.onrender.com';
    return backend ? backend + path : path;
  };
  // Authors state
  const [authors, setAuthors] = useState([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const [authorsError, setAuthorsError] = useState(null);
  const [newAuthor, setNewAuthor] = useState('');
  const [showAddAuthor, setShowAddAuthor] = useState(false);
  // Fetch authors from backend
  const fetchAuthors = useCallback(async (newlyAddedAuthor) => {
    setAuthorsLoading(true);
    setAuthorsError(null);
    try {
      const res = await fetch(getApiUrl('/api/authors'));
      if (!res.ok) throw new Error('Failed to fetch authors');
      const data = await res.json();
      console.log('Authors API response:', data);
  const names = Array.isArray(data.data) ? data.data.map(a => a.name) : [];
  setAuthors(names);
      // If a new author was just added, select it
      if (newlyAddedAuthor && names.includes(newlyAddedAuthor)) {
        if (showAddModal) {
          setAddForm(f => ({ ...f, author_name: newlyAddedAuthor }));
        }
        if (showEditModal) {
          setEditForm(f => ({ ...f, author_name: newlyAddedAuthor }));
        }
      }
    } catch (err) {
      setAuthorsError(err.message || 'Failed to fetch authors');
      console.error('Authors fetch error:', err);
    } finally {
      setAuthorsLoading(false);
    }
  }, [showAddModal, showEditModal]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editFile, setEditFile] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // =======================
  // Helper Functions
  // =======================
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const checkUserRole = () => {
    try {
      const hasSuperAdminRole = authAPI.hasRole('superadmin');
      setIsSuperAdmin(hasSuperAdminRole);
    } catch (err) {
      setIsSuperAdmin(false);
    }
  };

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await articleAPI.getArticles();
      setArticles(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        authAPI.logout();
        navigate('/admin/login');
      } else {
        setError(err.message || 'Failed to fetch articles');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkUserRole();
    fetchArticles();
  }, [fetchArticles]);

  // =======================
  // Form Handlers
  // =======================
  const handleAddInput = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddAuthor = async (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (!newAuthor || authors.includes(newAuthor)) {
      setShowAddAuthor(false);
      setNewAuthor('');
      return;
    }
    try {
      const res = await fetch(getApiUrl('/api/authors'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newAuthor })
      });
      let apiResult = null;
      try {
        apiResult = await res.json();
      } catch (jsonErr) {
        console.error('Failed to parse add author response:', jsonErr);
      }
      console.log('Add author API response:', apiResult);
      if (!res.ok) {
        throw new Error((apiResult && apiResult.error) || 'Failed to add author');
      }
      await fetchAuthors(newAuthor);
      // Explicitly set the new author in the correct form after fetchAuthors
      if (showAddModal) {
        setAddForm(f => ({ ...f, author_name: newAuthor }));
      }
      if (showEditModal) {
        setEditForm(f => ({ ...f, author_name: newAuthor }));
      }
      setShowAddAuthor(false);
      setNewAuthor('');
    } catch (err) {
      setAuthorsError(err.message || 'Failed to add author');
      console.error('Add author error:', err);
      setShowAddAuthor(false);
      setNewAuthor('');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      await articleAPI.createArticle(addForm);
      setShowAddModal(false);
      setAddForm({ title: '', content: '', author_name: '', created_at: '' });
      showSuccess('Article added successfully!');
      fetchArticles();
    } catch (err) {
      setAddError(err.message || 'Failed to add article');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditClick = (article) => {
    setEditForm({
      id: article.id,
      title: article.title,
      content: article.content,
      author_name: article.author_name || '',
      created_at: article.created_at ? article.created_at.slice(0, 10) : ''
    });
    setShowEditModal(true);
    setEditError(null);
  };

  const handleEditInput = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      // If a new file is attached, submit multipart/form-data
      if (editFile) {
        const fd = new FormData();
        // append textual fields
        Object.keys(editForm).forEach(k => {
          if (k !== 'id') fd.append(k, editForm[k]);
        });
        fd.append('article_pdf', editFile, editFile.name);
        await articleAPI.updateArticle(editForm.id, fd, true);
      } else {
        await articleAPI.updateArticle(editForm.id, editForm);
      }
      setShowEditModal(false);
      showSuccess('Article updated successfully!');
      fetchArticles();
    } catch (err) {
      setEditError(err.message || 'Failed to update article');
    } finally {
      setEditLoading(false);
      setEditFile(null);
    }
  };

  const handleDeleteArticle = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the article "${title}"?`)) return;
    setDeleteLoading(id);
    try {
      await articleAPI.deleteArticle(id);
      showSuccess('Article deleted successfully!');
      fetchArticles();
    } catch (err) {
      setError(err.message || 'Failed to delete article');
    } finally {
      setDeleteLoading(null);
    }
  };

  // =======================
  // Render
  // =======================
  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 w-full max-w-[1920px] mx-auto flex flex-col items-center justify-center gap-4 min-h-[calc(100vh-4rem)]">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-4 lg:mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 text-center sm:text-left tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Articles</span>
        </h2>
        <div className="flex items-center gap-2 sm:gap-4 justify-center sm:justify-end">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isSuperAdmin ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </span>
          <button
            onClick={() => { authAPI.logout(); navigate('/admin/login'); }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100/80 backdrop-blur-sm border border-green-300 text-green-700 rounded-xl shadow-sm animate-fadeIn flex items-center gap-2">
          <span className="text-lg">✓</span>
          <span>{successMessage}</span>
        </div>
      )}
      {authorsError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          Error loading authors: {authorsError}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <button
        className="mb-4 lg:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:scale-105 hover:shadow-xl shadow-lg transition-all duration-300 font-medium text-sm sm:text-base"
        onClick={() => setShowAddModal(true)}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">+</span>
          <span>Add New Article</span>
        </span>
      </button>
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 sm:p-6 md:p-8">
          <div className="bg-white/95 p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-blue-100 animate-modal-slide-up">
            <h3 className="text-xl font-bold mb-4">Add New Article</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={addForm.title}
                  onChange={handleAddInput}
                  className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Content</label>
                <Editor
                  apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                  value={addForm.content}
                  onEditorChange={val => setAddForm(f => ({ ...f, content: val }))}
                  init={{
                    height: 440,
                    menubar: false,
                    branding: false,
                    plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help'
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Author</label>
                <div className="flex gap-2 items-center">
                  <select
                    name="author_name"
                    value={addForm.author_name}
                    onChange={handleAddInput}
                    className="w-full border border-blue-400 bg-blue-50 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-all duration-200 text-gray-800 font-semibold hover:bg-blue-100"
                    required
                  >
                    <option value="" disabled>Select author</option>
                    {authorsLoading ? (
                      <option>Loading...</option>
                    ) : authors.length === 0 ? (
                      <option disabled>No authors found</option>
                    ) : (
                      authors.map((author, idx) => (
                        <option key={idx} value={author}>{author}</option>
                      ))
                    )}
                  </select>
                  <button
                    type="button"
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => setShowAddAuthor(true)}
                  >
                    + Add Author
                  </button>
                </div>
              </div>
              {/* Move add-author input outside the form to prevent nested form issues */}
              {showAddAuthor && (
                <div className="flex gap-2 mt-2 mb-4">
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    className="flex-1 border border-gray-300 px-2 py-1 rounded"
                    placeholder="New author name"
                    required
                  />
                  <button
                    type="button"
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                    onClick={handleAddAuthor}
                  >Add</button>
                  <button type="button" className="px-2 py-1 bg-gray-400 text-white rounded" onClick={() => { setShowAddAuthor(false); setNewAuthor(''); }}>Cancel</button>
                </div>
              )}
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Created At</label>
                <input
                  type="date"
                  name="created_at"
                  value={addForm.created_at}
                  onChange={handleAddInput}
                  className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white"
                />
              </div>
              {addError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                  {addError}
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className={`px-3 py-1 bg-gray-400 text-white rounded-xl ${addLoading ? 'cursor-not-allowed' : 'hover:bg-gray-500'}`}
                  onClick={() => {
                    setShowAddModal(false);
                    setAddError(null);
                  }}
                  disabled={addLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700"
                  style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
                  disabled={addLoading}
                >
                  {addLoading ? 'Adding...' : 'Add Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 sm:p-6 md:p-8">
          <div className="bg-white/95 p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-blue-100 animate-modal-slide-up">
            <h3 className="text-xl font-bold mb-4">Edit Article</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Content</label>
                <Editor
                  apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                  value={editForm.content}
                  onEditorChange={val => setEditForm(f => ({ ...f, content: val }))}
                  init={{
                    height: 440,
                    menubar: false,
                    branding: false,
                    plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help'
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Author</label>
                <div className="flex gap-2 items-center">
                  <select
                    name="author_name"
                    value={editForm.author_name}
                    onChange={handleEditInput}
                    className="w-full border border-blue-400 bg-blue-50 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-all duration-200 text-gray-800 font-semibold hover:bg-blue-100"
                    required
                  >
                    <option value="" disabled>Select author</option>
                    {authorsLoading ? (
                      <option>Loading...</option>
                    ) : authors.length === 0 ? (
                      <option disabled>No authors found</option>
                    ) : (
                      authors.map((author, idx) => (
                        <option key={idx} value={author}>{author}</option>
                      ))
                    )}
                  </select>
                  <button
                    type="button"
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => setShowAddAuthor(true)}
                  >
                    + Add Author
                  </button>
                </div>
                {showAddAuthor && (
                  <div className="flex gap-2 mt-2 mb-4">
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={e => setNewAuthor(e.target.value)}
                      className="flex-1 border border-gray-300 px-2 py-1 rounded"
                      placeholder="New author name"
                      required
                    />
                    <button
                      type="button"
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                      onClick={handleAddAuthor}
                    >Add</button>
                    <button type="button" className="px-2 py-1 bg-gray-400 text-white rounded" onClick={() => { setShowAddAuthor(false); setNewAuthor(''); }}>Cancel</button>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Created At</label>
                <input
                  type="date"
                  name="created_at"
                  value={editForm.created_at}
                  onChange={handleEditInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Attach Document (PDF / DOCX / DOC / TXT)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => setEditFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">If you upload a document it will replace any existing document stored in the database.</p>
              </div>
              {editError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                  {editError}
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className={`px-3 py-1 bg-gray-400 text-white rounded-xl ${editLoading ? 'cursor-not-allowed' : 'hover:bg-gray-500'}`}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditError(null);
                  }}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700"
                  style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
                  disabled={editLoading}
                >
                  {editLoading ? 'Updating...' : 'Update Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500 text-lg bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-sm border border-gray-200/50">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading articles...</span>
          </div>
        </div>
      )}
      {!loading && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-200/50 w-full hover:shadow-2xl transition-all duration-300">
          <div className="min-w-full overflow-x-auto">
            <table className="w-full text-sm md:text-base lg:text-lg rounded-2xl overflow-hidden border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider bg-gray-50/80">Title</th>
                <th className="py-4 px-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider bg-gray-50/80">Content</th>
                <th className="py-4 px-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider bg-gray-50/80">Author</th>
                <th className="py-4 px-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider bg-gray-50/80">Created At</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 px-4 text-center text-gray-500">
                    <div className="text-lg">No articles found</div>
                    <div className="text-sm mt-1">Add your first article to get started!</div>
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-blue-50/50 transition-all duration-200 group">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {article.title && article.title.length > 50 ? article.title.slice(0, 50) + '…' : article.title}
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate whitespace-pre-line break-words" title={article.content}>
                      <SafeRichText content={article.content && article.content.length > 50 ? article.content.slice(0, 50) + '…' : article.content} />
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">{article.author_name}</td>
                    <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">{article.created_at ? article.created_at.slice(0, 10) : ''}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2 items-stretch justify-center">
                        <button
                          onClick={() => handleEditClick(article)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 text-base md:text-sm lg:text-base xl:text-lg"
                          style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
                        >
                          Edit
                        </button>
                        {isSuperAdmin ? (
                          <button
                            onClick={() => handleDeleteArticle(article.id, article.title)}
                            disabled={deleteLoading === article.id}
                            className="px-3 py-1 bg-red-600 text-white rounded-xl hover:scale-105 shadow-lg disabled:opacity-50 transition-all duration-300 border border-red-700 text-base md:text-sm lg:text-base xl:text-lg"
                            style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
                          >
                            {deleteLoading === article.id ? 'Deleting...' : 'Delete'}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl transition-colors duration-200 text-sm sm:text-base text-base md:text-sm lg:text-base xl:text-lg"
                            title="Superadmin role required to delete articles"
                            style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}