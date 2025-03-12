import { useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { CircleAlert } from 'lucide-react';
import PropTypes from 'prop-types';

export default function TemporizadorModal({ isOpen, onClose, onActive, radar }) {
  // Opcional: puedes realizar alguna acción cuando el radar cambie
    useEffect(() => {
        // Por ejemplo, si necesitas limpiar errores o realizar otra acción
    }, [radar]);
    console.log("Este es el valor del radar", radar)
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
        <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CircleAlert aria-hidden="true" className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                        Activar Temporizador
                    </DialogTitle>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                        ¿Deseas activar el temporizador? El radar se desactivará automáticamente al finalizar el tiempo programado.
                        </p>
                    </div>
                    </div>
                </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                    type="button"
                    onClick={onActive}
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-700 sm:ml-3 sm:w-auto"
                >
                    Confirmar
                </button>
                <button
                    type="button"
                    data-autofocus
                    onClick={onClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                    Cancelar
                </button>
                </div>
            </DialogPanel>
            </div>
        </div>
        </Dialog>
    );
}

TemporizadorModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onActive: PropTypes.func.isRequired,
    radar: PropTypes.shape({
        id_radar: PropTypes.string,
    }),
};