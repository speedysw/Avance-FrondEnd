import { useEffect, useState } from "react";

const RadarTime = () => {
    const [offTime, setOffTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
    let offDateTime;
      // Se verifica si ya se guardó la hora de apagado en localStorage
    const storedOffTime = localStorage.getItem("offTime");
    if (storedOffTime) {
        offDateTime = new Date(storedOffTime);
        console.log(offDateTime)
        console.log(storedOffTime)
    } else {
        // Usar la hora local del dispositivo como hora de inicio
        const startDateTime = new Date();
        // Se calcula la hora de apagado sumando 2 horas a la hora actual
        console.log(startDateTime)
        offDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
        localStorage.setItem("offTime", offDateTime.toISOString());
        console.log(offDateTime)
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
        localStorage.removeItem("offTime");
        setTimeLeft(0);
        }, delay);
        return () => clearTimeout(timeoutId);
    } else {
        // Si el tiempo de apagado ya pasó, actualizamos el estado
        setTimerActive(false);
        setTimeLeft(0);
        localStorage.removeItem("offTime");
    }
    }, []); // Se ejecuta una sola vez al montar el componente

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

export default RadarTime;

