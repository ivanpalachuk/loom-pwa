import type { WaterAnalysisResult } from '../types';
import type { Product } from '../../ecom/types';
import { getProducts } from '../../ecom/services/productsService';

interface WaterRecommendation {
    parameter: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
    recommendedProducts: Product[];
}

/**
 * Analiza los parámetros de agua y genera recomendaciones de productos
 */
export async function getWaterRecommendations(analysis: WaterAnalysisResult): Promise<WaterRecommendation[]> {
    const recommendations: WaterRecommendation[] = [];
    const allProducts = await getProducts();
    const waterProducts = allProducts.filter(p => p.category === 'agua');

    // Analizar pH
    const phIssue = analyzeParameter('pH', analysis.ph, 6.5, 7.5);
    if (phIssue) {
        const action = analysis.ph < 6.5 ? 'increase' : 'decrease';
        const products = waterProducts.filter(
            p => p.waterCorrection?.parameter === 'ph' && p.waterCorrection?.action === action
        );
        recommendations.push({
            parameter: 'pH',
            issue: phIssue.message,
            severity: phIssue.severity,
            recommendedProducts: products
        });
    }

    // Analizar Alcalinidad
    const alkIssue = analyzeParameter('Alcalinidad', analysis.alkalinity, 40, 120);
    if (alkIssue && analysis.alkalinity > 120) {
        const products = waterProducts.filter(
            p => p.waterCorrection?.parameter === 'alkalinity' && p.waterCorrection?.action === 'decrease'
        );
        recommendations.push({
            parameter: 'Alcalinidad',
            issue: alkIssue.message,
            severity: alkIssue.severity,
            recommendedProducts: products
        });
    }

    // Analizar Dureza
    const hardIssue = analyzeParameter('Dureza', analysis.hardness, 50, 200);
    if (hardIssue && analysis.hardness > 200) {
        const products = waterProducts.filter(
            p => p.waterCorrection?.parameter === 'hardness' && p.waterCorrection?.action === 'decrease'
        );
        recommendations.push({
            parameter: 'Dureza',
            issue: hardIssue.message,
            severity: hardIssue.severity,
            recommendedProducts: products
        });
    }

    // Si hay múltiples problemas, recomendar producto todo-en-uno
    if (recommendations.length >= 2) {
        const balanceProduct = waterProducts.find(
            p => p.waterCorrection?.parameter === 'all' && p.waterCorrection?.action === 'balance'
        );
        if (balanceProduct) {
            recommendations.push({
                parameter: 'General',
                issue: 'Múltiples parámetros fuera de rango',
                severity: 'high',
                recommendedProducts: [balanceProduct]
            });
        }
    }

    return recommendations;
}

/**
 * Analiza si un parámetro está fuera del rango óptimo
 */
function analyzeParameter(
    name: string,
    value: number,
    minOptimal: number,
    maxOptimal: number
): { message: string; severity: 'low' | 'medium' | 'high' } | null {
    if (value < minOptimal) {
        const deviation = ((minOptimal - value) / minOptimal) * 100;
        return {
            message: `${name} bajo (${value}). Rango óptimo: ${minOptimal}-${maxOptimal}`,
            severity: deviation > 20 ? 'high' : deviation > 10 ? 'medium' : 'low'
        };
    }
    
    if (value > maxOptimal) {
        const deviation = ((value - maxOptimal) / maxOptimal) * 100;
        return {
            message: `${name} alto (${value}). Rango óptimo: ${minOptimal}-${maxOptimal}`,
            severity: deviation > 20 ? 'high' : deviation > 10 ? 'medium' : 'low'
        };
    }

    return null;
}
