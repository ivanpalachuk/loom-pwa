import { useState } from 'react';
import { PageHeader } from '../components/ui';

// Datos mockeados de ubicaciones
const MOCK_LOCATIONS = [
  { id: 1, name: 'Lote Norte', lat: -38.0055, lng: -57.5426, status: 'good', lastAnalysis: '2026-01-14' },
  { id: 2, name: 'Lote Sur', lat: -38.0155, lng: -57.5326, status: 'warning', lastAnalysis: '2026-01-10' },
  { id: 3, name: 'Lote Este', lat: -38.0085, lng: -57.5226, status: 'good', lastAnalysis: '2026-01-08' },
  { id: 4, name: 'H2O Control (Sede)', lat: -38.0234, lng: -57.5892, status: 'info', lastAnalysis: null },
];

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<typeof MOCK_LOCATIONS[0] | null>(null);

  // Centro del mapa (Batán, Buenos Aires)
  const centerLat = -38.01;
  const centerLng = -57.55;

  // Construir URL de OpenStreetMap embed
  const getMapUrl = () => {
    const bbox = `${centerLng - 0.05},${centerLat - 0.03},${centerLng + 0.05},${centerLat + 0.03}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'good': return 'Óptimo';
      case 'warning': return 'Atención';
      case 'critical': return 'Crítico';
      case 'info': return 'Información';
      default: return 'Sin datos';
    }
  };

  const openInGoogleMaps = (lat: number, lng: number, name: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="Mapa" showBack />

      <div className="relative">
        {/* Mapa OpenStreetMap embebido */}
        <div className="relative h-[50vh] bg-gray-200">
          <iframe
            title="Mapa de ubicaciones"
            src={getMapUrl()}
            className="w-full h-full border-0"
            style={{ filter: 'saturate(1.1)' }}
          />
          
          {/* Overlay con marcadores simulados */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Indicador de que es un mapa de demo */}
            <div className="absolute top-2 left-2 right-2 bg-yellow-100 border border-yellow-400 rounded-lg p-2 pointer-events-auto">
              <p className="text-xs text-yellow-800 text-center">
                🗺️ Vista previa del mapa. Los marcadores se mostrarán con integración completa.
              </p>
            </div>
          </div>
        </div>

        {/* Lista de ubicaciones */}
        <div className="p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Ubicaciones registradas
          </h3>

          <div className="space-y-3">
            {MOCK_LOCATIONS.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`w-full bg-white rounded-xl p-4 shadow-md border-2 transition-all text-left ${
                  selectedLocation?.id === location.id ? 'border-loom' : 'border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(location.status)} mt-1`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800">{location.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        location.status === 'good' ? 'bg-green-100 text-green-700' :
                        location.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        location.status === 'info' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {getStatusLabel(location.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                    {location.lastAnalysis && (
                      <p className="text-xs text-gray-400 mt-1">
                        Último análisis: {location.lastAnalysis}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel de detalle de ubicación seleccionada */}
        {selectedLocation && (
          <div className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 border-2 border-loom z-50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-800">{selectedLocation.name}</h4>
                <p className="text-sm text-gray-500">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLocation(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openInGoogleMaps(selectedLocation.lat, selectedLocation.lng, selectedLocation.name)}
                className="flex-1 py-2 bg-loom text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Ver en Google Maps
              </button>
              {selectedLocation.status !== 'info' && (
                <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Ver análisis
                </button>
              )}
            </div>
          </div>
        )}

        {/* Botón para agregar ubicación */}
        <div className="px-4 pb-4">
          <button className="w-full py-3 bg-loom text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar nueva ubicación
          </button>
        </div>
      </div>
    </div>
  );
}
