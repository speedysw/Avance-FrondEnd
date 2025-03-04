import { Progress } from "@heroui/progress";
import PropTypes from "prop-types";

ProgressBarPrueba.propTypes = {
  value: PropTypes.number.isRequired,
  maxLitros: PropTypes.number.isRequired,
  umbral: PropTypes.number.isRequired,
};

export default function ProgressBarPrueba({ value, maxLitros, umbral }) {
  const currentLitros = Math.round((value / 100) * maxLitros);
  const isBelowUmbral = value < umbral;
  const indicatorColor = isBelowUmbral ? "bg-red-600" : "bg-green-600";
  const textColor = isBelowUmbral ? "text-red-600" : "text-black";

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {/* Contenedor con dimensiones fijas para la barra */}
      <div className="w-64 h-64 relative flex justify-center items-center">
        {/* Contenedor absoluto para centrar la barra rotada */}
        <div className="absolute inset-0 flex justify-center items-center -rotate-90">
          <Progress
            aria-label="Nivel de combustible"
            label=""
            showValueLabel={false}
            classNames={{
              // Usamos w-full y h-full para que la barra se ajuste al contenedor
              base: "w-64 h-8",
              track: "drop-shadow-md border border-default h-8",
              indicator: indicatorColor,
            }}
            radius="sm"
            size="sm"
            value={value}
          />
        </div>
      </div>

      {/* Textos con el valor y litros */}
      <span className={`mt-2 font-medium ${textColor} text-2xl`}>{value}%</span>
      <p className={`mt-2 font-medium ${textColor}`}>
        {currentLitros}L / {maxLitros}L
      </p>
    </div>
  );
}
