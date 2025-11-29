import { useState } from 'react';
import { Modal } from '../../../components/ui';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (location: string) => void;
    title?: string;
    confirmButtonText?: string;
}

export function LocationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Ubicación del muestreo',
    confirmButtonText = 'Confirmar'
}: LocationModalProps) {
    const [useAutoLocation, setUseAutoLocation] = useState(true);
    const [customLocation, setCustomLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        let locationText = '';

        if (useAutoLocation) {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000
                    });
                });
                locationText = `Lat: ${position.coords.latitude.toFixed(6)}, Long: ${position.coords.longitude.toFixed(6)}`;
            } catch {
                alert('No se pudo obtener la ubicación automática');
                setIsLoading(false);
                return;
            }
        } else {
            if (!customLocation.trim()) {
                alert('Por favor ingresa una ubicación');
                setIsLoading(false);
                return;
            }
            locationText = customLocation;
        }

        setIsLoading(false);
        setCustomLocation('');
        onConfirm(locationText);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>

            <div className="space-y-4">
                {/* Opción automática */}
                <label 
                    className="flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors"
                    style={{ borderColor: useAutoLocation ? '#004EA8' : '#e5e7eb' }}
                >
                    <input
                        type="radio"
                        checked={useAutoLocation}
                        onChange={() => setUseAutoLocation(true)}
                        className="mt-1"
                    />
                    <div>
                        <p className="font-semibold text-gray-800">Usar ubicación automática</p>
                        <p className="text-sm text-gray-500">Obtener coordenadas GPS del dispositivo</p>
                    </div>
                </label>

                {/* Opción manual */}
                <label 
                    className="flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors"
                    style={{ borderColor: !useAutoLocation ? '#004EA8' : '#e5e7eb' }}
                >
                    <input
                        type="radio"
                        checked={!useAutoLocation}
                        onChange={() => setUseAutoLocation(false)}
                        className="mt-1"
                    />
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800">Escribir ubicación</p>
                        <p className="text-sm text-gray-500 mb-2">Ej: Lote 5, Campo San José</p>
                        {!useAutoLocation && (
                            <input
                                type="text"
                                value={customLocation}
                                onChange={(e) => setCustomLocation(e.target.value)}
                                placeholder="Ingresá la ubicación..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-loom"
                            />
                        )}
                    </div>
                </label>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 bg-loom text-white rounded-xl font-semibold disabled:opacity-50"
                >
                    {isLoading ? 'Obteniendo...' : confirmButtonText}
                </button>
            </div>
        </Modal>
    );
}

export default LocationModal;
