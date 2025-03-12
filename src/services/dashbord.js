import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

/*
    Función que envia una solicitud cada 5 segundos para
    mantener los datos actualizados de los radares en "tiempo real"

    No recibe parametros y retorna el ultimo valor de cada uno de los radares
*/

export async function fetchUltimoDato() {
    try {
        const response = await axios.get(`${API_URL}/radares/last_date`);
        //console.log("Datos obtenidos correctamente", response.data);
        return response.data
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return []; 
    }
};


/*
    Funcion que envia una solicitud put a la API para
    que se actualizen los datos que edito el usuario de un radar en especifico

    Recibe como parametro el Radar actualizado con todos sus datos
    Retorna los datos del radar que se actualizo
*/

export async function updateDatosRadar(updateRadar) {
    try {
        // Enviar la actualización al backend
            const endpoint = `${API_URL}/radares/${updateRadar.id_radar}`;
            const token = localStorage.getItem("token");
            const payload = { ...updateRadar };
            const response = await axios.put(endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data
        } catch (error) {
            console.error("Error al actualizar el sensor:", error);
    }
}

/*
    Función que envia una solicitud para cambiar el estado de los radares
    de "Encendido" a "Apagado" o "Apagado" a "Encendido"

    Recibe como parametros el identificador del Radar y el estado de cambio solicitado
*/
export async function changeSwitchWithoutTimer(sensorID, newState) {
    try {
        const url = `${API_URL}/switch/${sensorID}`;
        const payload = { estado: newState };
        const rest = await axios.post(url, payload);
        console.log("Estado actualizado correctamente (sin temporizador)", rest.data);
        return rest.data;
        } catch (error) {
        console.error("Error al actualizar el estado del sensor sin temporizador:", error);
        throw error;
        }
    }
    
export async function changeSwitchWithTimer(sensorID, newState, timerActive) {
    try {
        const url = `${API_URL}/switch/temporizador/${sensorID}`;
        const payload = { estado: newState, timerActive };
        const rest = await axios.put(url, payload);
        console.log("Estado actualizado correctamente (con temporizador)", rest.data);
        return rest.data;
        } catch (error) {
        console.error("Error al actualizar el estado del sensor con temporizador:", error);
        throw error;
    }
}



export async function activarTemporizador(activateSensor) {
    try{
        console.log("Este es lo que llega a activatesensor", activateSensor)
        const endpoint = `${API_URL}/temporizador/${activateSensor.id_radar}`;
        const token = localStorage.getItem("token");
        const payload = { ...activateSensor };
        console.log("Este es el payload", payload)
        const response = await axios.put(endpoint, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Este es el valor de la respuesta", response.data);
        return response.data
    }catch(error){
        console.error("Error al actualizar el sensor:", error);
    }
    
}