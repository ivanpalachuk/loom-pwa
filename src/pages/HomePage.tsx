import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from '../components/Camera';
import AccelerometerBall from '../components/AccelerometerBall';

export default function HomePage() {
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [showMix, setShowMix] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleModuleClick = (moduleId: string) => {
    if (moduleId === 'h20') {
      setShowCamera(true);
    } else if (moduleId === 'mix') {
      setShowMix(true);
    } else {
      console.log(`Módulo ${moduleId} - Próximamente`);
    }
  };

  const handlePhotoCapture = (imageData: string) => {
    setCapturedPhoto(imageData);
    setShowCamera(false);
    console.log('Foto capturada:', imageData.substring(0, 50) + '...');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const modules = [
    {
      id: 'h20',
      name: 'H2O',
      description: 'Gestión de agua'
    },
    {
      id: 'mix',
      name: 'MIX',
      description: 'Mezclas y fórmulas'
    },
    {
      id: 'unknown',
      name: '?',
      description: 'Próximamente'
    },
    {
      id: 'ecommerce',
      name: 'E-COM',
      description: 'Comercio electrónico'
    }
  ];

  return (
    <div className="h-screen bg-loom-10 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm relative flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-loom">loom</h1>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-600 hover:text-loom transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50 mr-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left hover:bg-loom-10 transition-colors flex items-center gap-3 text-gray-700 hover:text-loom"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-4 overflow-hidden">
        <div className="mb-3 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Módulos</h2>
          <p className="text-xs text-gray-600">Selecciona un módulo para comenzar</p>
        </div>

        {/* Módulos Lista - ocupan toda la altura disponible */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleClick(module.id)}
              className="flex-1 bg-loom hover:bg-loom-70 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center min-h-0"
            >
                <h3 className="text-4xl sm:text-5xl font-bold">
                  {module.name}
                </h3>
            </button>
          ))}
        </div>

        {/* Foto capturada */}
        {capturedPhoto && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Última foto capturada</h3>
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-full rounded-lg"
            />
            <button
              onClick={() => setCapturedPhoto(null)}
              className="mt-4 w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Eliminar
            </button>
          </div>
        )}
      </main>

      {/* Camera Modal */}
      {showCamera && (
        <Camera
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Mix Modal */}
      {showMix && (
        <AccelerometerBall
          onClose={() => setShowMix(false)}
        />
      )}
    </div>
  );
}
