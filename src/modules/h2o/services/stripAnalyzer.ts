/**
 * Servicio principal para analizar tiras reactivas desde fotos
 */

import { extractStripColors, type ColorZone, imageToCanvas, extractColorsFromCanvas, INSTATEST_ZONES } from './colorExtraction';
import { calculateDynamicZones } from './stripDetection';
import { matchColor, type ParameterMatch } from './colorMatching';
import type { WaterQualityData } from '../types';

export interface StripAnalysisResult {
  waterQuality: WaterQualityData;
  matches: ParameterMatch[];
  averageConfidence: number;
  timestamp: Date;
}

/**
 * Analiza una foto de tira reactiva y devuelve los parámetros del agua
 */
/**
 * Analiza una foto de tira reactiva y devuelve los parámetros del agua
 */
export async function analyzeStripPhoto(
  imageData: string,
  customZones?: ColorZone[]
): Promise<StripAnalysisResult> {
  try {
    // 0. Preparar canvas
    const canvas = await imageToCanvas(imageData);

    // 1. Determinar zonas (Dinámicas > Custom > Default)
    let zones = customZones;
    
    if (!zones) {
      // Intentar detectar automáticamente
      const dynamicZones = calculateDynamicZones(canvas);
      if (dynamicZones) {
        console.log('Using dynamically detected zones based on strip position');
        zones = dynamicZones;
      } else {
        console.log('Dynamic detection failed, falling back to static zones');
        zones = INSTATEST_ZONES;
      }
    }

    // 2. Extraer colores usando el canvas ya creado
    const extractedColors = extractColorsFromCanvas(canvas, zones);
    
    // 3. Comparar cada color con las referencias
    const matches: ParameterMatch[] = extractedColors.map(extracted => {
      return matchColor(extracted.parameter, extracted.rgb, extracted.hex);
    });
    
    // 4. Construir los datos de calidad del agua
    const waterQuality = buildWaterQualityData(matches);
    
    // 5. Calcular confianza promedio
    const averageConfidence = matches.reduce((sum, m) => sum + m.confidence, 0) / matches.length;
    
    return {
      waterQuality,
      matches,
      averageConfidence: Math.round(averageConfidence),
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error al analizar la tira:', error);
    throw new Error('No se pudo analizar la imagen de la tira');
  }
}

/**
 * Construye el objeto WaterQualityData desde los matches
 */
function buildWaterQualityData(matches: ParameterMatch[]): WaterQualityData {
  const data: Partial<WaterQualityData> = {};
  
  matches.forEach(match => {
    switch (match.parameter) {
      case 'ph':
        data.ph = match.value;
        break;
      case 'alkalinity':
        data.alkalinity = match.value;
        break;
      case 'hardness':
        data.hardness = match.value;
        break;
    }
  });
  
  // Determinar calidad general
  data.quality = determineOverallQuality(data as WaterQualityData);
  
  return data as WaterQualityData;
}

/**
 * Determina la calidad general del agua
 */
function determineOverallQuality(data: WaterQualityData): 'excellent' | 'good' | 'fair' | 'poor' {
  const issues: number[] = [];
  
  // Evaluar pH (óptimo: 7.0-7.4)
  if (data.ph < 6.8 || data.ph > 7.6) issues.push(1);
  else if (data.ph < 7.0 || data.ph > 7.4) issues.push(0.5);
  
  // Evaluar alkalinity (óptimo: 80-120)
  if (data.alkalinity < 40 || data.alkalinity > 180) issues.push(1);
  else if (data.alkalinity < 80 || data.alkalinity > 120) issues.push(0.5);
  
  // Evaluar hardness (óptimo: <120)
  if (data.hardness > 250) issues.push(1);
  else if (data.hardness > 120) issues.push(0.5);
  
  const totalIssues = issues.reduce((sum, val) => sum + val, 0);
  
  if (totalIssues === 0) return 'excellent';
  if (totalIssues <= 1) return 'good';
  if (totalIssues <= 2) return 'fair';
  return 'poor';
}

/**
 * Valida que la imagen contenga una tira reactiva
 * (Análisis básico de la imagen)
 */
export async function validateStripImage(imageData: string): Promise<boolean> {
  try {
    const extractedColors = await extractStripColors(imageData);
    
    // Verificar que los colores extraídos no sean todos muy similares (imagen vacía/uniforme)
    const firstColor = extractedColors[0].rgb;
    const allSimilar = extractedColors.every(color => {
      const rDiff = Math.abs(color.rgb.r - firstColor.r);
      const gDiff = Math.abs(color.rgb.g - firstColor.g);
      const bDiff = Math.abs(color.rgb.b - firstColor.b);
      return rDiff < 20 && gDiff < 20 && bDiff < 20;
    });
    
    // Si todos los colores son muy similares, probablemente no hay una tira
    return !allSimilar;
  } catch {
    return false;
  }
}

/**
 * Ajusta las zonas de detección manualmente (calibración)
 */
export function calibrateZones(
  baseZones: ColorZone[],
  offsetX: number = 0,
  offsetY: number = 0,
  scale: number = 1
): ColorZone[] {
  return baseZones.map(zone => ({
    ...zone,
    x: zone.x + offsetX,
    y: zone.y + offsetY,
    width: zone.width * scale,
    height: zone.height * scale,
  }));
}
