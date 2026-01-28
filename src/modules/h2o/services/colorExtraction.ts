/**
 * Servicio para extraer y analizar colores de fotos de tiras reactivas
 */

export interface ColorZone {
  x: number; // Porcentaje desde la izquierda
  y: number; // Porcentaje desde arriba
  width: number; // Porcentaje del ancho
  height: number; // Porcentaje del alto
  parameter: 'fcl' | 'ph' | 'alkalinity' | 'hardness';
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ExtractedColor {
  parameter: string;
  rgb: RGBColor;
  hex: string;
}

/**
 * Zonas predefinidas para una tira InstaTest estándar
 * La tira tiene 4 cuadrados verticales (de arriba hacia abajo):
 * 1. FCL (Cloro Libre) - cuadrado superior
 * 2. Alk (Alcalinidad) - segundo cuadrado
 * 3. pH - tercer cuadrado
 * 4. TH (Dureza Total) - cuadrado inferior
 * 
 * IMPORTANTE: La guía en Camera.tsx tiene un marco de 90x360px centrado
 * con zonas a 5%, 27%, 49%, 71% desde arriba del marco (cada una 14% alto)
 * 
 * Asumiendo que el usuario centra la tira en la pantalla:
 * - En un móvil típico (390x844), el marco de 360px ocupa ~43% del alto
 * - El marco empieza aprox a 28.5% desde arriba ((100-43)/2)
 * - Cada zona del marco se traduce a: 28.5% + (zona% * 43%)
 */
export const INSTATEST_ZONES: ColorZone[] = [
  {
    x: 45, // Centro horizontal
    y: 32, // FCL: 28.5% + (5% + 7%) * 43% ≈ 32%
    width: 10,
    height: 5,
    parameter: 'fcl',
  },
  {
    x: 45,
    y: 42, // ALK: 28.5% + (27% + 7%) * 43% ≈ 42%
    width: 10,
    height: 5,
    parameter: 'alkalinity',
  },
  {
    x: 45,
    y: 52, // pH: 28.5% + (49% + 7%) * 43% ≈ 52%
    width: 10,
    height: 5,
    parameter: 'ph',
  },
  {
    x: 45,
    y: 62, // TH: 28.5% + (71% + 7%) * 43% ≈ 62%
    width: 10,
    height: 5,
    parameter: 'hardness',
  },
];

/**
 * Convierte una imagen a canvas para procesamiento
 */
export async function imageToCanvas(imageData: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto del canvas'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    
    img.onerror = () => reject(new Error('Error al cargar la imagen'));
    img.src = imageData;
  });
}

/**
 * Extrae el color promedio de una zona específica de la imagen
 */
export function extractColorFromZone(
  canvas: HTMLCanvasElement,
  zone: ColorZone
): RGBColor {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo obtener el contexto del canvas');

  // Calcular coordenadas en píxeles
  const x = Math.floor((zone.x / 100) * canvas.width);
  const y = Math.floor((zone.y / 100) * canvas.height);
  const width = Math.floor((zone.width / 100) * canvas.width);
  const height = Math.floor((zone.height / 100) * canvas.height);

  // Obtener los datos de la imagen
  const imageData = ctx.getImageData(x, y, width, height);
  const pixels = imageData.data;

  // Calcular el promedio de los colores
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let count = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    totalR += pixels[i];
    totalG += pixels[i + 1];
    totalB += pixels[i + 2];
    count++;
  }

  return {
    r: Math.round(totalR / count),
    g: Math.round(totalG / count),
    b: Math.round(totalB / count),
  };
}

/**
 * Convierte RGB a formato hexadecimal
 */
export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Extrae los colores de todas las zonas de la tira (usando canvas existente)
 */
export function extractColorsFromCanvas(
  canvas: HTMLCanvasElement,
  zones: ColorZone[]
): ExtractedColor[] {
  // Debug: log canvas size and zone positions
  console.log('Canvas size:', canvas.width, 'x', canvas.height);
  zones.forEach(zone => {
    const x = Math.floor((zone.x / 100) * canvas.width);
    const y = Math.floor((zone.y / 100) * canvas.height);
    const w = Math.floor((zone.width / 100) * canvas.width);
    const h = Math.floor((zone.height / 100) * canvas.height);
    console.log(`Zone ${zone.parameter}: x=${x}, y=${y}, w=${w}, h=${h}`);
  });
  
  return zones.map(zone => {
    const rgb = extractColorFromZone(canvas, zone);
    return {
      parameter: zone.parameter,
      rgb,
      hex: rgbToHex(rgb),
    };
  });
}

/**
 * Extrae los colores de todas las zonas de la tira
 */
export async function extractStripColors(
  imageData: string,
  zones: ColorZone[] = INSTATEST_ZONES
): Promise<ExtractedColor[]> {
  const canvas = await imageToCanvas(imageData);
  return extractColorsFromCanvas(canvas, zones);
}

/**
 * Calcula la distancia euclidiana entre dos colores
 */
export function colorDistance(color1: RGBColor, color2: RGBColor): number {
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;
  
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Convierte hex a RGB
 */
export function hexToRgb(hex: string): RGBColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error('Color hexadecimal inválido');
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}
