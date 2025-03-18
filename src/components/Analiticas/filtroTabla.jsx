import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import fetchCantidadRadares from "../../services/analiticas";

const StatusList = ["Apagado", "Encendido"];

export function FiltroTabla({ filters, onFilterChange, onResetFilters, onExportCSV}) {
  const [radarList, setRadarList] = useState([]);
  const [radarStatus, setRadarStatus] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      const radars = await fetchCantidadRadares();
      setRadarList(radars);
      setRadarStatus(StatusList);
    }
    cargarDatos();
  }, []);

  return (
    <div className="relative p-6 bg-white shadow rounded-lg mb-4">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={onResetFilters}
          className="text-sm text-red-500 hover:text-red-700 focus:outline-none border border-red-500 rounded-lg px-2 py-1"
        >
          Limpiar filtros
        </button>

        <button
          onClick={onExportCSV}
          className="text-sm text-green-500 hover:text-green-700 focus:outline-none border border-green-500 rounded-lg px-2 py-1"
        >
          Descargar CSV
        </button>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-6">Filtros</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Radar: se renderiza si filters tiene la propiedad "radar" */}
        {filters.radar !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Radar
            </label>
            <select
              name="radar"
              value={filters.radar || ""}
              onChange={onFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Seleccione Radar</option>
              {radarList.map((item) => (
                <option key={item.id_radar} value={item.id_radar}>
                  {item.id_radar}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Estado: se renderiza si filters tiene la propiedad "estado" */}
        {filters.estado !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={filters.estado || ""}
              onChange={onFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Seleccione Estado</option>
              {radarStatus.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Fecha de Registro: se renderiza si filters tiene la propiedad "fecha_registro" */}
        {filters.fecha_registro !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Registro
            </label>
            <input
              type="date"
              name="fecha_registro"
              value={filters.fecha_registro || ""}
              onChange={onFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        )}
      </div>
    </div>
  );
}

FiltroTabla.propTypes = {
  filters: PropTypes.shape({
    radar: PropTypes.string,
    estado: PropTypes.string,
    cantidad: PropTypes.string,
    fecha_registro: PropTypes.string,
  }),
  onFilterChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  onExportCSV: PropTypes.func.isRequired,
};
