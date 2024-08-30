// src/axiosClient.js
import axios from 'axios';
import { auth, waitForFirebaseAuth } from './lib/firebase';

const isDev = true; // Toggle this to `false` for production
const getFirebaseToken = async () => {
  await waitForFirebaseAuth(); // Ensure Firebase is initialized and the auth state is set
  if (auth.currentUser) {
    try {
      return await auth.currentUser.getIdToken();
    } catch (error) {
      console.error('Failed to get Firebase ID token', error);
      return '';
    }
  }
  return '';
};
const axiosClient = axios.create({
  baseURL: isDev ? 'http://localhost:5000' : 'https://your-production-url.com',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getFirebaseToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      throw new Error('No token found');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
