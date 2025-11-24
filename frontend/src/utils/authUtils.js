import axios from 'axios';
import api from '../apiReequest';
// Authors API methods
export const authorsAPI = {
  // Get all authors
  getAuthors: () => api.get('/authors'),

  // Get single author
  getAuthor: (id) => api.get(`/authors/${id}`),

  // Create author (admin/superadmin)
  createAuthor: (authorData) => api.post('/authors', authorData),

  // Update author (admin/superadmin)
  updateAuthor: (id, authorData) => api.put(`/authors/${id}`, authorData),

  // Delete author (superadmin only)
  deleteAuthor: (id) => api.delete(`/authors/${id}`)
};
// Member API methods
// Partner API methods
export const partnerAPI = {
  // Get all partners
  getPartners: () => api.get('/partners'),

  // Create partner (superadmin only)
  createPartner: (partnerData, isMultipart = false) => {
    if (isMultipart) {
      return api.post('/partners', partnerData);
    }
    return api.post('/partners', partnerData);
  },

  // Update partner (admin/superadmin)
  updatePartner: (id, partnerData, isMultipart = false) => {
    if (isMultipart) {
      return api.put(`/partners/${id}`, partnerData);
    }
    return api.put(`/partners/${id}`, partnerData);
  },

  // Delete partner (superadmin only)
  deletePartner: (id) => api.delete(`/partners/${id}`)

};

// Advisors API methods
export const advisorsAPI = {
  // Get all advisors
  getAdvisors: () => api.get('/advisors'),

  // Create advisor (superadmin only)
  createAdvisor: (advisorData, isMultipart = false) => {
    if (isMultipart) {
      return api.post('/advisors', advisorData);
    }
    return api.post('/advisors', advisorData);
  },

  // Update advisor (admin/superadmin)
  updateAdvisor: (id, advisorData, isMultipart = false) => {
    if (isMultipart) {
      return api.put(`/advisors/${id}`, advisorData);
    }
    return api.put(`/advisors/${id}`, advisorData);
  },

  // Delete advisor (superadmin only)
  deleteAdvisor: (id) => api.delete(`/advisors/${id}`)
};

// Member API methods
export const memberAPI = {
  // Get all members
  getMembers: () => api.get('/team'),

  // Create member (superadmin only)
  createMember: (memberData, isMultipart = false) => {
    if (isMultipart) {
      return api.post('/team', memberData);
    }
    return api.post('/team', memberData);
  },

  // Update member (admin/superadmin)
  updateMember: (id, memberData, isMultipart = false) => {
  if (isMultipart) {
    return api.put(`/team/${id}`, memberData);
  }
  return api.put(`/team/${id}`, memberData);
},

  // Delete member (superadmin only)
  deleteMember: (id) => api.delete(`/team/${id}`)
};
// Admin API methods
export const adminAPI = {
  // Get all admins
  getAdmins: () => api.get('/admins'),

  // Create admin
  createAdmin: ({ username, password, role }) => api.post('/admins', { username, password, role }),

  // Update admin
  updateAdmin: (id, { username, password, role }) => api.put(`/admins/${id}`, { username, password, role }),

  // Delete admin (requires superadmin)
  deleteAdmin: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.role !== 'superadmin') {
        throw new Error('Insufficient permissions. Superadmin role required.');
      }
      const response = await api.delete(`/admins/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Promote admin to superadmin
  promoteToSuperAdmin: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.role !== 'superadmin') {
        throw new Error('Insufficient permissions. Superadmin role required.');
      }
      const response = await api.put(`/admins/${id}`, { role: 'superadmin' });
      return response;
    } catch (error) {
      throw error;
    }
  }
};
// Article API methods
export const articleAPI = {
  // Get all articles
  getArticles: () => api.get('/articles'),

  // Get single article
  getArticle: (id) => api.get(`/articles/${id}`),

  // Create article
  createArticle: (articleData) => api.post('/articles', articleData),

  // Update article
  updateArticle: (id, articleData, isMultipart = false) => {
    if (isMultipart) {
      return api.put(`/articles/${id}`, articleData);
    }
    return api.put(`/articles/${id}`, articleData);
  },

  // Delete article (requires superadmin)
  deleteArticle: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      // Decode token to check role (optional verification)
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.role !== 'superadmin' && tokenPayload.role !== 'admin') {
        throw new Error('Insufficient permissions. Admin or Superadmin role required.');
      }
      const response = await api.delete(`/articles/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
// Event API methods
export const eventAPI = {
  // Get all events
  getEvents: () => api.get('/events'),

  // Get single event
  getEvent: (id) => api.get(`/events/${id}`),

  // Create event (supports multipart)
  createEvent: (eventData, isMultipart = false) => {
    if (isMultipart) {
      return api.post('/events', eventData);
    }
    return api.post('/events', eventData);
  },

  // Update event
  updateEvent: (id, eventData, isFormData = false) => {
    if (isFormData) {
      return api.put(`/events/${id}`, eventData);
    }
    return api.put(`/events/${id}`, eventData);
  },

  // Delete event (requires superadmin)
  deleteEvent: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      // Decode token to check role (optional verification)
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.role !== 'superadmin' && tokenPayload.role !== 'admin') {
        throw new Error('Insufficient permissions. Admin or Superadmin role required.');
      }
      const response = await api.delete(`/events/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
// Service API methods
export const serviceAPI = {
  // Get all services
  getServices: () => api.get('/services'),

  // Get single service
  getService: (id) => api.get(`/services/${id}`),

  // Create service
  createService: (serviceData) => api.post('/services', serviceData),

  // Update service
  updateService: (id, serviceData) => api.put(`/services/${id}`, serviceData),

  // Delete service (requires superadmin)
  deleteService: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      // Decode token to check role (optional verification)
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.role !== 'superadmin' && tokenPayload.role !== 'admin') {
        throw new Error('Insufficient permissions. Admin or Superadmin role required.');
      }
      const response = await api.delete(`/services/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
// Use shared axios instance from apiReequest.js (interceptors and defaults are configured there)

// Project API methods
export const projectAPI = {
  // Get all projects
  getProjects: () => api.get('/projects'),

  // Get single project
  getProject: (id) => api.get(`/projects/${id}`),

  // Create project (supports multipart FormData when isMultipart=true)
  createProject: (projectData, isMultipart = false) => {
    if (isMultipart) {
      return api.post('/projects', projectData);
    }
    return api.post('/projects', projectData);
  },

  // Update project (supports multipart FormData when isMultipart=true)
  updateProject: (id, projectData, isMultipart = false) => {
    if (isMultipart) {
      return api.put(`/projects/${id}`, projectData);
    }
    return api.put(`/projects/${id}`, projectData);
  },

  // Delete project (requires superadmin)
  deleteProject: async (id) => {
    try {
      console.log(`Attempting to delete project ${id}`);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      // Decode token to check role (optional verification)
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', tokenPayload);
      console.log('User role:', tokenPayload.role);
      if (tokenPayload.role !== 'superadmin' && tokenPayload.role !== 'admin') {
        throw new Error('Insufficient permissions. Admin or Superadmin role required.');
      }
      const response = await api.delete(`/projects/${id}`);
      console.log('Delete successful:', response.data);
      return response;
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  }
};

// Auth API methods
export const authAPI = {
  // Proactive auto-logout based on JWT expiration
  scheduleAutoLogout: () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return;
      const expMs = payload.exp * 1000;
      const nowMs = Date.now();
      const timeoutMs = expMs - nowMs;
      const showTimeoutMessage = () => {
        // You can replace alert with a custom modal if desired
        alert('Session timed out. Please login again.');
        authAPI.logout();
      };
      if (timeoutMs > 0) {
        setTimeout(showTimeoutMessage, timeoutMs);
      } else {
        showTimeoutMessage();
      }
    } catch (e) {
      // If token is invalid, logout immediately
      alert('Session timed out. Please login again.');
      authAPI.logout();
    }
  },
  login: (credentials) => api.post('/admin/login', credentials),
  register: (userData) => api.post('/admin/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  },

  // Upload image to /upload endpoint
  uploadImage: (formData) => {
    // Always use the deployed backend URL for uploads
    return axios.post('https://venturepoint-backend.onrender.com/upload', formData);
  },
  
  // Get current user info
  getCurrentUser: () => api.get('/auth/me'),
  
  // Check if user has required role
  hasRole: (requiredRole) => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === requiredRole;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }
};

export default api;