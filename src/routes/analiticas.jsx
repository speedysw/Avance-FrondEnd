import { useState, useEffect } from 'react';
//Componentes
import DataTable from '../components/Analiticas/datatable';
import { FiltroTabla } from '../components/Analiticas/filtroTabla';
//Utilidades
import { ObtenerColumnas } from '../services/analiticas';
import { ObtenerDatos } from '../services/analiticas';
import { DownloadCSV } from '../services/analiticas';
import { Chip } from "@material-tailwind/react";

const RegistroAnaliticas = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [columns, setColumns] = useState([]);
    const [filters, setFilters] = useState({
      radar: '',
      estado: '',
      cantidad: '',
      fecha_registro: '',
    });

    // Carga de datos inicial para la DataTable
    useEffect(() => {
      getData(); 
      // eslint-disable-next-line
    }, [offset, filters]);

    // Estado para los filtros
    useEffect(() => {
      setOffset(0);
      setData([]);
    }, [filters]);

    // Reinicio de los filtros 
    const handleResetFilters = () => {
      setFilters({
        radar: '',
        estado: '',
        cantidad: '',
        fecha_registro: '',
      });
      setCurrentPage(0);
    };
  
    // Función de cambios de los filtros, reinicnado los filtros cuando se escoge un radar nuevo
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      if (name === 'radar' && value) {
        setFilters({ radar: value, estado: '', cantidad: '', fecha_registro: '' });
      } else {setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value || '',
      }));
    }
    setCurrentPage(0);
    };
    

    // Funciones para obtener los datos
    const getData = async () => {
      try {
        setIsLoading(true);
        const result = await ObtenerDatos(filters);
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setData([]); // Asegura que data sea un array aunque falle la llamada
      } finally {
        setIsLoading(false);
      }
    };

    const onExportCSV = () => {
      DownloadCSV(filters);
    };
    // Estado para obtener las columnas de los radares
    useEffect(() => {
      const fetchColumns = async () => {
        try {
          const columnsData = await ObtenerColumnas('historial_radar');
          const columns = columnsData.map((column) => {
            return {
                header: column.charAt(0).toUpperCase() + column.slice(1), // Capitalizar el primer carácter
                accessor: column, // Identificador para acceder a los datos
                render: (value) => {
                    if (column === 'fecha') {
                        const date = new Date(value);
                        return date.toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true
                        }).replaceAll("/", "-");
                    } else if (column === 'estado') {
                        const isActive = value === true || value === 'activo';
                        return (
                            <div className="w-max">
                                <Chip
                                    variant="ghost"
                                    size="sm"
                                    value={isActive ? "encendido" : "apagado"}
                                    color={isActive ? "green" : "red"}
                                >
                                    {isActive ? "Encendido" : "Apagado"} 
                                </Chip>
                            </div>
                        );
                    }else if (column === 'combustible') {
                        return `${parseFloat(value).toFixed(2)}%`;
                    }
                    return value;
                }
            };
        });

          setColumns(columns);
          setIsLoading(false);
        } catch (error) {
          console.error("Error al obtener las columnas:", error);
        }
      };
      fetchColumns();
    }, []);

    return (
      <div className="container mx-auto px-4 py-4">
        <FiltroTabla
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onExportCSV={onExportCSV}
        />
        <div>
          <DataTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    );
};

export default RegistroAnaliticas;
