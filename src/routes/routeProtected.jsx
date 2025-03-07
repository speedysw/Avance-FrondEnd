// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import PropTypes from "prop-types";

const ProtectedRoute = ({children}) => {
    const { isAuthenticated, loading } = useAuth();

  // Mientras se valida el estado de autenticación, muestra un indicador de carga
    if (loading) {
        return <div>Cargando...</div>;
    }

  // Si no está autenticado, redirige al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

  // Si está autenticado, renderiza los componentes hijos
    return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};