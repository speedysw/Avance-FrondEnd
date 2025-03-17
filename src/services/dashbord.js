import api from "./api";

/*
    Función que envia una solicitud cada 5 segundos para
    mantener los datos actualizados de los radares en "tiempo real"

    No recibe parametros y retorna el ultimo valor de cada uno de los radares
*/

export async function fetchUltimoDato() {
    try {
        const response = await api.get(`/radares/last_date`);
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
            const endpoint = `/radares/${updateRadar.id_radar}`;
            const token = localStorage.getItem("token");
            const payload = { ...updateRadar };
            console.log("Este es el valor del token", token)
            const response = await api.put(endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data
        } catch (error) {
            if (error.response) {
                console.error("Error al actualizar el sensor:", error.response.status, error.response.data);
            } else {
                console.error("Error de red o bloqueo CORS:", error);
            }
            throw error;
        }
}

/*
    Función que envia una solicitud para cambiar el estado de los radares
    de "Encendido" a "Apagado" o "Apagado" a "Encendido"

    Recibe como parametros el identificador del Radar y el estado de cambio solicitado
*/
export async function changeSwitchWithoutTimer(sensorID, newState) {
    try {
        const url = `/switch/${sensorID}`;
        const payload = { estado: newState };
        const rest = await api.post(url, payload);
        console.log("Estado actualizado correctamente (sin temporizador)", rest.data);
        return rest.data;
        } catch (error) {
        console.error("Error al actualizar el estado del sensor sin temporizador:", error);
        throw error;
        }
    }
    
export async function changeSwitchWithTimer(sensorID, newState, timerActive) {
    try {
        const url = `/switch/temporizador/${sensorID}`;
        const payload = { estado: newState, timerActive };
        const rest = await api.put(url, payload);
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
        const endpoint = `/temporizador/${activateSensor.id_radar}`;
        const token = localStorage.getItem("token");
        const payload = { ...activateSensor };
        console.log("Este es el payload", payload)
        const response = await api.put(endpoint, payload, {
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

export async function fetchHoraTermino(sensorID) {
    try{
        const endpoint = `/get_hora/${sensorID}`;
        const token = localStorage.getItem("token");
        const response = await api.get(endpoint, {
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

export async function changeHoraTermino(sensorID, horaTermino){
    try{
        console.log("Este es lo que llega a activatesensor", sensorID)
        const endpoint = `/temporizador/termino/${sensorID}`;
        const token = localStorage.getItem("token");
        const payload = { hora_termino: horaTermino };
        console.log("Este es el payload", payload)
        const response = await api.put(endpoint, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Este es el valor de la respuesta", response.data);
    }catch(error){
        console.error("Error al actualizar el sensor:", error);
    }
}