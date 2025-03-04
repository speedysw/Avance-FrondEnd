import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import PropTypes from "prop-types";  // Importa PropTypes

export default function SelectDropdown({ onChange, placeholder, value, options = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-[320px] w-full relative">
      <div 
        onClick={() => setOpen(!open)} 
        tabIndex={0} 
        className="w-full flex items-center justify-between py-3 px-3 border-2 bg-white rounded-md cursor-pointer mb-4"
      >
        <p className="text-sm text-gray-400">{value || placeholder}</p>
        <MdKeyboardArrowDown className={`text-base transition-all ${open ? "rotate-180" : "rotate-0"}`} />
      </div>
      
      {open && (
        <div 
          className="w-full py-2 border-2 bg-white rounded-md shadow-md mb-6 " 
        >
          {options.map((option) => (
            <div 
              key={option} 
              onClick={() => { onChange(option); setOpen(false); }} 
              className={`flex py-2 px-3 cursor-pointer ${option === value ? "bg-gray-200" : "bg-white"} hover:bg-gray-100 rounded-sm `}
            >
              <p className="text-sm text-black">{option}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Validación de las props
SelectDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,       // Función que se llama cuando se selecciona una opción
  placeholder: PropTypes.string.isRequired,  // Texto para mostrar si `value` no tiene valor
  value: PropTypes.string,                   // Valor seleccionado
  options: PropTypes.arrayOf(PropTypes.string).isRequired,  // Lista de opciones (debe ser un array de strings)
};
