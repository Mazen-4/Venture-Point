import React, { useEffect, useState, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { authAPI, partnerAPI } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import SafeRichText from '../components/SafeRichText';

const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY; // Secure the API key

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', name: '', details: '' });
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', details: '' });
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsSuperAdmin(authAPI.hasRole('superadmin'));
    setIsAdmin(authAPI.hasRole('admin'));
  }, []);

  // Fetch partners
  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await partnerAPI.getPartners();
      setPartners(response.data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Success message helper
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Add partner handlers
  const handleAddInput = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const data = { name: addForm.name, details: addForm.details };
      const response = await partnerAPI.createPartner(data);
      if (response.data?.success) {
        setShowAddModal(false);
        setAddForm({ name: '', details: '' });
        showSuccess('Partner added successfully!');
        fetchPartners();
      } else {
        setAddError(response.data?.message || 'Failed to add partner');
      }
    } catch (err) {
      setAddError(err.message || 'Failed to add partner');
    } finally {
      setAddLoading(false);
    }
  };

  // Edit partner handlers
  const handleEditClick = (partner) => {
    setEditForm({ id: partner.id, name: partner.name, details: partner.details });
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
      const data = { name: editForm.name, details: editForm.details };
      const response = await partnerAPI.updatePartner(editForm.id, data);
      if (response.data?.success) {
        setShowEditModal(false);
        showSuccess('Partner updated successfully!');
        fetchPartners();
      } else {
        setEditError(response.data?.message || 'Failed to update partner');
      }
    } catch (err) {
      setEditError(err.message || 'Failed to update partner');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete partner
  const handleDeletePartner = async (partnerId, partnerName) => {
    if (!isSuperAdmin) {
      alert('Access denied. Only superadmin can delete partners.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete "${partnerName}"? This action cannot be undone.`);
    if (!confirmDelete) return;
    setDeleteLoading(partnerId);
    setError(null);
    try {
      await partnerAPI.deletePartner(partnerId);
      setPartners(prev => prev.filter(p => p.id !== partnerId));
      showSuccess('Partner deleted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to delete partner');
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

  return (
  <div className="w-full max-w-screen-2xl mx-auto px-1 md:px-4 py-4 mt-2 landscape:px-8 landscape:py-8 flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center sm:items-start gap-4 sm:flex-row sm:justify-between mb-6 md:gap-0">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-2 text-center sm:text-left drop-shadow-lg">Partners Management</h2>
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
          + Add New Partner
        </button>
      )}

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Add New Partner</h3>
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
                <label className="block mb-2 font-medium text-gray-700">Details</label>
                <Editor
                  apiKey={TINYMCE_API_KEY}
                  value={addForm.details}
                  onEditorChange={val => setAddForm(f => ({ ...f, details: val }))}
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
                  {addLoading ? 'Adding...' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Partner</h3>
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
                <label className="block mb-2 font-medium text-gray-700">Details</label>
                <Editor
                  apiKey={TINYMCE_API_KEY}
                  value={editForm.details}
                  onEditorChange={val => setEditForm(f => ({ ...f, details: val }))}
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
                  {editLoading ? 'Updating...' : 'Update Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 text-lg">Loading partners...</div>
        </div>
      )}

      {!loading && (
  <div className="bg-white rounded-2xl shadow-2xl overflow-x-auto border-2 border-blue-200 w-full mx-2 md:mx-8">
          <table className="min-w-full text-sm md:text-base rounded-2xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Name</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Details</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {partners.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 px-4 text-center text-gray-500">
                    <div className="text-lg">No partners found</div>
                    <div className="text-sm mt-1">Add your first partner to get started!</div>
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-blue-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {partner.name && partner.name.length > 50 ? partner.name.slice(0, 50) + '…' : partner.name}
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate whitespace-pre-line break-words" title={partner.details}>
                      <SafeRichText content={partner.details && partner.details.length > 50 ? partner.details.slice(0, 50) + '…' : partner.details} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2 items-stretch justify-center">
                        {canEdit && (
                          <button
                            onClick={() => handleEditClick(partner)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 text-base md:text-sm lg:text-base xl:text-lg"
                            style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}>
                            Edit
                          </button>
                        )}
                        {canDelete ? (
                          <button
                            onClick={() => handleDeletePartner(partner.id, partner.name)}
                            disabled={deleteLoading === partner.id}
                            className="px-3 py-1 bg-red-600 text-white rounded-xl hover:scale-105 shadow-lg disabled:opacity-50 transition-all duration-300 border border-red-700 text-base md:text-sm lg:text-base xl:text-lg"
                            style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}>
                            {deleteLoading === partner.id ? 'Deleting...' : 'Delete'}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-1 bg-gray-400 text-white rounded-xl cursor-not-allowed text-base md:text-sm lg:text-base xl:text-lg"
                            title="Superadmin role required to delete partners"
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
