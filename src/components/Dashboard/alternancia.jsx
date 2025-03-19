import { useState, useEffect } from "react";
import PropTypes from "prop-types";

Boton.propTypes = {
  isSwitchOn: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default function Boton({ isSwitchOn, onToggle }) {
  // Se utiliza un estado local para manejar el valor actual.
  const [isChecked, setIsChecked] = useState(isSwitchOn);

  // Si la prop isSwitchOn cambia, actualizamos el estado local.
  useEffect(() => {
    setIsChecked(isSwitchOn);
  }, [isSwitchOn]);

  // Función para "Encender"
  const handleEncender = () => {
    if (!isChecked) {
      setIsChecked(true);
      onToggle(true);
    }
  };

  // Función para "Apagar"
  const handleApagar = () => {
    if (isChecked) {
      setIsChecked(false);
      onToggle(false);
    }
  };

  return (
    <div className="flex space-x-6  py-6">
      <button
        onClick={handleEncender}
        disabled={isChecked} // Si ya está encendido, deshabilita el botón de encender
        className={`bg-transparent py-2 px-4 border hover:border-transparent rounded font-semibold ${
          isChecked
            ? "hover:bg-gray-500 text-gray-600 hover:text-white border-gray-600 cursor-not-allowed"
            : "hover:bg-green-700 text-green-700 hover:text-white border-green-700"
        }`}
      >
        Encender
      </button>
      <button
        onClick={handleApagar}
        disabled={!isChecked} // Si ya está apagado, deshabilita el botón de apagar
        className={`bg-transparent py-2 px-4 border hover:border-transparent rounded font-semibold ${
          !isChecked
            ? "hover:bg-gray-500 text-gray-600 hover:text-white border-gray-600 cursor-not-allowed"
            : "hover:bg-red-700 text-red-700 hover:text-white border-red-700"
        }`}
      >
        Apagar
      </button>
    </div>
  );
}
