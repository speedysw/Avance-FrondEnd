import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../contexts/useAuth";
import { getUsers } from "../services/users";
import propTypes from "prop-types";
import AddUserModal from "./addUserModal";

const AdminModal = ({onClose}) => {
    const [users, setUsers] = useState([]);
    const { token } = useAuth();
    const [showAddUserModal, setShowAddUserModal] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!token) return;
                const data = await getUsers(token);
                const mappedData = data.map(user => ({
                    ...user,
                    rol: mapUserRole(user.rol)
                }));
                console.log("Este es el mapeo de Data", mappedData)
                setUsers(mappedData);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };
        fetchUsers();
    },[token])

    const refreshUsers = async () => {
        try {
            if (!token) return;
            const data = await getUsers(token);
            const mappedData = data.map((user) => ({
            ...user,
            rol: mapUserRole(user.rol),
            }));
            setUsers(mappedData);
        } catch (error) {
            console.error("Error al refrescar usuarios:", error);
        }
    };

    const mapUserRole = (rol) => {
        if (rol === 0) return "USUARIO";
        if (rol === 1) return "ADMINISTRADOR";
        return "DESCONOCIDO";
    };      

    return(
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Título y botón de cierre superior */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
                        <X className="w-5 h-5" />
                    </button>
            </div>


            {/* Tabla de usuarios */}
            <div className="mb-6">
                <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-medium uppercase text-gray-700">Listado de usuarios</h3>
                <button
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-white text-black py-2 px-4 rounded-lg transition-all"
                >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7">
                <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                </svg>


                </button>
                </div>
        
                <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow">
                    <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm">
                        <th className="px-4 py-2 text-left font-medium uppercase">Nombre completo</th>
                        <th className="px-4 py-2 text-left font-medium uppercase">Username</th>
                        <th className="px-4 py-2 text-left font-medium uppercase">Rol</th>
                        <th className="px-4 py-2 text-left font-medium uppercase">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="text-sm">
                    {users.map((user) => (
                        <tr key={user.id_usuario} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-semibold uppercase">{user.nombre}</td>
                        <td className="px-4 py-2 font-semibold uppercase">{user.username}</td>
                        <td className="px-4 py-2 font-medium uppercase">
                            <span
                            className={`py-1 px-2 rounded text-xs ${
                                user.rol === "ADMINISTRADOR"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                            >
                            {user.rol}
                            </span>
                        </td>
                        <td className="px-4 py-2 font-semibold uppercase ">
                            <button
                            className="justify-center px-6"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>

                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>

        {/* Mensaje de éxito 
        {successMsg && (
            <div className="mb-4 bg-green-100 text-green-600 p-2 rounded">
                {successMsg}
            </div>
            )}*/}

        {/* Botón de cerrar */}
            <button
                onClick={onClose}
                className="bg-transparent py-2 px-20 mx-auto border hover:border-transparent rounded font-semibold hover:bg-red-700 text-red-700 hover:text-white border-red-700"
            >
                Cerrar
            </button>
            </div>

            {/* Modal de agregar usuario (hijo) */}
            {showAddUserModal && (
                <AddUserModal
                onCloseModal={() => setShowAddUserModal(false)}
                refreshUsers={refreshUsers}
                />
            )}
        </div>


    );
}

AdminModal.propTypes = {
    onClose: propTypes.func.isRequired,
};

export default AdminModal