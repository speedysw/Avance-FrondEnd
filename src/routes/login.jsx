import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth"
import { useState } from "react";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setShowSuccess(false);

        try {
            await login(username, password);
            setShowSuccess(true);
            navigate("/");
        } catch (error) {
            setErrorMsg("Usuario o contraseña incorrectos");
            console.log(error)
        }
    }

    return (
        <>
            {/*
            This example requires updating your template:
    
            ```
            <html class="h-full bg-white">
            <body class="h-full">
            ```
            */}
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Sign in to your account
                </h2>
            </div>

            <div className="fixed top-4 right-4 z-50 w-80 md:w-1/4 space-y-4">
                {showSuccess && (
                <div className="bg-green-50 border border-green-400 text-green-800 px-4 py-2 rounded shadow">
                <span>¡Login exitoso!</span>
                </div>
                )}
            {errorMsg && (
                <div className="bg-red-50 border border-red-400 text-red-800 px-4 py-2 rounded shadow">
                    <span>{errorMsg}</span>
                </div>
                )}
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit}>
                {/* Campo de Username (el backend requiere "username" en lugar de "email") */}
                <div className="mb-4">
                    <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-600"
                    >
                    Usuario
                    </label>
                    <input
                    id="username"
                    type="text"
                    placeholder="Ingrese su usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Campo de Contraseña con icono para mostrar/ocultar */}
                <div className="mb-4">
                    <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-600"
                    >
                    Contraseña
                    </label>
                    <input
                    id="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div>
                    <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                    Ingresar
                    </button>
                </div>
                </form>  
                </div>
            </div>
        </>
    )
}