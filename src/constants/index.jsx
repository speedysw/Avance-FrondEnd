import { ChartColumn, Home, Table2Icon, RadarIcon} from "lucide-react";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/",
            },
            {
                label: "Tablas",
                icon: Table2Icon,
                path: "/analytics",
            },
            {
                label: "Grafico",
                icon: ChartColumn,
                path: "/graficos",
            },
            {
                label: "Radares",
                icon: RadarIcon,
                path: "/radares",
            }
        ],
    },
];

