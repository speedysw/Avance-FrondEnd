import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { crearRadar } from "../../services/radares";
import PropTypes from "prop-types";

export function AddModalRadar({ isOpen, onClose, onCreated }) {
    const [nombre, setNombre] = useState('');
    const [volumen, setVolumen] = useState('');
    const [umbral, setUmbral] = useState('');
    const [apiError, setApiError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reiniciar los campos al abrir o cerrar el modal
    useEffect(() => {
        if (!isOpen) {
            setNombre('');
            setVolumen('');
            setUmbral('');
            setApiError('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    // Cerrar modal con la tecla ESC
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
        }
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Permite cerrar el modal al hacer clic en el backdrop
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        // Validación básica
        if (!nombre || !volumen || !umbral) {
            setApiError("Todos los campos son obligatorios.");
            return;
        }
        setIsSubmitting(true);
        try {
            await crearRadar({ nombre, volumen, umbral });
            onCreated();
            onClose(); // Cierra el modal tras el éxito
        } catch (err) {
            console.error('Error creando Radar:', err);
            setApiError(err?.response?.data?.detail || 'Error al crear el Radar');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        Añadir Radar
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
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej. Radar A"
                        />
                    </div>
                    <div>
                        <label htmlFor="volumen" className="block text-sm font-medium text-gray-700">
                            Volumen
                        </label>
                        <input
                            id="volumen"
                            type="number"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none"
                            value={volumen}
                            onChange={(e) => setVolumen(e.target.value)}
                            placeholder="Ej. 100"
                        />
                    </div>
                    <div>
                        <label htmlFor="umbral" className="block text-sm font-medium text-gray-700">
                            Umbral
                        </label>
                        <input
                            id="umbral"
                            type="number"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none"
                            value={umbral}
                            onChange={(e) => setUmbral(e.target.value)}
                            placeholder="Ej. 100"
                        />
                    </div>
                    {/* Botón de guardar */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700 transition ${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

AddModalRadar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreated: PropTypes.func.isRequired,
};
