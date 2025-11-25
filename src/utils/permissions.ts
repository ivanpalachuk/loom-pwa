// Utility para verificar y manejar permisos de cámara y acelerómetro

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported';

/**
 * Verifica el estado actual del permiso de cámara
 */
export async function checkCameraPermission(): Promise<PermissionStatus> {
  try {
    // Verificar si la API de permisos está disponible
    if (!navigator.permissions) {
      return 'unsupported';
    }

    // Verificar permiso de cámara
    const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
    return result.state as PermissionStatus;
  } catch (error) {
    console.warn('No se pudo verificar el permiso de cámara:', error);
    return 'unsupported';
  }
}

/**
 * Solicita permiso de cámara
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Detener el stream inmediatamente, solo queríamos el permiso
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Permiso de cámara denegado:', error);
    return false;
  }
}

/**
 * Verifica si los permisos de cámara están almacenados
 * Los navegadores modernos recuerdan la decisión del usuario
 */
export function isCameraPermissionRemembered(): boolean {
  // Los permisos se guardan en el navegador por dominio
  // Si el usuario ya dio permiso, getUserMedia no volverá a preguntar
  return localStorage.getItem('camera-permission-asked') === 'true';
}

/**
 * Marca que ya se solicitó permiso de cámara
 */
export function markCameraPermissionAsked(): void {
  localStorage.setItem('camera-permission-asked', 'true');
}

/**
 * Verifica si el acelerómetro está soportado
 */
export function isAccelerometerSupported(): boolean {
  return 'DeviceMotionEvent' in window || 'DeviceOrientationEvent' in window;
}

/**
 * Verifica si se requiere permiso explícito para el acelerómetro (iOS 13+)
 */
export function requiresAccelerometerPermission(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (DeviceMotionEvent as any).requestPermission === 'function';
}

/**
 * Solicita permiso de acelerómetro (solo iOS 13+)
 */
export async function requestAccelerometerPermission(): Promise<PermissionStatus> {
  if (!requiresAccelerometerPermission()) {
    // Android y navegadores de escritorio no requieren permiso
    return 'granted';
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (DeviceMotionEvent as any).requestPermission();
    
    // Guardar la decisión
    localStorage.setItem('accelerometer-permission', response);
    
    return response as PermissionStatus;
  } catch (error) {
    console.error('Error al solicitar permiso de acelerómetro:', error);
    return 'denied';
  }
}

/**
 * Verifica si el permiso de acelerómetro fue concedido previamente
 */
export function getStoredAccelerometerPermission(): PermissionStatus | null {
  const stored = localStorage.getItem('accelerometer-permission');
  return stored as PermissionStatus | null;
}

/**
 * Información completa sobre el estado de permisos
 */
export interface PermissionsInfo {
  camera: {
    supported: boolean;
    status: PermissionStatus;
    remembered: boolean;
  };
  accelerometer: {
    supported: boolean;
    requiresPermission: boolean;
    status: PermissionStatus | null;
  };
}

/**
 * Obtiene información completa sobre todos los permisos
 */
export async function getPermissionsInfo(): Promise<PermissionsInfo> {
  const cameraSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
  const cameraStatus = cameraSupported ? await checkCameraPermission() : 'unsupported';
  
  return {
    camera: {
      supported: cameraSupported,
      status: cameraStatus,
      remembered: isCameraPermissionRemembered(),
    },
    accelerometer: {
      supported: isAccelerometerSupported(),
      requiresPermission: requiresAccelerometerPermission(),
      status: getStoredAccelerometerPermission(),
    },
  };
}
