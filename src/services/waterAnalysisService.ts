export interface WaterQualityData {
  hardness: number; // GH (German Hardness) in dGH
  ph: number; // pH level
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
}

/**
 * Simulates analysis of water test strips from a photo.
 * In a real implementation, this would:
 * - Send the image to a computer vision service
 * - Use ML to detect strip colors
 * - Map colors to actual water parameter values
 */
export const analyzeWaterStrip = (_imageData: string): WaterQualityData => {
  // Simulate analysis with random but realistic values
  // In production, this would analyze the actual image (_imageData)
  const hardness = parseFloat((Math.random() * 12).toFixed(1)); // 0-12 dGH
  const ph = parseFloat((6.0 + Math.random() * 3).toFixed(1)); // 6.0-9.0

  const quality = determineQuality(hardness, ph);
  const recommendations = generateRecommendations(hardness, ph);

  return {
    hardness,
    ph,
    quality,
    recommendations,
  };
};

const determineQuality = (
  hardness: number,
  ph: number
): 'excellent' | 'good' | 'fair' | 'poor' => {
  const hardnessOptimal = hardness <= 4;
  const phOptimal = ph >= 6.5 && ph <= 7.5;

  if (hardnessOptimal && phOptimal) return 'excellent';
  
  const hardnessAcceptable = hardness <= 8;
  const phAcceptable = ph >= 6.0 && ph <= 8.0;
  
  if (hardnessAcceptable && phAcceptable) return 'good';
  
  const hardnessTolerable = hardness <= 10;
  const phTolerable = ph >= 5.5 && ph <= 8.5;
  
  if (hardnessTolerable && phTolerable) return 'fair';
  
  return 'poor';
};

const generateRecommendations = (hardness: number, ph: number): string[] => {
  const recommendations: string[] = [];

  // Hardness recommendations
  if (hardness > 8) {
    recommendations.push(
      'Dureza alta: Usar un ablandador de agua o mezclar con agua destilada'
    );
  } else if (hardness > 4) {
    recommendations.push(
      'Dureza moderada: Considera usar agua filtrada para mejorar la calidad'
    );
  } else {
    recommendations.push('Dureza óptima: El agua está perfecta en este aspecto');
  }

  // pH recommendations
  if (ph < 6.5) {
    recommendations.push(
      'pH bajo (ácido): Añade bicarbonato de sodio gradualmente para subir el pH'
    );
  } else if (ph > 7.5) {
    recommendations.push(
      'pH alto (alcalino): Usa ácido cítrico o vinagre blanco para bajar el pH'
    );
  } else {
    recommendations.push('pH óptimo: El nivel de acidez es ideal');
  }

  // General recommendation
  if (hardness <= 4 && ph >= 6.5 && ph <= 7.5) {
    recommendations.push('Perfecto: Tu agua está en condiciones óptimas');
  } else {
    recommendations.push(
      'Realiza ajustes graduales y vuelve a medir después de 24 horas'
    );
  }

  return recommendations;
};

export const getQualityColor = (
  quality: 'excellent' | 'good' | 'fair' | 'poor'
): string => {
  switch (quality) {
    case 'excellent':
      return '#10b981'; // green
    case 'good':
      return '#3b82f6'; // blue
    case 'fair':
      return '#f59e0b'; // amber
    case 'poor':
      return '#ef4444'; // red
  }
};

export const getQualityLabel = (
  quality: 'excellent' | 'good' | 'fair' | 'poor'
): string => {
  switch (quality) {
    case 'excellent':
      return 'Excelente';
    case 'good':
      return 'Buena';
    case 'fair':
      return 'Regular';
    case 'poor':
      return 'Mala';
  }
};
