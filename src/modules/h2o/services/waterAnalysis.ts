import type { WaterQualityData, ParameterRanges } from '../types';

// Rangos para cada parámetro según tiras InstaTest 6 en 1
export const PARAMETER_RANGES: ParameterRanges = {
    ph: {
        min: 6.2,
        max: 8.4,
        optimalMin: 6.5,
        optimalMax: 7.5,
        unit: '',
        label: 'pH',
        possibleValues: [6.2, 6.8, 7.2, 7.8, 8.4] // Valores de las tiras InstaTest
    },
    alkalinity: {
        min: 0,
        max: 240,
        optimalMin: 80,
        optimalMax: 120,
        unit: 'ppm',
        label: 'Alcalinidad',
        possibleValues: [0, 40, 80, 120, 180, 240] // Valores de las tiras InstaTest
    },
    hardness: {
        min: 0,
        max: 500,
        optimalMin: 50,
        optimalMax: 150,
        unit: 'ppm',
        label: 'Dureza',
        possibleValues: [0, 50, 120, 250, 500] // Valores de las tiras InstaTest
    }
};

/**
 * Genera recomendaciones basadas en los valores
 */
export const getRecommendations = (ph: number, alkalinity: number, hardness: number): string[] => {
    const recommendations: string[] = [];
    const { ph: phRange, alkalinity: alkRange, hardness: hardRange } = PARAMETER_RANGES;

    if (ph < phRange.optimalMin) {
        recommendations.push('pH bajo: Añadir corrector de pH para subir el nivel');
    } else if (ph > phRange.optimalMax) {
        recommendations.push('pH alto: Usar ácido para bajar el pH');
    }

    if (alkalinity < alkRange.optimalMin) {
        recommendations.push('Alcalinidad baja: El agua puede ser inestable, considerar buffer');
    } else if (alkalinity > alkRange.optimalMax) {
        recommendations.push('Alcalinidad alta: Puede afectar la eficacia de productos');
    }

    if (hardness > hardRange.optimalMax) {
        recommendations.push('Dureza alta: Considerar uso de secuestrantes o agua blanda');
    }

    if (recommendations.length === 0) {
        recommendations.push('Agua en condiciones óptimas para aplicación');
    }

    return recommendations;
};

/**
 * Determina la calidad general del agua
 */
const determineQuality = (ph: number, alkalinity: number, hardness: number): WaterQualityData['quality'] => {
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

/**
 * Simula análisis de tira reactiva desde foto usando valores de InstaTest
 */
export const analyzeWaterStrip = (_imageData: string): WaterQualityData => {
    // Simular con valores posibles de tiras InstaTest
    const phValues = PARAMETER_RANGES.ph.possibleValues!;
    const alkValues = PARAMETER_RANGES.alkalinity.possibleValues!;
    const hardValues = PARAMETER_RANGES.hardness.possibleValues!;
    
    const ph = phValues[Math.floor(Math.random() * phValues.length)];
    const alkalinity = alkValues[Math.floor(Math.random() * alkValues.length)];
    const hardness = hardValues[Math.floor(Math.random() * hardValues.length)];

    return {
        ph,
        alkalinity,
        hardness,
        quality: determineQuality(ph, alkalinity, hardness),
        recommendations: getRecommendations(ph, alkalinity, hardness),
    };
};

/**
 * Determina si el agua necesita corrección
 */
export const needsCorrection = (ph: number, alkalinity: number, hardness: number): boolean => {
    return ph < 6 || ph > 7 || alkalinity < 50 || alkalinity > 150 || hardness > 150;
};

/**
 * Obtiene el color de calidad
 */
export const getQualityColor = (quality: string): string => {
    switch (quality) {
        case 'excellent':
            return '#22c55e';
        case 'good':
            return '#84cc16';
        case 'fair':
            return '#f59e0b';
        case 'poor':
            return '#ef4444';
        default:
            return '#6b7280';
    }
};
