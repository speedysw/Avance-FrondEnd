import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getUsers(token) {
    try {
        const response = await axios.get(`${API_URL}/users`, {headers: {Authorization: `Bearer ${token}`}});
        console.log("Estos son los datos dps del mapeo:", response.data)
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
}

export async function addUser(token, payload) {
    try {
        const mensaje = await axios.post(`${API_URL}/register`, payload, {headers: {Authorization: `Bearer ${token}`}});
        console.log(mensaje)
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
}

