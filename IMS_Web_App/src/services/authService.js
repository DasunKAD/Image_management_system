import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SSO_BASE_URL || ''; // Fallback to empty string if not defined
const API_CORE_URL = import.meta.env.VITE_CORE_BASE_URL || '';

const authService = {
  /**
   * Calls the login API endpoint to authenticate a user.
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise<object>} - A promise that resolves with the API response data.
   * @throws {Error} - Throws an error if the API call fails.
   */
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.token) {
        return response.data;
      } else {
        throw new Error('Invalid login response: JWT token missing.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Login API error data:', error.response.data);
        console.error('Login API error status:', error.response.status);
        throw new Error(error.response.data.message || 'Login failed due to server error.');
      } else if (error.request) {
        console.error('Login API request error:', error.request);
        throw new Error('No response received from login server. Please check your network connection.');
      } else {
        console.error('Error setting up login request:', error.message);
        throw new Error('An unexpected error occurred while preparing the login request.');
      }
    }
  },

  /**
   * Calls the registration API endpoint to register a new user.
   * @param {object} registrationData - The data for user registration (personal or company).
   * @returns {Promise<object>} - A promise that resolves with the API response data.
   * @throws {Error} - Throws an error if the API call fails.
   */
  register: async (registrationData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, registrationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        throw new Error(response.data.message || `Registration failed with status: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        console.error('Registration API error data:', error.response.data);
        console.error('Registration API error status:', error.response.status);
        throw new Error(error.response.data.message || 'Registration failed due to server error.');
      } else if (error.request) {
        console.error('Registration API request error:', error.request);
        throw new Error('No response received from registration server. Please check your network connection.');
      } else {
        console.error('Error setting up registration request:', error.message);
        throw new Error('An unexpected error occurred while preparing the registration request.');
      }
    }
  },

  /**
   * [NEW] Fetches the logged-in user's profile details.
   * @returns {Promise<object>} - A promise that resolves with profile data.
   * @throws {Error} - Throws an error if the API call fails.
   */
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_CORE_URL}/api/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch profile due to a server error.');
      } else if (error.request) {
        throw new Error('No response received from the profile server. Please check your network connection.');
      } else {
        throw new Error('An unexpected error occurred while fetching the profile.');
      }
    }
  },

  /**
   * [NEW] Uploads a profile picture.
   * @param {File} file - The image file to upload.
   * @returns {Promise<string>} - A promise that resolves with the new profile picture URL.
   * @throws {Error} - Throws an error if the API call fails.
   */
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file); // Assuming the API expects a 'file' key

      const response = await axios.post(
        `${API_CORE_URL}/api/profile/add/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Axios handles this with FormData, but good to be explicit
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      // MODIFIED: Parse the JSON response object to get the 'url' property
      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        // Handle cases where upload might "succeed" but not return a URL
        throw new Error(response.data.message || 'Profile picture upload succeeded but no URL was returned.');
      }

    } catch (error) {
      console.error('Error uploading profile picture:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to upload picture due to a server error.');
      } else if (error.request) {
        throw new Error('No response received from the server. Please check your network connection.');
      } else {
        throw new Error('An unexpected error occurred while uploading the picture.');
      }
    }
  }
};

export default authService;