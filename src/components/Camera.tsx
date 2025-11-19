import { useEffect } from 'react';
import { useCamera } from '../hooks/useCamera';

interface CameraProps {
  onCapture?: (imageData: string) => void;
  onClose?: () => void;
}

export default function Camera({ onCapture, onClose }: CameraProps) {
  const {
    videoRef,
    canvasRef,
    isStreaming,
    error,
    capturedImage,
    startCamera,
    stopCamera,
    capturePhoto,
    clearPhoto
  } = useCamera();

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    const image = capturePhoto();
    if (image && onCapture) {
      onCapture(image);
    }
  };

  const handleRetake = () => {
    clearPhoto();
  };

  const handleConfirm = () => {
    if (capturedImage && onCapture) {
      onCapture(capturedImage);
    }
    stopCamera();
    onClose?.();
  };

  const handleClose = () => {
    stopCamera();
    onClose?.();
  };

  const handleSimulateCapture = () => {
    // Use a simulated test strip image for development/testing
    // In production, this would be replaced with actual camera capture
    fetch('/water-test-strip-sample.png')
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          if (onCapture) {
            onCapture(base64data);
          }
          stopCamera();
          onClose?.();
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        // Fallback: create a simple colored rectangle as placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Create gradient background
          const gradient = ctx.createLinearGradient(0, 0, 800, 600);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(0.5, '#764ba2');
          gradient.addColorStop(1, '#f093fb');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 800, 600);

          // Add text
          ctx.fillStyle = 'white';
          ctx.font = 'bold 48px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Tira Reactiva Simulada', 400, 280);
          ctx.font = '24px sans-serif';
          ctx.fillText('(Imagen de prueba)', 400, 340);

          const imageData = canvas.toDataURL('image/png');
          if (onCapture) {
            onCapture(imageData);
          }
          stopCamera();
          onClose?.();
        }
      });
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur flex-shrink-0">
        <button
          onClick={handleClose}
          className="text-white p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-white font-semibold text-sm">Capturar Foto</h2>
        <div className="w-6"></div>
      </div>

      {/* Camera View or Preview */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden min-h-0">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-red-500/90 text-white p-4 rounded-lg max-w-sm">
              <p className="font-semibold mb-2">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="max-w-full max-h-full object-contain"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls - Siempre visible */}
      <div className="p-6 bg-black flex-shrink-0" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        {capturedImage ? (
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetake}
              className="px-6 py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-3 bg-loom text-white rounded-full font-medium hover:bg-loom-70 transition-colors"
            >
              Usar Foto
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={handleCapture}
              disabled={!isStreaming}
              className="w-20 h-20 bg-white rounded-full shadow-2xl active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed relative"
              style={{
                background: 'white',
                border: '5px solid white',
                boxShadow: '0 0 0 4px rgba(0, 78, 168, 0.3), 0 20px 50px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div className="absolute inset-2 bg-loom rounded-full"></div>
              <span className="sr-only">Capturar foto</span>
            </button>

            {/* Simulate button when camera is not available */}
            {error && (
              <button
                onClick={handleSimulateCapture}
                className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors shadow-lg"
              >
                🎭 Simular Captura
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
