import { useContext } from "react";
import { AuthContext } from "./authContext"; // Asegúrate de que la ruta sea correcta.

export const useAuth = () => {
    return useContext(AuthContext);
};
