// Radares.jsx
import { useState, useEffect } from 'react';

//Componentes
import { DataTable } from '../components/Analiticas/datatable';
import { AddModalRadar } from '../components/ListaRadares/addModal';
import { EditModalRadar } from '../components/ListaRadares/editModal';
import  DeleteRadar  from '../components/ListaRadares/deleteModal';

// Servicios
import TabsTable from '../components/ListaRadares/Tabs';
import { DeletedRadar, fetchDatosVirtuales, ObtenerDatos, UpdateRadar } from '../services/radares';

//Utilidades
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chip } from "@material-tailwind/react";
import { useAuth } from "../contexts/useAuth";

const Radares = () => {
    // Estados y lógica existentes
    const [data, setData] = useState([]);
    const [virtualData, setVirtualData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState(null);
    const { role } = useAuth();

    // Estados para manejar las variables escogidas para los modales
    const [radarToEdit, setRadarToEdit] = useState(null);
    const [radarToDelete, setRadarToDelete] = useState(null);

    // Estados para manejar los modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    //const [addSuccess, setAddSuccess] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Declaración de columnas para la data tables
    const columnas = [
        { header: 'Identificador', accessor: 'id_radar' },
        { header: 'Nombre', accessor: 'nombre' },
        { header: 'Volumen', accessor: 'volumen' },
        { header: 'Umbral', accessor: 'umbral' },
        {
        header: 'Fecha de registro',
        accessor: 'fecha',
        render: (value) => {
            if (!value) return '';
            const fecha = new Date(value);
            return fecha.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            });
        },
        },
        ...(role === 1
            ? [{
                header: 'Acciones',
                accessor: (row) => row,
                render: (cellValue, rowData) => (
                  <div className="flex space-x-3 px-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRadarToEdit(rowData);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil size={20} strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRadarToDelete(rowData);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={20} strokeWidth={1.5} />
                    </button>
                  </div>
                ),
              }]
            : [])
    ];

    const columnasVirtuales = [
        { header: 'Identificador', accessor: 'id_registro' },
        { header: 'Nombre', accessor: 'nombre' },
        { header: 'Volumen', accessor: 'volumen' },
        { header: 'Umbral', accessor: 'umbral' },
        { header: 'Vinculacion', accessor: 'vinculacion' ,
            render: (value) => {
                const isActive = value === true;
                        return (
                            <div className="w-max">
                                <Chip
                                    variant="ghost"
                                    size="sm"
                                    value={isActive ? "Vinculado" : "No Vinculado "}
                                    color={isActive ? "green" : "red"}
                                >
                                    {isActive ? "Encendido" : "Apagado"} 
                                </Chip>
                            </div>
                        );
            }
        },
        { header: 'Asociado', accessor: 'id_vinculacion' },
        ...(role === 1
            ? [{
                header: 'Acciones',
                accessor: (row) => row,
                render: (cellValue, rowData) => (
                  <div className="flex space-x-3 px-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRadarToEdit(rowData);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil size={20} strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRadarToDelete(rowData);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={20} strokeWidth={1.5} />
                    </button>
                  </div>
                ),
              }]
            : [])
    ];

    // Funciones para actualizar los datos de las tablas
    const getData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await ObtenerDatos();
          // Verificamos que result sea un array. Si no, se asigna un array vacío o se extrae la propiedad adecuada
            setData(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setError('Error al obtener los datos');
            toast.error("Error al obtener los datos");
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };  

    const getVirtualData = async () => {
        try {
            const dataVirtual = await fetchDatosVirtuales();
            setVirtualData(dataVirtual);
        } catch (err) {
            console.error(err);
            setError('Error al obtener datos virtuales');
        }
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([getData(), getVirtualData()]).finally(() => setIsLoading(false));
    }, []);

    //Funciones para manejar la creación, edición y eliminación
    const handleCreated = () => {
        getData();
        getVirtualData();
        //setAddSuccess(true);
        toast.success("Radar creado con éxito");
    };

    const handleSaveEdit = async (editedRadar) => {
        try {
        await UpdateRadar(editedRadar);
        toast.success("Radar actualizado con éxito");
        getData();
        getVirtualData();
        setIsEditModalOpen(false);
        } catch (error) {
        console.error('Error al guardar la edición:', error);
        toast.error("Error al actualizar el radar");
        }
    };

    const handleDeleteRadar = async () => {
        if (!radarToDelete) return;
        try {
            await DeletedRadar(radarToDelete);
            // Actualiza el estado de dispositivos físicos si existe la propiedad id_radar
            if (radarToDelete.id_radar) {
                setData((prevData) =>
                    prevData.filter((radar) => radar.id_radar !== radarToDelete.id_radar)
                );
            }
            // Actualiza el estado de dispositivos virtuales si existe la propiedad id_registro
            if (radarToDelete.id_registro) {
                setVirtualData((prevData) =>
                    prevData.filter((radar) => radar.id_registro !== radarToDelete.id_registro)
                );
            }
            toast.success("Radar eliminado con éxito");
            setIsDeleteModalOpen(false);
            setRadarToDelete(null);
        } catch (error) {
            console.error('Error al eliminar el radar:', error);
            toast.error("Error al eliminar el radar");
        }
    };
    const handleRowClick = (rowData) => {
        console.log('Fila clickeada:', rowData);
    };

    return (
        <div className="py-4">
        <div className="relative p-6 text-left font-medium text-gray-600 bg-white shadow rounded-lg mb-4">
            <h2 className="text-xl font-semibold">Radares</h2>
            <div className="absolute top-4 right-4 flex space-x-2">
            {role === 1 && (
                <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Radar
                </button>
                )}
            </div>
        </div>
        {error && (
            <div className="mb-4 text-red-700 bg-red-100 border border-red-400 p-2 rounded">
            {error}
            </div>
        )}

        {/* Integración de Tabs para alternar entre las dos tablas */}
        <TabsTable
        tabs={[
            { value: 'physical', label: 'Dispositivos Físicos' },
            { value: 'virtual', label: 'Dispositivos Virtuales' }
        ]}
        >
        {{
            physical: (
            <DataTable
                data={data}
                columns={columnas}
                isLoading={isLoading}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onRowClick={handleRowClick}
            />
            ),
            virtual: (
            <DataTable
                data={virtualData}
                columns={columnasVirtuales}
                isLoading={isLoading}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onRowClick={handleRowClick}
            />
            ),
        }}
        </TabsTable>

        {/* Modal de edición */}
        <EditModalRadar
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            radar={radarToEdit}
            onSave={handleSaveEdit}
        />

        {/* Modal para agregar */}
        <AddModalRadar
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onCreated={handleCreated}
        />

        {/* Modal para borrar */}
        <DeleteRadar
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onDelete={handleDeleteRadar}
            radar={radarToDelete}
        />

        <ToastContainer position="top-right" autoClose={3000} />
    </div>
    );
};

export default Radares;
