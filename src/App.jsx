import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/page";
import Tabla from "./routes/analiticas";
import Graficos from "./routes/charts";
import Radares from "./routes/radares";
import ProtectedRoute from "./routes/routeProtected";
import Login from "./routes/login"; // Asegúrate de tener tu componente de login

function App() {
    const router = createBrowserRouter([
        // Ruta pública para el login
        {
        path: "/login",
        element: <Login />,
        },
        // Rutas protegidas
        {
        element: <ProtectedRoute />,
        children: [
            {
            path: "/",
            element: <Layout />,
            children: [
                {
                index: true,
                element: <DashboardPage />,
                },
                {
                path: "analytics",
                element: <Tabla />,
                },
                {
                path: "graficos",
                element: <Graficos />,
                },
                {
                path: "radares",
                element: <Radares />,
                },
                {
                path: "new-customer",
                element: <h1 className="title">New Customer</h1>,
                },
                {
                path: "verified-customers",
                element: <h1 className="title">Verified Customers</h1>,
                },
                {
                path: "products",
                element: <h1 className="title">Products</h1>,
                },
                {
                path: "new-product",
                element: <h1 className="title">New Product</h1>,
                },
                {
                path: "inventario",
                element: <h1 className="title">Inventario</h1>,
                },
            ],
            },
        ],
        },
  ]);

    return (
        <ThemeProvider storageKey="theme">
        <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
