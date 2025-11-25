import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from '../components/Camera';
import PhotoConfirm from '../components/PhotoConfirm';

export default function HomePage() {
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showPhotoConfirm, setShowPhotoConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleModuleClick = (moduleId: string) => {
    if (moduleId === 'h20') {
      setShowCamera(true);
    } else if (moduleId === 'mix') {
      navigate('/mix');
    } else {
      console.log(`Módulo ${moduleId} - Próximamente`);
    }
  };

  const handlePhotoCapture = (imageData: string) => {
    setCapturedPhoto(imageData);
    setShowCamera(false);
    setShowPhotoConfirm(true);
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      setShowPhotoConfirm(false);
      navigate('/water-analysis', { state: { imageData: capturedPhoto } });
    }
  };

  const handleRetakePhoto = () => {
    setShowPhotoConfirm(false);
    setCapturedPhoto(null);
    setShowCamera(true);
  };

  const handleCancelPhoto = () => {
    setShowPhotoConfirm(false);
    setCapturedPhoto(null);
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
    <div className="bg-gray-50 flex flex-col overflow-hidden" style={{ height: '100dvh' }}>
      {/* Header */}
      <header className="bg-white shadow-sm relative flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <img src="/logotest.png" alt="Loom" className="h-12" />
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
        {/* Módulos Grid 2x2 - ocupan toda la altura disponible */}
        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleClick(module.id)}
              className="bg-loom text-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3),0_10px_30px_-5px_rgba(0,78,168,0.5)] active:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] active:scale-95 transition-all duration-150 flex items-center justify-center border-2 border-black/10"
            >
              <h3 className="text-4xl sm:text-5xl font-bold">
                {module.name}
              </h3>
            </button>
          ))}
        </div>
      </main>

      {/* Camera Modal */}
      {showCamera && (
        <Camera
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Photo Confirmation Modal */}
      {showPhotoConfirm && capturedPhoto && (
        <PhotoConfirm
          imageData={capturedPhoto}
          onConfirm={handleConfirmPhoto}
          onRetake={handleRetakePhoto}
          onCancel={handleCancelPhoto}
        />
      )}
    </div>
  );
}
