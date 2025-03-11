import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/page";
import Tabla from "./routes/analiticas";
import Graficos from "./routes/charts";
import Radares from "./routes/radares";
import ProtectedRoute from "./routes/routeProtected";
import Login from "./routes/login";

const router = createBrowserRouter([
  // Ruta pública: login
    {
        path: "/login",
        element: <Login />,
    },
    // Rutas protegidas: Definimos un path base para ellas
    {
        path: "/",
        element: (
        <ProtectedRoute>
            <Layout />
        </ProtectedRoute>
        ),
        children: [
        // Opción 1: definir el dashboard como index (ruta "/")
        {
            index: true,
            element: <DashboardPage />,
        },
        // Opción 2: tener un path específico
        {
            path: "Dashboard",
            element: <DashboardPage />,
        },
        {
            path: "Analiticas",
            element: <Tabla />,
        },
        {
            path: "Graficos",
            element: <Graficos />,
        },
        {
            path: "Radares",
            element: <Radares />,
        },
        ],
    },
    // Manejo de rutas no definidas: Redirige al login
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    },
    ]);

    export default function App() {
    return (
        <RouterProvider router={router} />
    );
}
