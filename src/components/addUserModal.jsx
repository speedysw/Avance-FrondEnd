import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { addUser } from "../services/users";
import PropTypes from "prop-types";

const AddUserModal = ({ onCloseModal, refreshUsers }) => {
        //Registro de nuevo usuario
    const [nombre, setNombre] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [clave, setClave] = useState("");
    const [role, setRole] = useState("USER");

    const { token } = useAuth();

    const mapeoRoles = (role) => {
        if (role === "USER") return 0;
        if (role === "ADMIN") return 1;
    }

    const handleAddUser = async () => {
        try {
            if (!token) return;

            const paylod = {
                username: nombreUsuario,
                nombre: nombre,
                password: clave,
                rol: mapeoRoles(role),
            }

            await addUser(token, paylod)
            //setSuccessMsg("Usuario añadido correctamente");
            
            refreshUsers()
            onCloseModal()
            
            //Limpiar formulario
            setNombre("");
            setNombreUsuario("");
            setClave("");
            setRole("USER");

        } catch (error) {
            //setErrorMsg("Error al añadir el usuario");
            console.error("Error al añadir el usuario:", error);
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-60">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 justify-center">Añadir Usuario</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
            <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border px-3 py-2 mb-2"
                autoComplete="name"
                />

                <input
                type="text"
                id="nombreUsuario"
                name="nombreUsuario"
                placeholder="Nombre de usuario. Ej: User123"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                className="w-full border px-3 py-2 mb-2"
                autoComplete="username"
                />

                <input
                type="password"
                id="clave"
                name="clave"
                placeholder="Contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="w-full border px-3 py-2 mb-2"
                autoComplete="new-password"
                />

                <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border px-3 py-2 mb-4"
                >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
                </select>

            <div className="flex justify-end">
                <button type="button" onClick={onCloseModal} className="mr-2 px-3 py-1 border rounded">
                Cancelar
                </button>
                <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                Añadir
                </button>
            </div>
            </form>
            </div>
        </div>
    );      
}

export default AddUserModal;

AddUserModal.propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    refreshUsers: PropTypes.func.isRequired,
};
