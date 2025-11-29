import type { SavedAnalysis, WaterQualityData } from '../types';
import { getRecommendations } from './waterAnalysis';

const STORAGE_KEY = 'waterAnalyses';

/**
 * Obtiene todos los análisis guardados
 */
export const getAnalyses = (): SavedAnalysis[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    
    const analyses = JSON.parse(saved) as SavedAnalysis[];
    // Ordenar por fecha más reciente
    return analyses.sort((a, b) => b.id - a.id);
};

/**
 * Guarda un nuevo análisis
 */
export const saveAnalysis = (analysis: WaterQualityData, location?: string): SavedAnalysis => {
    const analyses = getAnalyses();
    const newAnalysis: SavedAnalysis = {
        id: Date.now(),
        date: new Date().toISOString(),
        location,
        ...analysis,
    };
    analyses.push(newAnalysis);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
    return newAnalysis;
};

/**
 * Obtiene un análisis por ID (simula fetch de backend)
 */
export const getAnalysisById = async (id: string): Promise<WaterQualityData | null> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    const analyses = getAnalyses();
    const found = analyses.find(a => a.id === parseInt(id));
    
    if (found) {
        return {
            ph: found.ph,
            alkalinity: found.alkalinity,
            hardness: found.hardness,
            quality: found.quality,
            recommendations: found.recommendations || getRecommendations(found.ph, found.alkalinity, found.hardness),
        };
    }
    return null;
};

/**
 * Elimina un análisis por ID
 */
export const deleteAnalysis = (id: number): void => {
    const analyses = getAnalyses().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
};

/**
 * Formatea fecha para mostrar
 */
export const formatAnalysisDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
