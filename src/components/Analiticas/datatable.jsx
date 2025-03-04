import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PaginacionTable from './paginacionTable';

export function DataTable({
  data,
  columns,
  rowsPerPage: rowsPerPageProp = 10,
  isLoading = false,
  onRowClick,
  currentPage = 0,
  onPageChange,
}) {
  const [localPage, setLocalPage] = useState(currentPage);
  const [localRowsPerPage, setLocalRowsPerPage] = useState(rowsPerPageProp);

  useEffect(() => {
    setLocalPage(currentPage ?? 0);
  }, [currentPage]);

  const totalItems = data.length;
  const startIdx = localPage * localRowsPerPage;
  const endIdx = startIdx + localRowsPerPage;
  const paginatedData = data.slice(startIdx, endIdx);

  return (
    <div className="py-2">
      <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
        {isLoading && (
          <div className="p-4 text-sm font-bold text-blue-500 bg-gray-50">
            Cargando...
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-200 text-sm bg-white">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(item)}
                  className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                >
                  {columns.map((column, colIndex) => {
                    const cellValue =
                      typeof column.accessor === 'function'
                        ? column.accessor(item)
                        : item[column.accessor];
                    return (
                      <td
                        key={colIndex}
                        className="px-6 py-4 border-b border-gray-100 whitespace-nowrap"
                      >
                        {column.render
                          ? column.render(cellValue, item)
                          : String(cellValue ?? '')}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No hay datos para mostrar, verifique su conexión
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Aquí reemplazamos la paginación manual por el componente TablePaginations */}
        <div className="flex justify-center items-center mt-4">
          <PaginacionTable
            count={totalItems}
            currentPage={localPage}
            rowsPerPage={localRowsPerPage}
            onPageChange={(newPage) => {
              setLocalPage(newPage);
              onPageChange?.(newPage);
            }}
            onRowsPerPageChange={(newRowsPerPage) => {
              setLocalRowsPerPage(newRowsPerPage);
              // Opcional: reiniciar a la primera página al cambiar las filas por página
              setLocalPage(0);
            }}
          />
        </div>
      </div>
    </div>
  );
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  rowsPerPage: PropTypes.number,
  isLoading: PropTypes.bool,
  onRowClick: PropTypes.func,
  onLoadMore: PropTypes.func,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
};

export default DataTable;
