import { useEffect, useState } from "react";
import { changeSwitchWithTimer } from "../../services/dashbord";
import PropTypes from "prop-types";

const RadarTime = ({ sensorID, duration }) => {
  const [offTime, setOffTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let offDateTime;
    const localKey = `offTime_${sensorID}`;
    // Se verifica si ya se guardó la hora de apagado en localStorage para este sensor
    const storedOffTime = localStorage.getItem(localKey);
    if (storedOffTime) {
      offDateTime = new Date(storedOffTime);
      console.log("Tiempo almacenado:", offDateTime);
    } else {
      // Usar la hora local del dispositivo como hora de inicio
      const startDateTime = new Date();
      console.log("Inicio:", startDateTime);
      // Se calcula la hora de apagado sumando la duración (en segundos) a la hora actual
      offDateTime = new Date(startDateTime.getTime() + duration * 1000);
      localStorage.setItem(localKey, offDateTime.toISOString());
      console.log("Tiempo calculado:", offDateTime);
    }
    setOffTime(offDateTime);

    // Calcular el retraso entre la hora de apagado y el momento actual
    const delay = offDateTime.getTime() - Date.now();
    if (delay > 0) {
      setTimerActive(true);
      // Programar el apagado en el momento indicado
      const timeoutId = setTimeout(() => {
        console.log("Apagando el radar");
        setTimerActive(false);
        // Enviamos false (apagado) y el valor correspondiente al temporizador, si es necesario
        changeSwitchWithTimer(sensorID, false, false);
        localStorage.removeItem(localKey);
        setTimeLeft(0);
      }, delay);
      return () => clearTimeout(timeoutId);
    } else {
      // Si el tiempo ya pasó, aseguramos que se desactive
      console.log("Tiempo expirado, apagando el radar");
      changeSwitchWithTimer(sensorID, false, false);
      setTimerActive(false);
      setTimeLeft(0);
      localStorage.removeItem(localKey);
    }
  }, [sensorID, duration]); // timerActive se elimina de la lista de dependencias

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
          Tiempo restante:{" "}
          {timeLeft > 0 ? formatTimeLeft(timeLeft) : "0h 0m 0s"}
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
