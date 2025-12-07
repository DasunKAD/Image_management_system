import axios from 'axios';

const API_BASE_URL = 'https://your-api-url.com/api/v1'; // Replace with your API URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Service
const apiService = {
  // Authentication
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  // Get Medical History
  async getMedicalHistory() {
    try {
      const response = await api.get('/patient/medical-history');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Reports
  async getReports() {
    try {
      const response = await api.get('/patient/reports');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Appointments
  async getAppointments() {
    try {
      const response = await api.get('/patient/appointments');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update Profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/patient/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Download Report
  async downloadReport(reportId) {
    try {
      const response = await api.get(`/patient/reports/${reportId}/download`, {
        responseType: 'blob',
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default apiService;