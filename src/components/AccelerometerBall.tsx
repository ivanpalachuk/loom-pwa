import { useEffect, useState } from 'react';
import { useAccelerometer } from '../hooks/useAccelerometer';

interface AccelerometerBallProps {
  onClose?: () => void;
}

export default function AccelerometerBall({ onClose }: AccelerometerBallProps) {
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 }); // Porcentaje
  
  const { data, isSupported, permission, error, requestPermission } = useAccelerometer();
  
  const needsPermission = isSupported && permission === 'prompt';

  useEffect(() => {
    if (data.x === null || data.y === null || permission !== 'granted') {
      return;
    }

    let animationFrame: number;
    
    const updatePosition = () => {
      setBallPosition(prev => {
        const sensitivity = 2;
        
        let newX = prev.x + (data.x || 0) * sensitivity;
        let newY = prev.y - (data.y || 0) * sensitivity; // Invertido
        
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));
        
        return { x: newX, y: newY };
      });
      
      animationFrame = requestAnimationFrame(updatePosition);
    };
    
    animationFrame = requestAnimationFrame(updatePosition);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [data.x, data.y, permission]);

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-loom-10 to-loom-20 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur shadow-sm">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-loom p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-loom">MIX - Acelerómetro</h2>
        <div className="w-6"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Instrucciones o error */}
        {!isSupported && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm text-center">
              <p className="text-red-600 font-semibold mb-2">Acelerómetro no disponible</p>
              <p className="text-sm text-gray-600">Tu dispositivo no soporta el acelerómetro.</p>
            </div>
          </div>
        )}

        {needsPermission && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm text-center">
              <p className="text-loom font-semibold mb-3 text-lg">Permiso necesario</p>
              <p className="text-sm text-gray-600 mb-4">
                Para usar el acelerómetro, necesitas dar permiso (requerido en iOS).
              </p>
              <button
                onClick={handleRequestPermission}
                className="w-full px-6 py-3 bg-loom text-white rounded-lg font-medium hover:bg-loom-70 transition-colors"
              >
                Permitir acceso
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-red-500 text-white p-3 rounded-lg shadow-lg text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Pelota */}
        {isSupported && permission === 'granted' && (
          <>
            {/* Guías visuales */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-1 h-full bg-gray-300/30"></div>
              <div className="absolute w-full h-1 bg-gray-300/30"></div>
            </div>

            {/* La pelota */}
            <div
              className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-loom to-loom-70 shadow-2xl transition-all duration-100 ease-out"
              style={{
                left: `${ballPosition.x}%`,
                top: `${ballPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 10px 40px rgba(0, 78, 168, 0.4)',
              }}
            >
              <div className="absolute inset-2 rounded-full bg-white/30"></div>
            </div>

            {/* Info de debug */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600">X:</span>{' '}
                  <span className="font-bold text-loom">{data.x?.toFixed(2) || '0.00'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Y:</span>{' '}
                  <span className="font-bold text-loom">{data.y?.toFixed(2) || '0.00'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Z:</span>{' '}
                  <span className="font-bold text-loom">{data.z?.toFixed(2) || '0.00'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Pos:</span>{' '}
                  <span className="font-bold text-loom">
                    {ballPosition.x.toFixed(0)}, {ballPosition.y.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Instrucción inicial */}
        {isSupported && permission === 'granted' && (
          <div className="absolute top-4 left-4 right-4 bg-loom/90 text-white p-3 rounded-lg text-center text-sm">
            🎯 Inclina tu dispositivo para mover la pelota
          </div>
        )}
      </div>
    </div>
  );
}
