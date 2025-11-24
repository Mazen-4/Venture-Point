
import React, { useEffect, useState, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { authAPI, advisorsAPI } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import SafeRichText from '../components/SafeRichText';
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';

export default function AdminAdvisors() {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', name: '', area_of_focus: '', bio: '' });
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', area_of_focus: '', bio: '' });
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [addImage, setAddImage] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsSuperAdmin(authAPI.hasRole('superadmin'));
    setIsAdmin(authAPI.hasRole('admin'));
  }, []);

  // Fetch advisors
  const fetchAdvisors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await advisorsAPI.getAdvisors();
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      // preload photos if any
      const withPhotos = await Promise.all(data.map(async (a) => {
        try {
          if (a.photo_url && a.photo_url.startsWith('/api/')) {
            const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';
            const url = a.photo_url.startsWith('/api/') ? (API_BASE + a.photo_url) : a.photo_url;
            const r = await fetch(url);
            if (!r.ok) return a;
            const blob = await r.blob();
            const obj = URL.createObjectURL(blob);
            return { ...a, _photoSrc: obj };
          }
        } catch (err) {
          // ignore preload errors
        }
        return a;
      }));
      setAdvisors(withPhotos);
    } catch (err) {
      setError(err.message || 'Failed to fetch advisors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvisors();
  }, [fetchAdvisors]);

  // Success message helper
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Add advisor handlers
  const handleAddInput = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };
  const handleAddImage = (e) => setAddImage(e.target.files[0]);
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      // If image present, use FormData
      let response;
      if (addImage) {
        const form = new FormData();
        form.append('name', addForm.name);
        form.append('area_of_focus', addForm.area_of_focus);
        form.append('bio', addForm.bio);
        form.append('photo', addImage);
        response = await advisorsAPI.createAdvisor(form, true);
      } else {
        const data = { name: addForm.name, area_of_focus: addForm.area_of_focus, bio: addForm.bio };
        response = await advisorsAPI.createAdvisor(data);
      }
      if (response.data?.success) {
        setShowAddModal(false);
        setAddForm({ name: '', area_of_focus: '', bio: '' });
        setAddImage(null);
        showSuccess('Advisor added successfully!');
        fetchAdvisors();
      } else {
        setAddError(response.data?.message || 'Failed to add advisor');
      }
    } catch (err) {
      setAddError(err.message || 'Failed to add advisor');
    } finally {
      setAddLoading(false);
    }
  };

  // Edit advisor handlers
  const handleEditClick = (advisor) => {
    setEditForm({
      id: advisor.id,
      name: advisor.name,
      area_of_focus: advisor.area_of_focus,
      bio: advisor.bio,
      photo_url: advisor.photo_url || '',
      _photoSrc: advisor._photoSrc || null
    });
    setEditImage(null);
    setShowEditModal(true);
    setEditError(null);
  };
  const handleEditImage = (e) => setEditImage(e.target.files[0]);
  const handleEditInput = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      let response;
      if (editImage) {
        const form = new FormData();
        form.append('name', editForm.name);
        form.append('area_of_focus', editForm.area_of_focus);
        form.append('bio', editForm.bio);
        form.append('photo', editImage);
        response = await advisorsAPI.updateAdvisor(editForm.id, form, true);
      } else {
        const data = { name: editForm.name, area_of_focus: editForm.area_of_focus, bio: editForm.bio };
        response = await advisorsAPI.updateAdvisor(editForm.id, data);
      }
      if (response.data?.success) {
        setShowEditModal(false);
        showSuccess('Advisor updated successfully!');
        fetchAdvisors();
      } else {
        setEditError(response.data?.message || 'Failed to update advisor');
      }
    } catch (err) {
      setEditError(err.message || 'Failed to update advisor');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete advisor
  const handleDeleteAdvisor = async (advisorId, advisorName) => {
    if (!isSuperAdmin) {
      alert('Access denied. Only superadmin can delete advisors.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete "${advisorName}"? This action cannot be undone.`);
    if (!confirmDelete) return;
    setDeleteLoading(advisorId);
    setError(null);
    try {
      await advisorsAPI.deleteAdvisor(advisorId);
      setAdvisors(prev => prev.filter(a => a.id !== advisorId));
      showSuccess('Advisor deleted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to delete advisor');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Logout
  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  // Permission logic
  const canEdit = isSuperAdmin || isAdmin;
  const canAdd = isSuperAdmin;
  const canDelete = isSuperAdmin;
  // ...existing code...
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-1 md:px-4 py-4 mt-2 landscape:px-8 landscape:py-8 flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center sm:items-start gap-4 sm:flex-row sm:justify-between mb-6 md:gap-0">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-2 text-center sm:text-left drop-shadow-lg">Advisors Management</h2>
        <div className="flex items-center gap-2 sm:gap-4 justify-center sm:justify-end">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isSuperAdmin ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>{isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'User'}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-red-300"
          >
            Logout
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {canAdd && (
        <button
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 font-medium"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Advisor
        </button>
      )}

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Add New Advisor</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={addForm.name}
                  onChange={handleAddInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Area of Focus</label>
                <input
                  type="text"
                  name="area_of_focus"
                  value={addForm.area_of_focus}
                  onChange={handleAddInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Bio</label>
                <Editor
                  apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                  value={addForm.bio}
                  onEditorChange={val => setAddForm(f => ({ ...f, bio: val }))}
                  init={{
                    height: 240,
                    menubar: false,
                    branding: false,
                    plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Photo</label>
                <input type="file" name="photo" accept="image/*" onChange={(e) => setAddImage(e.target.files[0])} className="w-full" />
                <div className="text-xs text-gray-500 mt-1">Optional: upload advisor photo (JPEG, PNG, WebP)</div>
              </div>
              {addError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                  {addError}
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  disabled={addLoading}
                >
                  {addLoading ? 'Adding...' : 'Add Advisor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Advisor</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Area of Focus</label>
                <input
                  type="text"
                  name="area_of_focus"
                  value={editForm.area_of_focus}
                  onChange={handleEditInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Bio</label>
                <Editor
                  apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                  value={editForm.bio}
                  onEditorChange={val => setEditForm(f => ({ ...f, bio: val }))}
                  init={{
                    height: 240,
                    menubar: false,
                    branding: false,
                    plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Photo</label>
                {editForm.photo_url && (
                  <div className="mb-3 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-2">Current Photo:</p>
                    <img
                      src={editForm._photoSrc ? editForm._photoSrc : (editForm.photo_url.startsWith('/') ? API_BASE + editForm.photo_url : editForm.photo_url)}
                      alt="Current"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                <input type="file" name="photo" accept="image/*" onChange={handleEditImage} className="w-full" />
                {editImage && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-300 rounded-lg">
                    <p className="text-sm font-medium text-blue-600 mb-2">New Photo Preview:</p>
                    <img src={URL.createObjectURL(editImage)} alt="New" className="h-32 w-32 object-cover rounded-lg border border-blue-300" />
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">Leave empty to keep the current photo</div>
              </div>
              {editError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                  {editError}
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  disabled={editLoading}
                >
                  {editLoading ? 'Updating...' : 'Update Advisor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 text-lg">Loading advisors...</div>
        </div>
      )}

      {!loading && (
  <div className="bg-white rounded-2xl shadow-2xl overflow-x-auto border-2 border-blue-200 w-full mx-2 md:mx-8">
          <table className="min-w-full text-sm md:text-base rounded-2xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Photo</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Name</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Area of Focus</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Bio</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {advisors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 px-4 text-center text-gray-500">
                    <div className="text-lg">No advisors found</div>
                    <div className="text-sm mt-1">Add your first advisor to get started!</div>
                  </td>
                </tr>
              ) : (
                advisors.map((advisor) => (
                  <tr key={advisor.id} className="hover:bg-blue-50 transition-colors">
                    <td className="py-4 px-4">
                      {advisor._photoSrc ? (
                        <img src={advisor._photoSrc} alt={advisor.name} className="h-12 w-12 object-cover rounded border" />
                      ) : advisor.photo_url ? (
                        <img src={(process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com') + advisor.photo_url} alt={advisor.name} className="h-12 w-12 object-cover rounded border" />
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No photo</div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">{advisor.name && advisor.name.length > 50 ? advisor.name.slice(0, 50) + '…' : advisor.name}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {advisor.area_of_focus && advisor.area_of_focus.length > 50 ? advisor.area_of_focus.slice(0, 50) + '…' : advisor.area_of_focus}
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate whitespace-pre-line break-words" title={advisor.bio}>
                      <SafeRichText content={advisor.bio && advisor.bio.length > 50 ? advisor.bio.slice(0, 50) + '…' : advisor.bio} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2 items-stretch justify-center">
                        {canEdit && (
                          <button
                            onClick={() => handleEditClick(advisor)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 text-base md:text-sm lg:text-base xl:text-lg"
                            style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}>
                            Edit
                          </button>
                        )}
                        {canDelete ? (
                          <button
                            onClick={() => handleDeleteAdvisor(advisor.id, advisor.name)}
                            disabled={deleteLoading === advisor.id}
                            className="px-3 py-1 bg-red-600 text-white rounded-xl hover:scale-105 shadow-lg disabled:opacity-50 transition-all duration-300 border border-red-700 text-base md:text-sm lg:text-base xl:text-lg"
                            style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}>
                            {deleteLoading === advisor.id ? 'Deleting...' : 'Delete'}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-1 bg-gray-400 text-white rounded-xl cursor-not-allowed text-base md:text-sm lg:text-base xl:text-lg"
                            title="Superadmin role required to delete advisors"
                            style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}>
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
      )}
    </div>
  );
}
