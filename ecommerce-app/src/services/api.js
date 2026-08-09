import axios from 'axios';

// Create React App's build replaces the exact text `process.env.REACT_APP_API_URL`
// with a literal string constant at compile time — there's no real `process` global
// in the browser, so guarding this with `typeof process !== 'undefined'` always
// evaluates to false at runtime and silently defeats the whole check. Reference it
// directly; CRA's replacement makes this safe regardless of build target.
const envBase = process.env.REACT_APP_API_URL
  || (typeof window !== 'undefined' && window.__ENV && window.__ENV.REACT_APP_API_URL);

const baseURL = envBase || 'http://localhost:5004/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

export default api;
