import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Brush, 
  ResponsiveContainer 
} from 'recharts';
import PropTypes from 'prop-types';

export default function GraficoFiltrado({ data, isLoading }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {isLoading && (
        <div className="p-4 text-sm font-bold text-blue-500 bg-gray-50">
          Cargando...
        </div>
      )}
      {/* Contenedor con altura fija (400px) y ancho 100% */}
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(time) => {
                const date = new Date(time);
                return date.toLocaleDateString();
              }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleString();
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              name="Combustible"
              stroke="#8884d8"
              dot={false}
            />
            <Brush dataKey="date" tickFormatter={() => ""} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

GraficoFiltrado.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};
