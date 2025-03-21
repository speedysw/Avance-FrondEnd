import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

function useSensorNotifications(sensors, intervaloNotificacion = 60000) {
  // Almacena el último timestamp de notificación para cada sensor, usando su id como clave.
    const lastNotifiedRef = useRef({});

    useEffect(() => {
        if (!("Notification" in window)) {
            console.warn("Las notificaciones no están soportadas en este navegador.");
            return;
        }

        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
            console.log("Notificaciones permitidas");
            } else {
            console.warn("Notificaciones denegadas");
            }
        });
        }

        sensors.forEach((sensor) => {
            if (sensor.combustible < sensor.umbral) {
                const now = Date.now();
                const lastNotified = lastNotifiedRef.current[sensor.id_radar] || 0;

            if (now - lastNotified >= intervaloNotificacion) {
                if (Notification.permission === "granted") {
                    new Notification(`Nivel bajo de combustible`, {
                    body: `El nivel de combustible del radar "${sensor.nombre}" (ID: ${sensor.id_radar}) es bajo!`
                    });
                } else {
                // Fallback a notificación in-app
                toast.error(`¡El nivel de combustible del radar "${sensor.nombre}" (ID: ${sensor.id_radar}) es bajo!`);}
                lastNotifiedRef.current[sensor.id_radar] = now;}
                }
            });
    }, [sensors, intervaloNotificacion]);
}

export default useSensorNotifications;
