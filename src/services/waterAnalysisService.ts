export interface WaterQualityData {
  ph: number; // pH level
  alkalinity: number; // Alcalinidad en ppm (mg/L CaCO3)
  hardness: number; // Dureza en ppm (mg/L CaCO3)
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
}

// Rangos para cada parámetro
export const PARAMETER_RANGES = {
  ph: {
    min: 4,
    max: 10,
    optimalMin: 6,
    optimalMax: 7,
    unit: '',
    label: 'pH'
  },
  alkalinity: {
    min: 0,
    max: 500,
    optimalMin: 50,
    optimalMax: 150,
    unit: 'ppm',
    label: 'Alcalinidad'
  },
  hardness: {
    min: 0,
    max: 500,
    optimalMin: 0,
    optimalMax: 150,
    unit: 'ppm',
    label: 'Dureza'
  }
};

/**
 * Simulates analysis of water test strips from a photo.
 * In a real implementation, this would:
 * - Send the image to a computer vision service
 * - Use ML to detect strip colors
 * - Map colors to actual water parameter values
 */
export const analyzeWaterStrip = (_imageData: string): WaterQualityData => {
  // Simulate analysis with random but realistic values
  const ph = parseFloat((4 + Math.random() * 6).toFixed(1)); // 4.0-10.0
  const alkalinity = Math.round(Math.random() * 500); // 0-500 ppm
  const hardness = Math.round(Math.random() * 500); // 0-500 ppm

  const quality = determineQuality(ph, alkalinity, hardness);
  const recommendations = generateRecommendations(ph, alkalinity, hardness);

  return {
    ph,
    alkalinity,
    hardness,
    quality,
    recommendations,
  };
};

const determineQuality = (
  ph: number,
  alkalinity: number,
  hardness: number
): 'excellent' | 'good' | 'fair' | 'poor' => {
  const { ph: phRange, alkalinity: alkRange, hardness: hardRange } = PARAMETER_RANGES;
  
  const phOptimal = ph >= phRange.optimalMin && ph <= phRange.optimalMax;
  const alkOptimal = alkalinity >= alkRange.optimalMin && alkalinity <= alkRange.optimalMax;
  const hardOptimal = hardness >= hardRange.optimalMin && hardness <= hardRange.optimalMax;

  const optimalCount = [phOptimal, alkOptimal, hardOptimal].filter(Boolean).length;

  if (optimalCount === 3) return 'excellent';
  if (optimalCount >= 2) return 'good';
  if (optimalCount >= 1) return 'fair';
  return 'poor';
};

const generateRecommendations = (ph: number, alkalinity: number, hardness: number): string[] => {
  const recommendations: string[] = [];
  const { ph: phRange, alkalinity: alkRange, hardness: hardRange } = PARAMETER_RANGES;

  // pH recommendations
  if (ph < phRange.optimalMin) {
    recommendations.push(
      'pH bajo: Añadir corrector de pH para subir el nivel'
    );
  } else if (ph > phRange.optimalMax) {
    recommendations.push(
      'pH alto: Usar ácido para bajar el pH'
    );
  }

  // Alkalinity recommendations
  if (alkalinity < alkRange.optimalMin) {
    recommendations.push(
      'Alcalinidad baja: El agua puede ser inestable, considerar buffer'
    );
  } else if (alkalinity > alkRange.optimalMax) {
    recommendations.push(
      'Alcalinidad alta: Puede afectar la eficacia de productos'
    );
  }

  // Hardness recommendations
  if (hardness > hardRange.optimalMax) {
    recommendations.push(
      'Dureza alta: Considerar uso de secuestrantes o agua blanda'
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('Agua en condiciones óptimas para aplicación');
  }

  return recommendations;
};

// Export public version for external use
export const getRecommendations = generateRecommendations;

export const getQualityColor = (quality: string): string => {
  switch (quality) {
    case 'excellent':
      return '#22c55e'; // green-500
    case 'good':
      return '#84cc16'; // lime-500
    case 'fair':
      return '#f59e0b'; // amber-500
    case 'poor':
      return '#ef4444'; // red-500
    default:
      return '#6b7280'; // gray-500
  }
};

export const getQualityLabel = (quality: string): string => {
  switch (quality) {
    case 'excellent':
      return 'Excelente';
    case 'good':
      return 'Buena';
    case 'fair':
      return 'Regular';
    case 'poor':
      return 'Deficiente';
    default:
      return 'Desconocido';
  }
};
