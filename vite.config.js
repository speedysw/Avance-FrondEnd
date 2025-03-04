import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0", // Permite que otros dispositivos en la red accedan
        port: 3000, // Puedes cambiar el puerto si es necesario
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});

