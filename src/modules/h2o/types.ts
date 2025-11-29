// H2O Module Types

export interface WaterQualityData {
    ph: number;
    alkalinity: number;
    hardness: number;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    recommendations: string[];
}

export interface SavedAnalysis extends WaterQualityData {
    id: number;
    date: string;
    location?: string;
}

export interface ParameterRange {
    min: number;
    max: number;
    optimalMin: number;
    optimalMax: number;
    unit: string;
    label: string;
}

export interface ParameterRanges {
    ph: ParameterRange;
    alkalinity: ParameterRange;
    hardness: ParameterRange;
}
