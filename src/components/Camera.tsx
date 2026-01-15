import { useEffect } from 'react';
import { useCamera } from '../hooks/useCamera';

interface CameraProps {
  onCapture?: (imageData: string) => void;
  onClose?: () => void;
  showStripGuide?: boolean; // Mostrar guía para tira reactiva
}

export default function Camera({ onCapture, onClose, showStripGuide = false }: CameraProps) {
  const {
    videoRef,
    canvasRef,
    isStreaming,
    error,
    capturedImage,
    torchEnabled,
    torchSupported,
    startCamera,
    pauseCamera,
    capturePhoto,
    clearPhoto,
    toggleTorch
  } = useCamera();

  useEffect(() => {
    startCamera();

    return () => {
      // Pausar en lugar de detener para mantener permisos
      pauseCamera();
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
    pauseCamera(); // Pausar en lugar de detener
    onClose?.();
  };

  const handleClose = () => {
    pauseCamera(); // Pausar en lugar de detener
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
          pauseCamera();
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
          pauseCamera();
          onClose?.();
        }
      });
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden" style={{ height: '100dvh' }}>
      {/* Video fullscreen como fondo */}
      <div className="absolute inset-0">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Overlay de error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
          <div className="bg-red-500/90 text-white p-4 rounded-2xl max-w-sm backdrop-blur">
            <p className="font-semibold mb-2">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Guía visual para tira reactiva */}
      {showStripGuide && isStreaming && !capturedImage && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          {/* Área de la tira */}
          <div className="relative flex flex-col items-center">
            {/* Marco de la tira con sombra que oscurece el resto */}
            <div 
              className="relative border-2 border-white/90 rounded-xl bg-transparent"
              style={{ 
                width: '90px', 
                height: '360px',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)'
              }}
            >
              {/* Indicadores de las 4 zonas de color */}
              <div className="absolute inset-x-2 top-[5%] h-[14%] border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                <span className="text-[10px] text-white/70 font-medium">FCL</span>
              </div>
              <div className="absolute inset-x-2 top-[27%] h-[14%] border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                <span className="text-[10px] text-white/70 font-medium">ALK</span>
              </div>
              <div className="absolute inset-x-2 top-[49%] h-[14%] border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                <span className="text-[10px] text-white/70 font-medium">pH</span>
              </div>
              <div className="absolute inset-x-2 top-[71%] h-[14%] border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                <span className="text-[10px] text-white/70 font-medium">TH</span>
              </div>
            </div>
            
            {/* Instrucciones */}
            <div className="mt-6 text-center px-4">
              <p className="text-white text-base font-semibold drop-shadow-lg">Centra la tira aquí</p>
              <p className="text-white/80 text-sm mt-1 drop-shadow">Alinea los cuadrados de color</p>
            </div>
          </div>
        </div>
      )}

      {/* Header flotante con glassmorphism */}
      <div className="relative z-30 flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur-md">
        <button
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white active:bg-black/60 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-white font-semibold text-sm drop-shadow">
          {showStripGuide ? 'Escanear Tira' : 'Capturar Foto'}
        </h2>
        
        {/* Botón de linterna */}
        {torchSupported && !capturedImage ? (
          <button
            onClick={toggleTorch}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              torchEnabled 
                ? 'bg-yellow-400 text-black' 
                : 'bg-black/40 text-white active:bg-black/60'
            }`}
          >
            <svg className="w-5 h-5" fill={torchEnabled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>
        ) : (
          <div className="w-10"></div>
        )}
      </div>

      {/* Spacer flexible */}
      <div className="flex-1" />

      {/* Controls flotantes abajo */}
      <div 
        className="relative z-30 p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        {capturedImage ? (
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRetake}
              className="px-8 py-3.5 bg-white/20 backdrop-blur text-white rounded-full font-semibold active:bg-white/30 transition-colors border border-white/30"
            >
              Reintentar
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3.5 bg-loom text-white rounded-full font-semibold active:bg-loom-dark transition-colors shadow-lg"
            >
              Usar Foto
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            {/* Botón de captura grande y moderno */}
            <button
              onClick={handleCapture}
              disabled={!isStreaming}
              className="w-20 h-20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full border-4 border-white p-1">
                <div className="w-full h-full rounded-full bg-white" />
              </div>
              <span className="sr-only">Capturar foto</span>
            </button>

            {/* Simulate button when camera is not available */}
            {error && (
              <button
                onClick={handleSimulateCapture}
                className="px-6 py-3 bg-purple-600/80 backdrop-blur text-white rounded-full font-medium active:bg-purple-700 transition-colors"
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
