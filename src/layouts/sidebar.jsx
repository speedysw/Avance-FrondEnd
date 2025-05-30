import { forwardRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "@/constants";
import { useAuth } from "../contexts/useAuth";
import { LogOut, UserCog } from "lucide-react";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";
import AdminModal from "../components/AdminModal";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const { logout, role } = useAuth();
    console.log("Este es el valor del ",role);
    const [showUserModal, setShowUserModal] = useState(false);

    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full flex-col overflow-x-hidden border-r border-slate-300 bg-white transition-all duration-300",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0"
            )}
        >
            <div className="flex gap-x-3 p-3">
                <img src={"/logo.png"} alt="Clonsa" className="dark:hidden" />
                <img src={"/logo.png"} alt="Clonsa" className="hidden dark:block" />
            </div>

            <div className="flex w-full flex-col gap-y-4 overflow-y-auto p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((navbarLink, indexGroup) => (
                    <nav
                        key={`group-${navbarLink.title}-${indexGroup}`}
                        className={cn("sidebar-group", collapsed && "md:items-center")}
                    >
                        {navbarLink.links.map((link, indexLink) => (
                            <NavLink
                                key={`link-${link.path}-${indexLink}`}
                                to={link.path}
                                className={cn(
                                    "sidebar-item flex items-center gap-x-4 p-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                    collapsed && "md:w-[45px] justify-center"
                                )}
                            >
                                <link.icon size={22} className="flex-shrink-0" />
                                {!collapsed && (
                                    <span className="origin-left duration-200 font-medium whitespace-nowrap">
                                        {link.label}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                ))}
            </div>

            <div className="mt-auto flex flex-col gap-2 p-3">
            {/* Mostrar solo si el usuario es Admin */}
            {role === 1 && (
                <button
                    onClick={() => setShowUserModal(true)}
                    className="sidebar-item flex items-center gap-x-4 p-3 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-black-900 transition-all duration-200 w-full"
                >
                    <UserCog className="w-5 h-5 text-gray-500" />
                    {!collapsed && (
                        <span className="origin-left duration-200 font-medium">
                            Gestión de Usuarios
                        </span>
                    )}
                </button>
            )}

            {/* Botón de Cerrar Sesión (Siempre visible) */}
            <button
                onClick={logout}
                className="flex items-center gap-x-4 p-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all duration-200 w-full"
            >
                <LogOut className="w-5 h-5 text-gray-500" />
                {!collapsed && (
                    <span className="origin-left duration-200 font-medium">
                        Cerrar Sesión
                    </span>
                )}
            </button>
        </div>


            {/* Modal solo para admins */}
            {showUserModal && <AdminModal onClose={() => setShowUserModal(false)} />}
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
