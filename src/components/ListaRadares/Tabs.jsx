import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

function TabsTable({ tabs, children }) {
  // Si tabs es undefined o está vacío, usamos un array vacío para evitar errores.
    const initialTab = tabs && tabs.length > 0 ? tabs[0].value : '';
    const [value, setValue] = useState(initialTab);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
        <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="Tabs para dispositivos"
        >
            {tabs && tabs.length > 0 && tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
        </Tabs>
        <Box sx={{ mt: 2 }}>
            {children[value]}
        </Box>
        </Box>
    );
    }

    TabsTable.propTypes = {
    // 'tabs' es un array de objetos con 'value' y 'label'
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        })
    ).isRequired,
    // 'children' es un objeto en el que las claves son strings y los valores son nodos de React
    children: PropTypes.objectOf(PropTypes.node).isRequired,
};

export default TabsTable;
