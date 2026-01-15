/**
 * Componente para mostrar el resultado del análisis con nivel de confianza
 */

import type { StripAnalysisResult } from '../services/stripAnalyzer';

interface AnalysisResultProps {
  result: StripAnalysisResult;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const { waterQuality, matches, averageConfidence } = result;

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 80) return 'Alta';
    if (confidence >= 60) return 'Media';
    return 'Baja';
  };

  const getQualityBadgeColor = (quality: string): string => {
    switch (quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'acceptable': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualityLabel = (quality: string): string => {
    switch (quality) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Buena';
      case 'acceptable': return 'Aceptable';
      case 'poor': return 'Pobre';
      default: return 'Desconocida';
    }
  };

  return (
    <div className="space-y-4">
      {/* Nivel de confianza general */}
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Confianza del análisis</div>
            <div className={`text-2xl font-bold ${getConfidenceColor(averageConfidence)}`}>
              {averageConfidence}% - {getConfidenceLabel(averageConfidence)}
            </div>
          </div>
          <div className="relative w-16 h-16">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - averageConfidence / 100)}`}
                className={getConfidenceColor(averageConfidence)}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Calidad general */}
      <div className="text-center">
        <div
          className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg shadow-lg ${getQualityBadgeColor(waterQuality.quality)}`}
        >
          Calidad: {getQualityLabel(waterQuality.quality)}
        </div>
      </div>

      {/* Detalles de cada parámetro */}
      <div className="space-y-3">
        {matches.map((match, index) => {
          const paramLabels: Record<string, string> = {
            ph: 'pH',
            alkalinity: 'Alcalinidad',
            hardness: 'Dureza',
          };

          const paramUnits: Record<string, string> = {
            ph: '',
            alkalinity: 'ppm',
            hardness: 'ppm',
          };

          return (
            <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-800">
                    {paramLabels[match.parameter]}
                  </div>
                  <div className="text-2xl font-bold text-loom">
                    {match.value} {paramUnits[match.parameter]}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Confianza</div>
                  <div className={`text-lg font-bold ${getConfidenceColor(match.confidence)}`}>
                    {match.confidence}%
                  </div>
                </div>
              </div>

              {/* Comparación de colores */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Color detectado</div>
                  <div
                    className="h-10 rounded border-2 border-gray-300"
                    style={{ backgroundColor: match.detectedColor }}
                  />
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    {match.detectedColor}
                  </div>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Color referencia</div>
                  <div
                    className="h-10 rounded border-2 border-gray-300"
                    style={{ backgroundColor: match.referenceColor }}
                  />
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    {match.referenceColor}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advertencias si la confianza es baja */}
      {averageConfidence < 70 && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-semibold text-yellow-800">Confianza baja</div>
              <div className="text-sm text-yellow-700 mt-1">
                Los colores detectados no coinciden perfectamente con las referencias. 
                Considera mejorar la iluminación o ajustar las zonas de calibración.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
