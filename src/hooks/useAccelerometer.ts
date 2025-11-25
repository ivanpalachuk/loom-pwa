import { useState, useEffect, useRef, useCallback } from 'react';

interface AccelerometerData {
  x: number | null;
  y: number | null;
  z: number | null;
  alpha: number | null; // Rotación Z (0-360)
  beta: number | null;  // Rotación X (-180 a 180)
  gamma: number | null; // Rotación Y (-90 a 90)
}

interface UseAccelerometerOptions {
  onShake?: () => void;
  shakeThreshold?: number;
}

export function useAccelerometer(options?: UseAccelerometerOptions) {
  const [data, setData] = useState<AccelerometerData>({
    x: null,
    y: null,
    z: null,
    alpha: null,
    beta: null,
    gamma: null,
  });
  
  const hasDeviceMotion = 'DeviceMotionEvent' in window;
  const hasDeviceOrientation = 'DeviceOrientationEvent' in window;
  const isSupported = hasDeviceMotion || hasDeviceOrientation;
  
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [error, setError] = useState<string | null>(null);
  
  // Usar refs para tracking de shake
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const lastZRef = useRef(0);
  const lastTimeRef = useRef(0);

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const currentX = acc.x || 0;
    const currentY = acc.y || 0;
    const currentZ = acc.z || 0;

    setData(prev => ({
      ...prev,
      x: currentX,
      y: currentY,
      z: currentZ,
    }));

    // Detectar shake
    if (options?.onShake && lastTimeRef.current > 0) {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTimeRef.current;

      if (timeDiff > 100) {
        const deltaX = Math.abs(currentX - lastXRef.current);
        const deltaY = Math.abs(currentY - lastYRef.current);
        const deltaZ = Math.abs(currentZ - lastZRef.current);
        const threshold = options.shakeThreshold || 15;

        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
          options.onShake();
        }

        lastXRef.current = currentX;
        lastYRef.current = currentY;
        lastZRef.current = currentZ;
      }
      lastTimeRef.current = currentTime;
    } else if (lastTimeRef.current === 0) {
      lastTimeRef.current = Date.now();
      lastXRef.current = currentX;
      lastYRef.current = currentY;
      lastZRef.current = currentZ;
    }
  }, [options]);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    setData(prev => ({
      ...prev,
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    }));
  }, []);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    if (hasDeviceMotion) {
      window.addEventListener('devicemotion', handleMotion);
    }
    if (hasDeviceOrientation) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (hasDeviceMotion) {
        window.removeEventListener('devicemotion', handleMotion);
      }
      if (hasDeviceOrientation) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [hasDeviceMotion, hasDeviceOrientation, handleMotion, handleOrientation, isSupported]);

  // Solicitar permisos (necesario en iOS 13+)
  const requestPermission = async () => {
    try {
      // iOS requiere permiso explícito
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const DeviceMotionEventTyped = DeviceMotionEvent as any;
      
      if (typeof DeviceMotionEventTyped.requestPermission === 'function') {
        console.log('Solicitando permiso de acelerómetro iOS...');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await DeviceMotionEventTyped.requestPermission();
        console.log('Respuesta de permiso:', response);
        
        if (response === 'granted') {
          setPermission('granted');
          setError(null);
          return true;
        } else {
          setPermission('denied');
          setError('Permiso denegado para acceder al acelerómetro');
          return false;
        }
      }
      
      // Android y otros no requieren permiso
      console.log('Plataforma no requiere permiso de acelerómetro');
      setPermission('granted');
      setError(null);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('Error al solicitar permiso de acelerómetro:', err);
      setError('Error al solicitar permiso: ' + errorMsg);
      setPermission('denied');
      return false;
    }
  };

  return {
    data,
    isSupported,
    permission,
    error,
    requestPermission,
  };
}
