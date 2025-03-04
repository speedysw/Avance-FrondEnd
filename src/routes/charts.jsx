import { useState, useEffect } from "react";
import GraficoFiltrado from "../components/Graficos/grafico"; // Asegúrate de que la ruta sea correcta
import { GraficoDatos } from "../services/analiticas";
import { FiltroGrafico } from "../components/Graficos/filtroGrafico";

const Charts = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState({
    radar: "",
    fecha_inicio: "",
    fecha_final: "",
  });

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [offset, filters]);

  useEffect(() => {
    setOffset(0);
    setData([]);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      radar: "",
      fecha_inicio: "",
      fecha_final: "",
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Si se selecciona un radar, resetea las fechas
    if (name === "radar" && value) {
      setFilters({ radar: value, fecha_inicio: "", fecha_final: "" });
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value || "",
      }));
    }
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      const result = await GraficoDatos(filters); // Obtiene los datos filtrados
      console.log(result)
      const chartData = result
      .map(item => ({
        date: new Date(item.fecha).getTime(), 
        value: item.combustible
      }))
      .sort((a, b) => a.date - b.date);  // Orden ascendente por fecha      
      setData(chartData);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <FiltroGrafico
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      <GraficoFiltrado data={data} isLoading={isLoading} />
    </div>
  );
};

export default Charts;
