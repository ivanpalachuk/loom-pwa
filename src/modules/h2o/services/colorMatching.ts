/**
 * Servicio para comparar colores extraídos con valores de referencia
 */

import { colorDistance, hexToRgb, type RGBColor } from './colorExtraction';

export interface ColorReference {
  value: number;
  color: string; // Hexadecimal
}

export interface ParameterMatch {
  parameter: string;
  value: number;
  confidence: number; // 0-100
  detectedColor: string;
  referenceColor: string;
}

/**
 * Referencias de colores FCL (Cloro Libre) - InstaTest
 * Extraídas de imágenes reales de tiras
 */
export const FCL_COLOR_REFERENCES: ColorReference[] = [
  { value: 0, color: '#b1aa96' },     // Sin uso / Sin cloro
  { value: 0.5, color: '#bbb59e' },   // Cloro bajo
  { value: 1.0, color: '#b9b39f' },   // Cloro bajo-medio
  { value: 1.5, color: '#b7b5a4' },   // Cloro medio
  { value: 2.0, color: '#b4b1a2' },   // Cloro medio-alto
  { value: 3.0, color: '#adaea1' },   // Cloro alto
  { value: 5.0, color: '#a5a89c' },   // Cloro muy alto
  { value: 10.0, color: '#9da097' },  // Cloro extremo
];

/**
 * Referencias de colores para pH - InstaTest
 * Extraídas de imágenes reales de tiras
 */
export const PH_COLOR_REFERENCES: ColorReference[] = [
  { value: 6.2, color: '#888b80' },   // pH bajo (ácido) - sin uso
  { value: 6.5, color: '#919488' },   // pH bajo-medio
  { value: 6.8, color: '#9b998b' },   // pH medio-bajo
  { value: 7.0, color: '#97978c' },   // pH neutro bajo
  { value: 7.2, color: '#95948e' },   // pH neutro
  { value: 7.4, color: '#989790' },   // pH neutro alto
  { value: 7.6, color: '#9c9a8e' },   // pH medio-alto
  { value: 7.8, color: '#9e9c8f' },   // pH alto
  { value: 8.0, color: '#a09b8f' },   // pH alto (alcalino)
  { value: 8.4, color: '#a5a092' },   // pH muy alto
];

/**
 * Referencias de colores para Alkalinity (KH) - InstaTest
 * Extraídas de imágenes reales de tiras
 */
export const ALKALINITY_COLOR_REFERENCES: ColorReference[] = [
  { value: 0, color: '#a39682' },     // Sin alcalinidad
  { value: 40, color: '#a99b89' },    // Alcalinidad baja
  { value: 80, color: '#af9d8c' },    // Alcalinidad baja-media
  { value: 120, color: '#ae9c91' },   // Alcalinidad media
  { value: 180, color: '#b19f92' },   // Alcalinidad media-alta
  { value: 240, color: '#b3a294' },   // Alcalinidad alta
  { value: 360, color: '#b8a698' },   // Alcalinidad muy alta
];

/**
 * Referencias de colores para Hardness / Total Hardness (TH) - InstaTest
 * Extraídas de imágenes reales de tiras
 */
export const HARDNESS_COLOR_REFERENCES: ColorReference[] = [
  { value: 0, color: '#868077' },     // Sin dureza
  { value: 25, color: '#8b8579' },    // Dureza muy baja
  { value: 50, color: '#9c9382' },    // Dureza baja
  { value: 120, color: '#97907f' },   // Dureza baja-media
  { value: 180, color: '#999386' },   // Dureza media
  { value: 250, color: '#928c80' },   // Dureza media-alta
  { value: 425, color: '#948d7f' },   // Dureza alta
  { value: 1000, color: '#908a7c' },  // Dureza muy alta
];

/**
 * Encuentra el valor más cercano basado en el color detectado
 */
export function findClosestValue(
  detectedColor: RGBColor,
  references: ColorReference[]
): { value: number; distance: number; referenceColor: string } {
  let minDistance = Infinity;
  let closestValue = references[0].value;
  let closestColor = references[0].color;

  for (const ref of references) {
    const refRgb = hexToRgb(ref.color);
    const distance = colorDistance(detectedColor, refRgb);

    if (distance < minDistance) {
      minDistance = distance;
      closestValue = ref.value;
      closestColor = ref.color;
    }
  }

  return { value: closestValue, distance: minDistance, referenceColor: closestColor };
}

/**
 * Calcula el nivel de confianza basado en la distancia del color
 * Distancia 0 = 100% confianza
 * Distancia >100 = baja confianza
 */
function calculateConfidence(distance: number): number {
  const maxDistance = 150; // Distancia máxima considerada
  const confidence = Math.max(0, 100 - (distance / maxDistance) * 100);
  return Math.round(confidence);
}

/**
 * Obtiene las referencias de color según el parámetro
 */
function getReferencesForParameter(parameter: string): ColorReference[] {
  switch (parameter) {
    case 'fcl':
      return FCL_COLOR_REFERENCES;
    case 'ph':
      return PH_COLOR_REFERENCES;
    case 'alkalinity':
      return ALKALINITY_COLOR_REFERENCES;
    case 'hardness':
      return HARDNESS_COLOR_REFERENCES;
    default:
      throw new Error(`Parámetro desconocido: ${parameter}`);
  }
}

/**
 * Compara un color extraído con las referencias y devuelve el mejor match
 */
export function matchColor(
  parameter: string,
  detectedColor: RGBColor,
  detectedHex: string
): ParameterMatch {
  const references = getReferencesForParameter(parameter);
  const { value, distance, referenceColor } = findClosestValue(detectedColor, references);
  const confidence = calculateConfidence(distance);

  return {
    parameter,
    value,
    confidence,
    detectedColor: detectedHex,
    referenceColor,
  };
}

/**
 * Interpola entre dos valores de referencia si el color está entre ellos
 */
export function interpolateValue(
  detectedColor: RGBColor,
  references: ColorReference[]
): number {
  // Ordenar referencias por distancia
  const distances = references.map(ref => ({
    ...ref,
    distance: colorDistance(detectedColor, hexToRgb(ref.color)),
  })).sort((a, b) => a.distance - b.distance);

  const closest = distances[0];
  const second = distances[1];

  // Si están muy cerca del primero, usar ese valor
  if (closest.distance < 30) {
    return closest.value;
  }

  // Interpolar entre los dos más cercanos
  const totalDistance = closest.distance + second.distance;
  const weight1 = 1 - (closest.distance / totalDistance);
  const weight2 = 1 - (second.distance / totalDistance);

  const interpolated = (closest.value * weight1 + second.value * weight2) / (weight1 + weight2);
  
  return Math.round(interpolated * 10) / 10; // Redondear a 1 decimal
}
