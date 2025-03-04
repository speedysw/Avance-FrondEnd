import { useState } from "react";
import RadarCards from "./RadarCards"; // Asegúrate de importar el componente
// ... otros imports

const ParentComponent = () => {
    const [selectedOption, setSelectedOption] = useState("Todos");

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div>
            <select onChange={handleSelectChange} value={selectedOption}>
                <option value="Todos">Todos</option>
                <option value="Encendidos">Encendidos</option>
                <option value="Apagados">Apagados</option>
            </select>

            <RadarCards selectedOption={selectedOption} />
        </div>
    );
};

export default ParentComponent;
