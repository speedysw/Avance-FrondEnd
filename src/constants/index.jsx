import { ChartColumn, Home, Table2Icon, RadarIcon} from "lucide-react";

export const navbarLinks = [
    {
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/Dashboard",
            },
            {
                label: "Tablas",
                icon: Table2Icon,
                path: "/Analiticas",
            },
            {
                label: "Grafico",
                icon: ChartColumn,
                path: "/Graficos",
            },
            {
                label: "Radares",
                icon: RadarIcon,
                path: "/Radares",
            }
        ],
    },
];

