import type { ColorZone } from './colorExtraction';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Detecta el rectángulo blanco de la tira reactiva en el canvas
 */
export function detectStripRect(canvas: HTMLCanvasElement): Rect | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // 1. Crear histogramas de "blancura"
  const colWhiteScore = new Int32Array(width).fill(0);
  const rowWhiteScore = new Int32Array(height).fill(0);

  // Umbral para considerar un píxel como "blanco" (parte de la tira)
  // Las tiras son muy blancas, pero puede haber sombras.
  const WHITE_THRESHOLD = 180;
  // Diferencia máxima entre canales (para asegurar que es gris/blanco y no un color claro)
  const COLOR_DIFF_THRESHOLD = 30;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const isBright = r > WHITE_THRESHOLD && g > WHITE_THRESHOLD && b > WHITE_THRESHOLD;
      const isNeutral = Math.abs(r - g) < COLOR_DIFF_THRESHOLD && 
                        Math.abs(g - b) < COLOR_DIFF_THRESHOLD && 
                        Math.abs(r - b) < COLOR_DIFF_THRESHOLD;

      if (isBright && isNeutral) {
        colWhiteScore[x]++;
        rowWhiteScore[y]++;
      }
    }
  }

  // 2. Encontrar el rango horizontal (X) de la tira
  // Buscamos una secuencia de columnas con alta densidad de blanco
  const minStripHeight = height * 0.2; // La tira debe ocupar al menos 20% de la altura
  const minStripWidth = width * 0.02; // Al menos 2% del ancho

  let bestX = 0;
  let bestWidth = 0;
  let maxScoreX = 0;

  // Suavizar histograma X o buscar picos anchos
  // Estrategia simple: encontrar el segmento continuo donde score > height * 0.1
  let currentStartX = -1;
  const thresholdX = height * 0.1; 

  for (let x = 0; x < width; x++) {
    if (colWhiteScore[x] > thresholdX) {
      if (currentStartX === -1) currentStartX = x;
    } else {
      if (currentStartX !== -1) {
        const segWidth = x - currentStartX;
        const score = colWhiteScore.slice(currentStartX, x).reduce((a, b) => a + b, 0);
        
        if (segWidth > minStripWidth && score > maxScoreX) {
          maxScoreX = score;
          bestX = currentStartX;
          bestWidth = segWidth;
        }
        currentStartX = -1;
      }
    }
  }
  // Check final segment
  if (currentStartX !== -1) {
    const x = width;
    const segWidth = x - currentStartX;
    const score = colWhiteScore.slice(currentStartX, x).reduce((a, b) => a + b, 0);
    if (segWidth > minStripWidth && score > maxScoreX) {
      bestX = currentStartX;
      bestWidth = segWidth;
    }
  }

  if (bestWidth === 0) return null; // No se encontró tira

  // 3. Encontrar el rango vertical (Y) DENTRO de las columnas detectadas
  // No usamos el rowWhiteScore global porque podría haber ruido de fondo
  const stripColStart = bestX;
  const stripColEnd = bestX + bestWidth;
  const stripRowScore = new Int32Array(height).fill(0);

  for (let y = 0; y < height; y++) {
    for (let x = stripColStart; x < stripColEnd; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const isBright = r > WHITE_THRESHOLD && g > WHITE_THRESHOLD && b > WHITE_THRESHOLD;
      if (isBright) {
        stripRowScore[y]++;
      }
    }
  }

  // Buscamos el inicio y fin vertical
  // El umbral debe ser bajo (ej. 10% del ancho de la tira detectada) para detectar los bordes
    const thresholdY = bestWidth * 0.2;
    let startY = 0;
    let endY = height - 1;
    
    // Scan from top
    for (let y = 0; y < height / 2; y++) {
        // miramos una ventana de 3 pixels
        if (stripRowScore[y] > thresholdY && stripRowScore[y+1] > thresholdY && stripRowScore[y+2] > thresholdY) {
            startY = y;
            break;
        }
    }
    
    // Scan from bottom
    for (let y = height - 1; y > height / 2; y--) {
        if (stripRowScore[y] > thresholdY && stripRowScore[y-1] > thresholdY && stripRowScore[y-2] > thresholdY) {
            endY = y;
            break;
        }
    }

    if (endY - startY < minStripHeight) return null;

    return {
        x: bestX,
        y: startY,
        width: bestWidth,
        height: endY - startY
    };
}

/**
 * Calcula las zonas de color basándose en el rectángulo de la tira detectada
 * Usa las proporciones definidas en Camera.tsx
 */
export function calculateDynamicZones(canvas: HTMLCanvasElement): ColorZone[] | null {
    const rect = detectStripRect(canvas);
    if (!rect) return null;

    const w = canvas.width;
    const h = canvas.height;

    // Convert pixels back to percentages relative to whole canvas
    
    // Definición relativa de la tira (basada en Camera.tsx)
    // top-[5%], height-[14%]... relative to strip height
    // Pero espera, Camera.tsx define posiciones relativas al MARCO de 360px.
    // La tira completa es el MARCO.
    // Entonces:
    // FCL: top 5%, height 14%
    // ALK: top 27%, height 14%
    // pH: top 49%, height 14%
    // TH: top 71%, height 14%
    
    // Ancho de la zona de lectura: Camera.tsx usa width: '90px' en marco, 
    // pero los squares son más pequeños.
    // Asumamos que los squares ocupan el 60% central del ancho de la tira.

    const createZone = (topPct: number, param: ColorZone['parameter']): ColorZone => {
        // Coordenadas en pixeles
        const zoneY = rect.y + (rect.height * (topPct / 100));
        const zoneH = rect.height * (14 / 100); // 14% height
        
        const zoneW = rect.width * 0.6; // 60% of strip width
        const zoneX = rect.x + (rect.width - zoneW) / 2; // Centered

        return {
            x: (zoneX / w) * 100,
            y: (zoneY / h) * 100,
            width: (zoneW / w) * 100,
            height: (zoneH / h) * 100,
            parameter: param
        };
    };

    return [
        createZone(5, 'fcl'),
        createZone(27, 'alkalinity'),
        createZone(49, 'ph'),
        createZone(71, 'hardness')
    ];
}
