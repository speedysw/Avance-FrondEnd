import { useEffect, useState } from "react";
import { changeHoraTermino, changeSwitchWithTimer, fetchHoraTermino } from "../../services/dashbord";
import PropTypes from "prop-types";

const RadarTime = ({ sensorID, duration }) => {
  const [offTime, setOffTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let timeoutId;

    const initTimer = async () => {
      try {
        // 1. Consultar al servidor si hay una hora de término almacenada
        const storedOffTime = await fetchHoraTermino(sensorID);
        console.log(storedOffTime)
        let offDateTime;
        if (storedOffTime) {
          // Usar la hora ya guardada
          offDateTime = new Date(storedOffTime);
          console.log("Tiempo almacenado:", offDateTime);
        } else {
          // Calcular y guardar nueva hora
          const startDateTime = new Date();
          offDateTime = new Date(startDateTime.getTime() + duration * 1000);
          await changeHoraTermino(sensorID, offDateTime.toISOString());
          console.log("Tiempo calculado:", offDateTime);
        }
        setOffTime(offDateTime);

        // 2. Calcular cuánto falta para llegar a offDateTime
        const delay = offDateTime.getTime() - Date.now();
        if (delay > 0) {
          setTimerActive(true);
          timeoutId = setTimeout(() => {
            console.log("Apagando el radar (expiró el temporizador)");
            setTimerActive(false);
            changeSwitchWithTimer(sensorID, false, false);
            changeHoraTermino(sensorID, null); // Limpia hora en BD
            setTimeLeft(0);
          }, delay);
        } else {
          // Ya expiró
          console.log("Tiempo expirado, apagando el radar");
          setTimerActive(false);
          setTimeLeft(0);
          changeSwitchWithTimer(sensorID, false, false);
          changeHoraTermino(sensorID, null);
        }
      } catch (error) {
        console.error("Error inicializando el temporizador:", error);
      }
    };

    initTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sensorID, duration]);

  // Actualizar el contador regresivo cada segundo
  useEffect(() => {
    if (!offTime) return;
    const intervalId = setInterval(() => {
      const diff = offTime.getTime() - Date.now();
      if (diff >= 0) {
        setTimeLeft(diff);
      } else {
        setTimeLeft(0);
        clearInterval(intervalId);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [offTime]);

  // Función para formatear el tiempo restante
  const formatTimeLeft = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      {offTime && timerActive ? (
        <p>El radar se apagará a las {offTime.toLocaleTimeString()}.</p>
      ) : (
        <p>El radar ya está apagado.</p>
      )}
      {timeLeft !== null && (
        <p>
          Tiempo restante: {timeLeft > 0 ? formatTimeLeft(timeLeft) : "0h 0m 0s"}
        </p>
      )}
    </div>
  );
};

RadarTime.propTypes = {
  sensorID: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
};

export default RadarTime;
