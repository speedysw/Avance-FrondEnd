import { createContext, useEffect, useState } from "react";
import useSensorNotifications from "../components/Dashboard/notificaciones";
import PropTypes from "prop-types";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [sensorData, setSensorData] = useState([]);

    // Llamamos al hook en el nivel superior y le pasamos sensorData.
    useSensorNotifications(sensorData);

    useEffect(() => {
        const socket = new WebSocket("ws://192.168.0.112:8000/ws");

        socket.onopen = () => {
        console.log("Conexión WebSocket establecida");
        };

        socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log(data)
            // Actualizamos el estado con los datos recibidos
            setSensorData(data);
        } catch (error) {
            console.error("Error al parsear el mensaje del WebSocket", error);
        }
        };

        socket.onerror = (error) => {
        console.error("Error en WebSocket:", error);
        };

        socket.onclose = () => {
        console.log("Conexión WebSocket cerrada");
        };

        return () => {
        socket.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={null}>
        {children}
        </WebSocketContext.Provider>
    );
};

WebSocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};