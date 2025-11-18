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

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur flex-shrink-0">
        <button
          onClick={handleClose}
          className="text-white p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-white font-semibold">Capturar Foto</h2>
        <div className="w-6"></div>
      </div>

      {/* Camera View or Preview */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
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

      {/* Controls */}
      <div className="p-8 bg-black/90 flex-shrink-0">
        {capturedImage ? (
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRetake}
              className="px-8 py-4 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-700 transition-colors text-lg"
            >
              Reintentar
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-4 bg-loom text-white rounded-full font-medium hover:bg-loom-70 transition-colors text-lg"
            >
              Usar Foto
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={handleCapture}
              disabled={!isStreaming}
              className="w-24 h-24 bg-white rounded-full shadow-2xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed relative ring-4 ring-loom/50"
              style={{ 
                background: 'white',
                border: '6px solid white',
              }}
            >
              <div className="absolute inset-3 bg-loom rounded-full"></div>
              <span className="sr-only">Capturar foto</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
