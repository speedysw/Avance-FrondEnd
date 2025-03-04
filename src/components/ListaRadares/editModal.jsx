import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

export function EditModalRadar({ isOpen, onClose, onSave, radar }) {
    const [formData, setFormData] = useState({});
    const [apiError, setApiError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

  // Ocultar mensaje de éxito después de 3 segundos
    useEffect(() => {
        if (showSuccess) {
        const timer = setTimeout(() => setShowSuccess(false), 3000);
        return () => clearTimeout(timer);
        }
    }, [showSuccess]);

  // Permitir cerrar el modal haciendo click afuera del form
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
        onClose();
        }
    };

    
  // Cargar los datos del radar escogido
    useEffect(() => {
        if (radar) {
            if (radar.id_registro !== undefined && radar.id_registro !== null) {
                // Es virtual
                setFormData({
                    id_registro: radar.id_registro,
                    nombre: radar.nombre ?? "",
                    volumen: radar.volumen ?? "",
                    umbral: radar.umbral ?? "",
                });
            } else {
                // Es físico
                setFormData({
                    id_radar: radar.id_radar,
                    nombre: radar.nombre ?? "",
                    volumen: radar.volumen ?? "",
                    umbral: radar.umbral ?? "",
                });
            }
        setApiError(null);
        }
    }, [radar]);

  // Limpiar los campos cada vez que se cierra el modal
    useEffect(() => {
        if (!isOpen) {
        setFormData({});
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSave = async () => {
        setApiError(null); // Limpiar error anterior
        try {
        // Llamamos a la función del padre pasando los datos filtrados
        await onSave(formData);
        // Mostramos el mensaje de éxito
        setShowSuccess(true);
        } catch (error) {
        console.error("Error al guardar:", error);
        const message =
            error?.response?.data?.detail ||
            "Ocurrió un error desconocido al actualizar.";
        setApiError(message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSave();
    };

    if (!isOpen) return null;

    return (
    <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
    >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-4">
            <h4 id="modal-title" className="text-xl font-semibold text-gray-700">
            Editar Radar
            </h4>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
            <X className="w-5 h-5" />
            </button>
        </div>
        {/* Mensaje de error */}
        {apiError && (
            <div className="mb-4 text-red-700 bg-red-100 border border-red-400 p-2 rounded">
            {apiError}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label htmlFor="identificador" className="block text-sm font-medium text-gray-700">
                Identificador
            </label>
            <input
                id="identificador"
                type="text"
                disabled
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none"
                value={formData.id_radar || formData.id_registro}
            />
            </div>
            <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre
            </label>
            <input
                id="nombre"
                type="text"
                name="nombre"
                required
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none"
                value={formData.nombre || ""}
                onChange={handleChange}
            />
            </div>
            <div>
            <label htmlFor="volumen" className="block text-sm font-medium text-gray-700">
                Volumen
            </label>
            <input
                id="volumen"
                type="number"
                name="volumen"
                required
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none"
                value={formData.volumen || ""}
                onChange={handleChange}
            />
            </div>
            <div>
            <label htmlFor="umbral" className="block text-sm font-medium text-gray-700">
                Umbral
            </label>
            <input
                id="umbral"
                type="number"
                name="umbral"
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none"
                value={formData.umbral || ""}
                onChange={handleChange}
            />
            </div>
            {/* Botones */}
            <div className="flex justify-end mt-6 space-x-2">
            <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
                Cerrar
            </button>
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Guardar
            </button>
            </div>
        </form>
        </div>
    </div>
    );
}

EditModalRadar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    radar: PropTypes.shape({
        id_radar: PropTypes.string,
        id_vinculacion: PropTypes.string,
        id_registro: PropTypes.number,
        nombre: PropTypes.string,
        volumen: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        umbral: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
};
