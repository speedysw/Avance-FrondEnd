import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function ObtenerColumnas(historial_radar) {
    try {
        const response = await axios.get(`${API_URL}/columns/${historial_radar}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
}

export async function ObtenerDatos(filtros) {
    try{
        const queryParams = new URLSearchParams(filtros).toString();
        const url = queryParams ? `${API_URL}/get_datos?${queryParams}` : `${API_URL}/get_datos`;
        const response = await axios.get(url);
        const radar_datos = response.data;
        console.log("Datos obtenidos:",radar_datos)
        return radar_datos
    }catch (error){
        console.error('Error:', error)
        return error
    }
}

export default async function fetchCantidadRadares() {
    try {
        const response = await axios.get(`${API_URL}/datos/radares`);
        const cant_radares = response.data;
        return cant_radares;
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
}

export async function GraficoDatos(filtros) {
    try{
        const queryParams = new URLSearchParams(filtros).toString();
        const url = queryParams ? `${API_URL}/get_datos_by_range?${queryParams}` : `http://192.168.0.112:8000/get_datos_by_range`;
        const response = await axios.get(url);
        const radar_datos = response.data;
        console.log("Datos obtenidos:",radar_datos)
        return radar_datos
    }catch (error){
        console.error('Error:', error)
        return error
    }
}

