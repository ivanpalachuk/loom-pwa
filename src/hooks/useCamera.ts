import { useState, useRef, useCallback } from 'react';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isStreaming: boolean;
  error: string | null;
  capturedImage: string | null;
  torchEnabled: boolean;
  torchSupported: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  pauseCamera: () => void;
  resumeCamera: () => Promise<void>;
  capturePhoto: () => string | null;
  clearPhoto: () => void;
  toggleTorch: () => Promise<void>;
}

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      // Verificar primero si ya tenemos permisos para evitar solicitarlos cada vez
      if ('permissions' in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
          if (permissionStatus.state === 'denied') {
            setError('Permisos de cámara denegados. Por favor, habilita los permisos en la configuración de tu navegador.');
            return;
          }
        } catch (permErr) {
          // Si la API de permisos no está disponible, continuar normalmente
          console.log('Permissions API not available, continuing with getUserMedia', permErr);
        }
      }
      
      // Configuración optimizada para móviles
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Cámara trasera por defecto
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        
        // Verificar si la linterna está soportada
        const track = stream.getVideoTracks()[0];
        if (track) {
          const capabilities = track.getCapabilities?.() as MediaTrackCapabilities & { torch?: boolean };
          setTorchSupported(!!capabilities?.torch);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al acceder a la cámara';
      setError(errorMessage);
      console.error('Error accessing camera:', err);
    }
  }, []);

  // Pausar video sin detener el stream (mantiene permisos)
  const pauseCamera = useCallback(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.pause();
      // Pausar los tracks pero NO detenerlos
      streamRef.current.getTracks().forEach(track => {
        track.enabled = false;
      });
      setIsStreaming(false);
    }
  }, []);

  // Reanudar video sin pedir permisos de nuevo
  const resumeCamera = useCallback(async () => {
    if (streamRef.current && videoRef.current) {
      // Reactivar tracks existentes
      streamRef.current.getTracks().forEach(track => {
        track.enabled = true;
      });
      await videoRef.current.play();
      setIsStreaming(true);
    } else {
      // Si no hay stream, iniciar la cámara
      await startCamera();
    }
  }, [startCamera]);

  // Detener completamente la cámara (solo cuando realmente sea necesario)
  const stopCamera = useCallback(() => {
    // Primero detener todos los tracks del stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        streamRef.current?.removeTrack(track);
      });
      streamRef.current = null;
    }
    
    // Limpiar el elemento video
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.load();
      // Forzar garbage collection del srcObject
      videoRef.current.src = '';
    }
    
    setIsStreaming(false);
    setCapturedImage(null);
  }, []);

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    // Ajustar canvas al tamaño del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame actual del video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir a base64
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    
    return imageData;
  }, []);

  const clearPhoto = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const toggleTorch = useCallback(async () => {
    if (!streamRef.current) return;
    
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    
    try {
      const newTorchState = !torchEnabled;
      await track.applyConstraints({
        advanced: [{ torch: newTorchState } as MediaTrackConstraintSet]
      });
      setTorchEnabled(newTorchState);
    } catch (err) {
      console.error('Error al cambiar linterna:', err);
    }
  }, [torchEnabled]);

  return {
    videoRef,
    canvasRef,
    isStreaming,
    error,
    capturedImage,
    torchEnabled,
    torchSupported,
    startCamera,
    stopCamera,
    pauseCamera,
    resumeCamera,
    capturePhoto,
    clearPhoto,
    toggleTorch
  };
};
