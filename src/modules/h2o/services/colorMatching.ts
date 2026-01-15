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
 * De blanco/crema (sin cloro) a amarillo (con cloro)
 */
export const FCL_COLOR_REFERENCES: ColorReference[] = [
  { value: 0, color: '#f0ece0' },     // Blanco crema - sin cloro (imagen 1-3)
  { value: 0.5, color: '#f2edc8' },   // Crema claro
  { value: 1.0, color: '#e8e0a0' },   // Amarillo muy pálido
  { value: 1.5, color: '#e0d480' },   // Amarillo pálido
  { value: 2.0, color: '#d8c860' },   // Amarillo claro
  { value: 3.0, color: '#d0c040' },   // Amarillo (imagen 4)
  { value: 5.0, color: '#c8b830' },   // Amarillo intenso
  { value: 10.0, color: '#c0b020' },  // Amarillo oscuro
];

/**
 * Referencias de colores para pH - InstaTest
 * De rosa/fucsia (ácido ~6.8) a naranja (alcalino ~8.0)
 */
export const PH_COLOR_REFERENCES: ColorReference[] = [
  { value: 6.2, color: '#e04878' },   // Fucsia muy intenso
  { value: 6.5, color: '#e05880' },   // Fucsia intenso
  { value: 6.8, color: '#e86888' },   // Rosa fucsia (imágenes 1-3)
  { value: 7.0, color: '#e87888' },   // Rosa medio
  { value: 7.2, color: '#e88880' },   // Rosa claro
  { value: 7.4, color: '#e89878' },   // Rosa salmón
  { value: 7.6, color: '#e8a070' },   // Salmón naranja
  { value: 7.8, color: '#e8a060' },   // Naranja claro
  { value: 8.0, color: '#e89850' },   // Naranja (imagen 4)
  { value: 8.4, color: '#e09040' },   // Naranja intenso
];

/**
 * Referencias de colores para Alkalinity (KH) - InstaTest
 * De azul celeste claro (baja) a amarillo/verde (alta)
 */
export const ALKALINITY_COLOR_REFERENCES: ColorReference[] = [
  { value: 0, color: '#90d0f0' },     // Azul celeste muy claro
  { value: 40, color: '#70c0e8' },    // Azul celeste claro (imagen 1)
  { value: 80, color: '#50b0e0' },    // Azul celeste (imagen 2-3)
  { value: 120, color: '#40a0d0' },   // Azul celeste medio
  { value: 180, color: '#c0c870' },   // Verde amarillento
  { value: 240, color: '#d0d060' },   // Amarillo verdoso (imagen 4)
  { value: 360, color: '#d8d850' },   // Amarillo
];

/**
 * Referencias de colores para Hardness / Total Hardness (TH) - InstaTest
 * De azul celeste (blanda) a verde turquesa (dura)
 */
export const HARDNESS_COLOR_REFERENCES: ColorReference[] = [
  { value: 0, color: '#70b8e0' },     // Azul celeste claro (imagen 1)
  { value: 25, color: '#60b0d8' },    // Azul celeste
  { value: 50, color: '#50a8d0' },    // Azul celeste medio (imagen 2)
  { value: 120, color: '#5090c0' },   // Azul medio
  { value: 180, color: '#5080b8' },   // Azul púrpura (imagen 3)
  { value: 250, color: '#60a8a8' },   // Azul verdoso
  { value: 425, color: '#70c0b0' },   // Turquesa (imagen 4)
  { value: 1000, color: '#80d0c0' },  // Verde turquesa
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
