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
    return () => stopCamera();
  }, [startCamera, stopCamera]);

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
      stopCamera();
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur">
        <button
          onClick={() => {
            stopCamera();
            onClose?.();
          }}
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
      <div className="p-6 bg-black/50 backdrop-blur">
        {capturedImage ? (
          <div className="flex gap-4 justify-center">
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
          <div className="flex justify-center">
            <button
              onClick={handleCapture}
              disabled={!isStreaming}
              className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:border-loom transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Capturar foto</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
