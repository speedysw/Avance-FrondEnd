import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Función para obtener el access token (p. ej., del almacenamiento)
const getAccessToken = () => localStorage.getItem('token');

// Función para obtener el refresh token
const getRefreshToken = () => localStorage.getItem('refresh_token');

// Interceptores de peticiones
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptores de respuestas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Evita un bucle infinito: si la solicitud ya es para /refresh, no la reintentes
    if (originalRequest.url.includes("/refresh")) {
      return Promise.reject(error);
    }
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(error);
      }
      try {
        console.log('Intentando refrescar el token...', refreshToken);
        const response = await api.post('/refresh', {
          refresh_token: refreshToken,
        });
        if (response.data && response.data.access_token) {
          localStorage.setItem('token', response.data.access_token);
          return api(originalRequest);
        } else {
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('Error en refresh token:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
