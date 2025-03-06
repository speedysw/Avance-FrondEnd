// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const ProtectedRoute = () => {
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
    return <Outlet />;
};

export default ProtectedRoute;
