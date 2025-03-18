import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Importamos PropTypes
import { loginService, logoutService } from '../services/autenticacion';
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

function scheduleTokenRefresh() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const decoded = jwtDecode(token);
  const expiresAt = decoded.exp * 1000;
  const now = Date.now();
  const timeout = expiresAt - now - 60000;
  
  console.log("Token expira en:", new Date(expiresAt).toLocaleString());
  console.log("Tiempo actual:", new Date(now).toLocaleString());
  console.log("Timeout para refrescar:", timeout, "ms");

  if (timeout > 0) {
    setTimeout(async () => {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error("No hay refresh token");
        console.log('Intentando refrescar el token de manera proactiva...', refreshToken);
        const response = await api.post('/refresh', {
          refresh_token: refreshToken,
        });

        if (response.data && response.data.access_token) {
          console.log("Token renovado exitosamente:", response.data.access_token);
          localStorage.setItem('token', response.data.access_token);
          // Vuelve a programar el próximo refresh con el nuevo token
          scheduleTokenRefresh();
        }
      } catch (error) {
        console.error("Error al refrescar el token de forma automática", error);
        // Aquí puedes forzar el logout o redirigir al usuario
      }
    }, timeout);
  } else {
    console.log("El token está a punto de expirar. Considera refrescarlo inmediatamente o forzar logout.");
    // Aquí podrías refrescar inmediatamente o iniciar un logout.
  }
}



export const AuthContext = createContext({
  isAuthenticated: false,
  token: null,
  role: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try{
        const decodedToken = jwtDecode(storedToken);
        setRole(decodedToken.role);
      }catch(error){
        console.error("Error al decodificar el token", error);
        setToken(null);
        setRole(null);
        localStorage.removeItem("token");
      }
    }
    setLoading(false); 
  }, []);

  const login = async (username, password) => {
    try {
      const data = await loginService(username,password);
      console.log("Respuesta del API:", data);
      if (data && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        setToken(data.access_token);
        const decodedToken = jwtDecode(data.access_token);
        setRole(decodedToken.rol);
        scheduleTokenRefresh();
        return data;
      } else {
        throw new Error("No se recibió access_token");
      }
    } catch (error) {
      console.error(error);
      throw error; // Re-lanzamos el error para que el componente Login lo capture
    }
  };
  
  const logout = () => {
    logoutService(); 
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setRole(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        role,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Definimos PropTypes para `children`
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
