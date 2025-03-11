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

export async function changeSwitch(sensorID, newState){
    try{
        const rest = await axios.post(`${API_URL}/switch/${sensorID}`, { estado: newState });
        console.log("Estado actualizado correctamente", rest.data)
    }catch(error){
        console.error("Error al actualizar el estado del sensor:", error);
    }
}