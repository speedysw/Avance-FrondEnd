import { useState, useEffect } from "react";
// Componentes
import ProgressBarPrueba from "../components/Dashboard/progressBar"; // Barra horizontal
import ProgressBar from "../components/Dashboard/progressBarCircle";  // Barra circular
import ButtonAlternance from "../components/Dashboard/alternancia";
import SelectDropdown from "../components/Dashboard/select";
import Modal from "../components/Dashboard/modal";
import useSensorNotifications from "../components/Dashboard/notificaciones";
import PaginationControlled from "../components/Dashboard/Paginacion";
// Utilidades
import { fetchUltimoDato, updateDatosRadar } from "../services/dashbord";
import useSwitch from "../hooks/state_switch";
import { RiSettings5Line } from "@remixicon/react";

const RadarCards = () => {
  // Estados para manejar los sensores
  const [sensors, setSensors] = useState([]);
  const { handleSwitchChange } = useSwitch();
  
  // Estados para los filtros
  const [selectedOption, setSelectedOption] = useState("");
  const [progressOption, setProgressOption] = useState("Circular");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  // Funciones para los modales
  const handleOpenModal = (sensor) => {
    setSelectedSensor(sensor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSensor(null);
  };

  // Extraer los últimos datos de los sensores
  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const dataSensores = await fetchUltimoDato();
        setSensors(dataSensores);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    fetchSensors();
    const interval = setInterval(fetchSensors, 5000);
    return () => clearInterval(interval);
  }, []);

  useSensorNotifications(sensors);

  // Filtrar sensores según el estado
  const filteredSensors = sensors.filter(sensor => {
    if (selectedOption === "⚪ Todos los radares") return true;
    if (selectedOption === "🟢 Radares encendidos") return sensor.estado === true;
    if (selectedOption === "🔴 Radares apagados") return sensor.estado === false;
    return true;
  });

  // Lógica de paginación
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredSensors.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredSensors.length / cardsPerPage);

  // Función para cambiar de página
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para guardar cambios en el sensor
  const onSave = async (updatedSensor) => {
    try {
      const response = await updateDatosRadar(updatedSensor);
      setSensors((prevSensors) =>
        prevSensors.map(sensor =>
          sensor.id_radar === updatedSensor.id_radar ? response : sensor
        )
      );
    } catch (error) {
      console.error("Error al actualizar el sensor:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <SelectDropdown
          value={selectedOption}
          onChange={(option) => {
            setSelectedOption(option);
            setCurrentPage(1); // Reiniciar a la primera página al cambiar el filtro
          }}
          placeholder="Seleccionar Estado"
          options={[
            "⚪ Todos los radares",
            "🟢 Radares encendidos",
            "🔴 Radares apagados",
          ]}
        />
        <SelectDropdown
          value={progressOption}
          onChange={setProgressOption}
          placeholder="Visualización de progress"
          options={["Barra", "Circular"]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCards.length > 0 ? (
          currentCards.map((sensor) => (
            <div
              key={sensor.id_radar}
              className="card col-span-1 flex items-center justify-center p-4 relative"
            >
              <div className="card-header text-center flex flex-col items-center justify-center">
                <button
                  className="absolute top-2 right-2 text-gray-800 font-semibold py-1 px-2"
                  onClick={() => handleOpenModal(sensor)}
                >
                  <RiSettings5Line
                    className="-ml-0.5 size-5 shrink-0"
                    aria-hidden="true"
                  />
                </button>
                <h2 className="text-md font-medium mb-2">{sensor.nombre}</h2>
                <h3 className="text-md font-medium mb-2 text-gray-600">
                  ID: {sensor.id_radar}
                </h3>
                <div className="mb-4">
                  {progressOption === "Barra" ? (
                    <ProgressBarPrueba
                      value={sensor.combustible}
                      maxLitros={sensor.volumen}
                      umbral={sensor.umbral}
                    />
                  ) : (
                    <ProgressBar
                      value={sensor.combustible}
                      maxLitros={sensor.volumen}
                      umbral={sensor.umbral}
                    />
                  )}
                </div>
                <p className="mb-2">
                  Estado: {sensor.estado ? ("Encendido") : ("Apagado")}
                </p>
                <p className="text-sm text-gray-500">
                  Última actualización:{" "}
                  {new Date(sensor.fecha).toLocaleString()} {console.log(sensor.fecha)}
                </p>
                
                <ButtonAlternance
                  isSwitchOn={sensor.estado}
                  onToggle={(newState) =>
                    handleSwitchChange(sensor.id_radar, newState)
                  }
                />

                {isModalOpen && selectedSensor && (
                  <Modal
                    isOpen={isModalOpen}
                    closeModal={handleCloseModal}
                    sensor={selectedSensor}
                    onSave={onSave}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center">
            No hay sensores en este estado.
          </p>
        )}
      </div>

      {/* Controles de paginación con MUI */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4">
          <PaginationControlled
            totalPages={totalPages}
            currentPage={currentPage}
            goToPage={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default RadarCards;
