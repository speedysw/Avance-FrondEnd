import PropTypes from 'prop-types';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';

// Estilo personalizado para el contenedor de TablePagination
const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    '& .MuiTablePagination-selectLabel': {
        marginRight: theme.spacing(1),
    },
    '& .MuiTablePagination-displayedRows': {
        marginLeft: theme.spacing(1),
    },
    '& .MuiTablePagination-actions': {
        marginLeft: theme.spacing(1),
    },
}));

export default function PaginacionTable({
  count,               // Total de filas
  currentPage,         // Página actual (0-indexada)
  rowsPerPage,         // Filas por página
  onPageChange,        // Función que se llama al cambiar de página
  onRowsPerPageChange, // Función que se llama al cambiar la cantidad de filas por página
}) {
    const handleChangePage = (event, newPage) => {
        onPageChange(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        onRowsPerPageChange(parseInt(event.target.value, 10));
    };

    return (
        <StyledTablePagination
            component="div"
            count={count}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
    );
}

PaginacionTable.propTypes = {
    count: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
};