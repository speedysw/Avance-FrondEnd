import PropTypes from 'prop-types';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function PaginationControlled({ totalPages, currentPage, goToPage }) {
    const handleChange = (event, value) => {
        goToPage(value);
    };

    return (
        <Stack spacing={2}>
            <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handleChange} 
                shape="rounded"
            />
        </Stack>
    );
}

PaginationControlled.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    goToPage: PropTypes.func.isRequired,
};

export default PaginationControlled;
