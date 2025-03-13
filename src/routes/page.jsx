import { useState, useEffect } from "react";
// Componentes
import ProgressBarPrueba from "../components/Dashboard/progressBar"; // Barra horizontal
import ProgressBar from "../components/Dashboard/progressBarCircle";  // Barra circular
import ButtonAlternance from "../components/Dashboard/alternancia";
import SelectDropdown from "../components/Dashboard/select";
import Modal from "../components/Dashboard/modal";
import useSensorNotifications from "../components/Dashboard/notificaciones";
import PaginationControlled from "../components/Dashboard/Paginacion";
import RadarTime from "../components/Dashboard/radarTime";
import TemporizadorModal from "../components/Dashboard/TemporizadorModal";
// Utilidades
import { fetchUltimoDato, updateDatosRadar, activarTemporizador, changeHoraTermino } from "../services/dashbord";
import useSwitch from "../hooks/state_switch";

//Iconos
import { RiSettings5Line } from "@remixicon/react";
import { Timer } from 'lucide-react';

const RadarCards = () => {
  // Estados para manejar los sensores
  const [sensors, setSensors] = useState([]);
  const { handleSwitchChange } = useSwitch();
  
  // Estados para los filtros
  const [selectedOption, setSelectedOption] = useState("");
  const [progressOption, setProgressOption] = useState("Circular");
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [isTemporizadorOpen, setIsTemporizadorOpen] = useState(false);
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

  const [isTemporizadorOpen, setIsTemporizadorOpen] = useState(false);
  const [radarTemporizador, setRadarTemporizador] = useState(null);
  
  const handleTemporizadorOpenModal = (sensor) => {
      setRadarTemporizador(sensor);
      setIsTemporizadorOpen(true);
  };
  
  const handleActive = async (sensor) => {
      try {
          // Llama a la función de servicio que activa el temporizador
          const updatedSensor = { ...sensor, timerActive: true };
          const response = await activarTemporizador(updatedSensor);
          // Actualiza el estado con la respuesta, similar a cómo lo haces en otros modales
          setSensors((prevData) =>
              prevData.map((r) =>
                  r.id_radar === sensor.id_radar ? response : r
              )
          );
          setIsTemporizadorOpen(false);
      } catch (error) {
          console.error("Error al activar el temporizador:", error);
      }
  };

  const handleDesactive = async (sensor) => {
    try {
      // Crea una copia del sensor actualizando timerActive a false
      const updateSensor = { ...sensor, timerActive: false };
      // Elimina la clave del localStorage para evitar que se lea el valor expirado
      await changeHoraTermino(sensor.id_radar, null)
      // Llama al servicio para actualizar el estado del sensor en el servidor (o donde corresponda)
      const response = await activarTemporizador(updateSensor);
      // Actualiza el estado local de los sensores
      setSensors((prevData) =>
        prevData.map((r) =>
          r.id_radar === sensor.id_radar ? response : r
        )
      );
    } catch (error) {
      console.error("Error al desactivar el temporizador:", error);
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
                    className="-ml-0.5 size-6 shrink-0"
                    aria-hidden="true"
                  />
                  
                </button>

                <button
                  disabled={!sensor.estado}
                  className="absolute top-2 left-2 text-gray-800 font-semibold py-1 px-2"
                  onClick={() => handleTemporizadorOpenModal(sensor)}
                >
                  <Timer size={24} />
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
                  {new Date(sensor.fecha).toLocaleString()}
                </p>
                
                <ButtonAlternance
                  isSwitchOn={sensor.estado}
                  onToggle={(newState) =>
                    handleSwitchChange(sensor.id_radar, newState)
                  }
                />

                { sensor.timerActive && sensor.estado && (
                  <>
                    <RadarTime sensorID={sensor.id_radar} duration={sensor.duration} />
                    <button
                      type="button"
                      onClick={() => handleDesactive(sensor)}
                      className="bg-transparent mt-2 py-2 px-2 mx-auto border hover:border-transparent rounded font-semibold hover:bg-red-700 text-red-700 hover:text-white border-red-700"
                      >
                      Cancelar temporizador
                    </button>
                  </>
                )}

                {isModalOpen && selectedSensor && (
                  <Modal
                    isOpen={isModalOpen}
                    closeModal={handleCloseModal}
                    sensor={selectedSensor}
                    onSave={onSave}
                  />
                )}

                {isTemporizadorOpen && radarTemporizador && (
                    <TemporizadorModal
                        isOpen={isTemporizadorOpen}
                        onClose={() => setIsTemporizadorOpen(false)}
                        onActive={() => handleActive(radarTemporizador)}
                        radar={radarTemporizador}
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
