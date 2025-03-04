import PropTypes from "prop-types";

const ProgressBar = ({ value, maxLitros, umbral }) => {
  const radius = 16; // Radio del círculo
  const circumference = 2 * Math.PI * radius; // Perímetro del círculo
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const currentLitros = Math.round((value / 100) * maxLitros);

  return (
    <div className="relative size-40">
      <svg
        className="size-full -rotate-90"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Círculo base en gris */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-gray-200"
          strokeWidth="2"
        ></circle>
        
        {/* Círculo de progreso condicional */}
        {value > umbral ? (
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-blue-600"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          ></circle>
        ) : (
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-red-600"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          ></circle>
        )}
      </svg>

      {/* Contenido central condicional */}
      <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2 text-center">
        {value > umbral ? (
          <>
            <span className="text-2xl font-bold text-blue-600">{value}%</span>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
              {currentLitros}L / {maxLitros}L
            </p>
          </>
        ) : (
          <>
            <span className="text-2xl font-bold text-red-600">{value}%</span>
            {/* Aquí puedes mostrar otro contenido si lo deseas */}
            <p className="text-sm font-medium text-red-600 dark:text-gray-50">
              {currentLitros}L / {maxLitros}L
            </p>
          </>
        )}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  maxLitros: PropTypes.number.isRequired,
  umbral: PropTypes.number.isRequired,
};

export default ProgressBar;
