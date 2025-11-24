import React, { useEffect, useState, useCallback } from 'react';
import { authAPI, projectAPI } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import SafeRichText from '../components/SafeRichText';
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';
const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY; // Secure the API key

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  // Add Project Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    region: '',
    start_date: '',
    end_date: ''
  });
  const [addImage, setAddImage] = useState(null);
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  // Edit Project Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    description: '',
    region: '',
    start_date: '',
    end_date: ''
  });
  const [editImage, setEditImage] = useState(null);
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  
  // Delete States
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Success Messages
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const checkUserRole = () => {
    try {
      const hasSuperAdminRole = authAPI.hasRole('superadmin');
      setIsSuperAdmin(hasSuperAdminRole);
      console.log('User is superadmin:', hasSuperAdminRole);
    } catch (err) {
      console.error('Error checking user role:', err);
      setIsSuperAdmin(false);
    }
  };

  // Fetch projects with authentication
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectAPI.getProjects();
      const data = response.data || [];
      const withImages = await preloadProjectImages(data);
      setProjects(withImages);
    } catch (err) {
      console.error('Error fetching projects:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        authAPI.logout();
        navigate('/admin/login');
      } else {
        setError(err.message || 'Failed to fetch projects');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const preloadProjectImages = async (projectsList) => {
    const updated = await Promise.all(projectsList.map(async (p) => {
      try {
        if (p.image_url && (p.image_url.startsWith('/api/') || p.image_url.startsWith(API_BASE + '/api/'))) {
          const url = p.image_url.startsWith('/api/') ? (API_BASE + p.image_url) : p.image_url;
          const r = await fetch(url);
          if (!r.ok) return p;
          const blob = await r.blob();
          const obj = URL.createObjectURL(blob);
          return { ...p, _imageSrc: obj };
        }
      } catch (err) {
        // ignore
      }
      return p;
    }));
    return updated;
  };

  useEffect(() => {
    checkUserRole();
    fetchProjects();
  }, [fetchProjects]);

  const resolveProjectImageUrl = (project) => {
    if (!project || !project.image_url) return null;
    // prefer preloaded _imageSrc
    if (project._imageSrc) return project._imageSrc;
    const u = project.image_url;
    if (u.startsWith('blob:') || u.startsWith('data:')) return u;
    if (u.startsWith('/api/')) return API_BASE + u;
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith('/images/')) return API_BASE + u;
    if (!isNaN(Number(u))) {
      // legacy uploads table id
      return `${API_BASE}/image/${u}`;
    }
    return null;
  };

  // Show success message helper
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle add form input
  const handleAddInput = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddImage = (e) => {
    setAddImage(e.target.files[0]);
  };

  // Handle add form submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      if (addImage && addImage.size > 100 * 1024 * 1024) {
        setAddError('Image is too big. Please upload an image less than 100 MB.');
        setAddLoading(false);
        return;
      }
      // send multipart FormData directly to /api/projects so backend can store image
      const formData = new FormData();
      formData.append('name', addForm.name);
      formData.append('description', addForm.description);
      formData.append('region', addForm.region);
      formData.append('start_date', addForm.start_date);
      formData.append('end_date', addForm.end_date);
      if (addImage) formData.append('image', addImage);
      await projectAPI.createProject(formData, true);
      setShowAddModal(false);
      setAddForm({
        name: '',
        description: '',
        region: '',
        start_date: '',
        end_date: ''
      });
      setAddImage(null);
      showSuccess('Project added successfully!');
      fetchProjects();
    } catch (err) {
      setAddError(err.message || 'Failed to add project');
    } finally {
      setAddLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (project) => {
    setEditForm({
      id: project.id,
      name: project.name,
      description: project.description,
      region: project.region,
      start_date: project.start_date ? project.start_date.slice(0, 10) : '',
      end_date: project.end_date ? project.end_date.slice(0, 10) : '',
      image_url: project.image_url || '',
      _imageSrc: project._imageSrc || null
    });
    setShowEditModal(true);
    setEditError(null);
  };

  const handleEditImage = (e) => {
    setEditImage(e.target.files[0]);
  };

  // Handle edit form input
  const handleEditInput = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Handle edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      if (editImage && editImage.size > 100 * 1024 * 1024) {
        setEditError('Image is too big. Please upload an image less than 100 MB.');
        setEditLoading(false);
        return;
      }
      // use FormData for updates when an image is included
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('region', editForm.region);
      formData.append('start_date', editForm.start_date);
      formData.append('end_date', editForm.end_date);
      if (editImage) formData.append('image', editImage);
      await projectAPI.updateProject(editForm.id, formData, !!editImage);
      setShowEditModal(false);
      setEditImage(null);
      showSuccess('Project updated successfully!');
      fetchProjects();
    } catch (err) {
      setEditError(err.message || 'Failed to update project');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete - FIXED: Proper implementation with superadmin check
  const handleDeleteProject = async (projectId, projectName) => {
    // Check if user is superadmin before allowing delete
    if (!isSuperAdmin) {
      alert('Access denied. Only superadmin can delete projects.');
      return;
    }

    // Double confirmation for delete
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    setDeleteLoading(projectId);
    setError(null);

    try {
      console.log('Attempting to delete project:', projectId);
      await projectAPI.deleteProject(projectId);
      
      // Remove project from local state immediately for better UX
      setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
      
      showSuccess('Project deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      
      if (error.response?.status === 403) {
        setError('Access denied. Superadmin role required to delete projects.');
      } else if (error.response?.status === 404) {
        setError('Project not found.');
      } else if (error.response?.status === 401) {
        setError('Please log in again.');
        authAPI.logout();
        navigate('/admin/login');
      } else {
        setError(error.message || 'Failed to delete project');
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  // Logout function
  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  return (
  <div className="w-full max-w-screen-2xl mx-auto px-1 md:px-4 py-4 landscape:px-8 landscape:py-8 flex flex-col items-center justify-center bg-transparent">
    <div className="w-full flex flex-col items-center sm:items-start gap-4 sm:flex-row sm:justify-between mb-6">
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-2 text-center sm:text-left">Manage Projects</h2>
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
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      <button
        className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 font-medium"
        onClick={() => setShowAddModal(true)}
      >
        + Add New Project
      </button>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Add New Project</h3>
            <form onSubmit={handleAddSubmit}>
              {addError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
                  {addError}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={addForm.name}
                  onChange={handleAddInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Editor
                  apiKey={TINYMCE_API_KEY}
                  value={addForm.description}
                  onEditorChange={val => setAddForm(f => ({ ...f, description: val }))}
                  init={{
                    height: 420,
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <input
                  type="text"
                  name="region"
                  value={addForm.region}
                  onChange={handleAddInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={addForm.start_date}
                  onChange={handleAddInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                <input
                  type="date"
                  name="end_date"
                  value={addForm.end_date}
                  onChange={handleAddInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleAddImage}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {addLoading ? 'Adding...' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Project</h3>
            <form onSubmit={handleEditSubmit}>
              {editError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
                  {editError}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Editor
                  apiKey={TINYMCE_API_KEY}
                  value={editForm.description}
                  onEditorChange={val => setEditForm(f => ({ ...f, description: val }))}
                  init={{
                    height: 420,
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <input
                  type="text"
                  name="region"
                  value={editForm.region}
                  onChange={handleEditInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={editForm.start_date}
                  onChange={handleEditInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                <input
                  type="date"
                  name="end_date"
                  value={editForm.end_date}
                  onChange={handleEditInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
                {editForm.image_url && (
                  <div className="mb-3 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-2">Current Image:</p>
                    <img
                      src={editForm._imageSrc ? editForm._imageSrc : resolveProjectImageUrl(editForm)}
                      alt="Current"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleEditImage}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {editImage && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-300 rounded-lg">
                    <p className="text-sm font-medium text-blue-600 mb-2">New Image Preview:</p>
                    <img
                      src={URL.createObjectURL(editImage)}
                      alt="New"
                      className="h-32 w-32 object-cover rounded-lg border border-blue-300"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {editLoading ? 'Updating...' : 'Update Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 text-lg">Loading projects...</div>
        </div>
      )}

      {!loading && (
  <div className="bg-white rounded-2xl shadow-2xl overflow-x-auto border-2 border-blue-200 w-full mr-4">
          <table className="min-w-full text-sm md:text-base rounded-2xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-navy">Name</th>
                <th className="py-3 px-4 text-left font-semibold text-navy">Description</th>
                <th className="py-3 px-4 text-left font-semibold text-navy">Region</th>
                <th className="py-3 px-4 text-left font-semibold text-navy">Start Date</th>
                <th className="py-3 px-4 text-left font-semibold text-navy">End Date</th>
                <th className="py-3 px-4 text-left font-semibold text-navy">Image</th>
                <th className="py-3 px-4 text-left font-semibold text-navy">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 px-4 text-center text-gray-500">
                    <div className="text-lg">No projects found</div>
                    <div className="text-sm mt-1">Add your first project to get started!</div>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-blue-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {project.name && project.name.length > 50 ? project.name.slice(0, 50) + '…' : project.name}
                    </td>
                    <td className="py-4 px-4 max-w-xs break-words" title={project.description}>
                      <SafeRichText content={project.description && project.description.length > 50 ? project.description.slice(0, 50) + '…' : project.description} />
                    </td>
                    <td className="py-4 px-4 text-gray-700">{project.region}</td>
                    <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{project.start_date ? project.start_date.split('T')[0] : ''}</td>
                    <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{project.end_date ? project.end_date.split('T')[0] : 'Ongoing'}</td>
                    <td className="py-4 px-4">
                      {resolveProjectImageUrl(project) ? (
                        <img 
                          src={resolveProjectImageUrl(project)}
                          alt="Project" 
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2 items-stretch justify-center">
                        <button
                          onClick={() => handleEditClick(project)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 text-base md:text-sm lg:text-base xl:text-lg"
                          style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
                        >
                          Edit
                        </button>
                        {isSuperAdmin ? (
                          <button
                            onClick={() => handleDeleteProject(project.id, project.name)}
                            disabled={deleteLoading === project.id}
                            className="px-3 py-1 bg-red-600 text-white rounded-xl hover:scale-105 shadow-lg disabled:opacity-50 transition-all duration-300 border border-red-700 text-base md:text-sm lg:text-base xl:text-lg"
                            style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
                          >
                            {deleteLoading === project.id ? 'Deleting...' : 'Delete'}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-1 bg-gray-400 text-white rounded-xl cursor-not-allowed text-base md:text-sm lg:text-base xl:text-lg"
                            title="Superadmin role required to delete projects"
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
      )}
    </div>
  );
}