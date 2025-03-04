import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export async function ObtenerDatos() {
    try {
        const response = await axios.get(`${API_URL}/datos/radares`);
        const cant_radares = response.data;
        return cant_radares;
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
}

export async function fetchDatosVirtuales(){
    try {
        const response = await axios.get(`${API_URL}/virtuales/radares`);
        return response.data
    } catch (err) {
        console.error('Error al obtener datos virtuales',err);
    }
}

export async function UpdateRadar(editRadar) {
    try {
        let endpoint = "";
        console.log("Entre",editRadar)
        if (typeof editRadar.id_radar === "string") {
            // Si es una cadena, usa la URL original
            endpoint = `${API_URL}/radares/${editRadar.id_radar}`;
        } else if (typeof editRadar.id_radar === typeof(int)) {
            // Si es un número, usa otra URL (modifica "otraRuta" según lo que necesites)
            endpoint = `${API_URL}/virtuales/${editRadar.id_registro}`;
        } else {
            throw new Error("El tipo de editRadar.id_radar no es válido.");
        }
        
        await axios.put(endpoint, editRadar);
    } catch (error) {
        console.error('Error al guardar la edición:', error);
    }
}  

export async function DeletedRadar(radarToDelete) {
    try {
        let endpoint = "";
        console.log("Entre",radarToDelete)
        if (typeof radarToDelete.id_radar === "string") {
            // Si es una cadena, usa la URL original
            endpoint = `${API_URL}/radares/${radarToDelete.id_radar}`;
        } else if (typeof radarToDelete.id_radar === typeof(int)) {
            // Si es un número, usa otra URL (modifica "otraRuta" según lo que necesites)
            endpoint = `${API_URL}/virtuales/${radarToDelete.id_registro}`;
        } else {
            throw new Error("El tipo de editRadar.id_radar no es válido.");
        }
        
        await axios.delete(endpoint, radarToDelete);
    } catch (error) {
        console.error('Error al guardar la edición:', error);
    }
}

export async function crearRadar({nombre, volumen, umbral}){
    try{
        const url = `${API_URL}/create/radar_virtual` 
        const response = await axios.post(url, { nombre, volumen, umbral })
        return response.data
    }catch(error) {
        console.error('Error al crear el Radar:', error);
        throw error;
    }
}