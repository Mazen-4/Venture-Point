import React, { useEffect, useState, useCallback } from 'react';
import { authAPI, adminAPI } from '../utils/authUtils';
import { Navigate, useNavigate } from 'react-router-dom';

export default function AdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ username: '', password: '', role: 'admin' });
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', username: '', password: '', role: 'admin' });
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Check user role on mount
  useEffect(() => {
    setIsSuperAdmin(authAPI.hasRole('superadmin'));
  }, []);

  // Fetch admins
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.getAdmins();
      setAdmins(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) fetchAdmins();
  }, [isSuperAdmin, fetchAdmins]);

  // Success message helper
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Add admin handlers
  const handleAddInput = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      await adminAPI.createAdmin(addForm);
      setShowAddModal(false);
  setAddForm({ username: '', password: '', role: 'admin' });
      showSuccess('Admin added successfully!');
      fetchAdmins();
    } catch (err) {
      setAddError(err.message || 'Failed to add admin');
    } finally {
      setAddLoading(false);
    }
  };

  // Edit admin handlers
  const handleEditClick = (admin) => {
    setEditForm({ id: admin.id, username: admin.username, password: '', role: admin.role });
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
      const { id, ...updateData } = editForm;
      await adminAPI.updateAdmin(id, updateData);
      setShowEditModal(false);
      showSuccess('Admin updated successfully!');
      fetchAdmins();
    } catch (err) {
      setEditError(err.message || 'Failed to update admin');
    } finally {
      setEditLoading(false);
    }
  };

  // Promote admin to superadmin
  const handlePromoteAdmin = async (adminId) => {
    try {
      await adminAPI.promoteToSuperAdmin(adminId);
      showSuccess('Admin promoted to superadmin!');
      fetchAdmins();
    } catch (err) {
      setError(err.message || 'Failed to promote admin');
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!isSuperAdmin) {
      alert('Access denied. Only superadmin can delete admins.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete "${adminName}"? This action cannot be undone.`);
    if (!confirmDelete) return;
    setDeleteLoading(adminId);
    setError(null);
    try {
      await adminAPI.deleteAdmin(adminId);
      setAdmins(prev => prev.filter(a => a.id !== adminId));
      showSuccess('Admin deleted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to delete admin');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Logout
  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
        <p className="text-gray-600">Only superadmins can view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-8 w-full max-w-screen-2xl mx-auto flex flex-col items-center sm:items-start justify-center sm:justify-start">
      <div className="w-full flex flex-col items-center sm:items-start gap-4 sm:flex-row sm:justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-2 text-center sm:text-left">Admin Management</h2>
        <div className="flex items-center gap-2 sm:gap-4 justify-center sm:justify-end">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isSuperAdmin ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-center w-full">
        <button
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 font-medium"
          style={{ width: 'auto', display: 'inline-block' }}
          onClick={() => setShowAddModal(true)}
        >
          + Add New Admin
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Add New Admin</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={addForm.username}
                  onChange={handleAddInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={addForm.password}
                  onChange={handleAddInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={addForm.role}
                  onChange={handleAddInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              {addError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                  {addError}
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors w-fit"
                  style={{maxWidth: '140px'}}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors w-fit"
                  style={{maxWidth: '140px'}}
                  disabled={addLoading}
                >
                  {addLoading ? 'Adding...' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Admin</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Password (leave blank to keep unchanged)</label>
                <input
                  type="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleEditInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditInput}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              {editError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                  {editError}
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors w-fit"
                  style={{maxWidth: '140px'}}
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors w-fit"
                  style={{maxWidth: '140px'}}
                  disabled={editLoading}
                >
                  {editLoading ? 'Updating...' : 'Update Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 text-lg">Loading...</div>
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 w-full -mx-2 sm:mx-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-base md:text-sm lg:text-base xl:text-lg text-center sm:text-left rounded-2xl overflow-hidden"
              style={{borderSpacing: 0, borderCollapse: 'separate'}}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 font-medium text-gray-700 text-center sm:text-left">Username</th>
                  <th className="py-3 px-4 font-medium text-gray-700 text-center sm:text-left">Role</th>
                  <th className="py-3 px-4 font-medium text-gray-700 text-center sm:text-left first:rounded-tl-2xl last:rounded-tr-2xl" style={{width: '120px'}}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 px-4 text-center sm:text-left text-gray-500">
                      <div className="text-lg">No admins found</div>
                      <div className="text-sm mt-1">Add your first admin to get started!</div>
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-blue-50 transition-colors text-center sm:text-left">
                      <td className="py-4 px-4 font-medium text-gray-900 text-center sm:text-left">{admin.username}</td>
                      <td className="py-4 px-4 text-center sm:text-left whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-semibold break-words sm:break-normal ${admin.role === 'superadmin' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}`} style={{wordBreak: 'break-word', lineHeight: '1.2'}}>
                          {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center sm:text-left" style={{width: '120px'}}>
                        <div className="flex flex-col gap-2 items-center sm:items-stretch justify-center sm:justify-start">
                          <button
                            onClick={() => handleEditClick(admin)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 text-base md:text-sm lg:text-base xl:text-lg"
                            style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
                          >
                            Edit
                          </button>
                          {admin.role !== 'superadmin' && (
                            <button
                              onClick={() => handlePromoteAdmin(admin.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-green-700 text-base md:text-sm lg:text-base xl:text-lg"
                              style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
                            >
                              Promote to Superadmin
                            </button>
                          )}
                          {isSuperAdmin ? (
                            <button
                              onClick={() => handleDeleteAdmin(admin.id, admin.username)}
                              disabled={deleteLoading === admin.id}
                              className="px-3 py-1 bg-red-600 text-white rounded-xl hover:scale-105 shadow-lg disabled:opacity-50 transition-all duration-300 border border-red-700 text-base md:text-sm lg:text-base xl:text-lg"
                              style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
                            >
                              {deleteLoading === admin.id ? 'Deleting...' : 'Delete'}
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-3 py-1 bg-gray-400 text-white rounded-xl cursor-not-allowed text-base md:text-sm lg:text-base xl:text-lg"
                              title="Superadmin role required to delete admins"
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