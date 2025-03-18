import { useState } from "react";
import PropTypes from "prop-types";

const Modal = ({ isOpen, closeModal, sensor, onSave }) => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: sensor.nombre,
    volumen: sensor.volumen,
    umbral: sensor.umbral,
    timerActive: sensor.timerActive,
    duration: sensor.duration,
  });

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Combina el objeto original con los cambios del formulario
    const durationInSeconds = formData.duration * 60;
    const sensorActualizado = { 
      ...sensor, 
      ...formData, 
      duration: durationInSeconds 
    };
    onSave(sensorActualizado);
    closeModal();
  };
  

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-sm z-50">
      <div className="bg-white p-6 border-4 rounded-md">
        <h2 className="text-xl mb-4">Editar Radar</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm">Nombre Radar:
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            </label>
          </div>
        <div className="mb-4">
            <label className="block text-sm">Capacidad:
            <input
            id="volumen"
            type="number"
            name="volumen"
            value={formData.volumen}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            />
            </label>
        </div>
        <div className="mb-4">
            <label className="block text-sm">Duracion (en minutos):
            <input
            id="duration"
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            />
            </label>
        </div>
        <div className="mb-4">
            <label className="block text-sm">Umbral:
            <input
            id="umbral"
            type="number"
            name="umbral"
            value={formData.umbral}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            />
            </label>
        </div>
        
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
            Guardar
          </button>
        </form>
        <button onClick={closeModal} className="mt-4 text-gray-500">
          Cerrar
        </button>
      </div>
    </div>
  );
};

// Definir los tipos de los props para mayor claridad
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Para saber si el modal está abierto o no
  closeModal: PropTypes.func.isRequired, // Función para cerrar el modal
  sensor: PropTypes.object.isRequired, // Los datos del sensor a editar
  onSave: PropTypes.func.isRequired, // Función para guardar los cambios
};

export default Modal;
