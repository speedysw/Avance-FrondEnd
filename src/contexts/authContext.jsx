import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Importamos PropTypes
import { loginService, logoutService } from '../services/autenticacion';
import { jwtDecode } from "jwt-decode";



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
