// One shared axios instance. withCredentials is required so the
// express-session cookie actually gets sent to and stored from the server.
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export default api;
