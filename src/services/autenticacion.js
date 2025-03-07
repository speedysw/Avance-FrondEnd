const API_URL = import.meta.env.VITE_API_URL;

export async function loginService(username, password) {
    // Creamos los datos en formato URLSearchParams para simular un form-data
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    try {
        const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    });
    
        const data = await response.json();
    
        if (!response.ok) {
            // Aquí se podría manejar el error, por ejemplo, mostrando un mensaje
            console.error("Error:", data.mensaje);
            return null;
        }
    
        // En caso de éxito, el backend devuelve el token y otros datos
        console.log("Usuario autenticado", data);
        return data;
        } catch (error) {
        console.error("Error en la petición:", error);
        }
    }

export async function logoutService() {
    console.log("[authService] Logout service called");
}