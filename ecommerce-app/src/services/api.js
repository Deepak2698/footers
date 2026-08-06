import axios from 'axios';

// Prefer Create React App and Vite env names. Fall back to global window.__ENV if provided.
const envBase = (
  // CRA (available in many setups)
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL)
  // Vite
  || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  // fallback global injected envs on window
  || (typeof window !== 'undefined' && (window.__ENV && window.__ENV.REACT_APP_API_URL))
);

const baseURL = envBase || 'http://localhost:5004/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

export default api;
