/**
 * Componente para mostrar el resultado del análisis con nivel de confianza
 */

import type { StripAnalysisResult } from '../services/stripAnalyzer';

interface AnalysisResultProps {
  result: StripAnalysisResult;
}

// Rangos óptimos para cada parámetro
const OPTIMAL_RANGES: Record<string, { min: number; max: number }> = {
  ph: { min: 7.0, max: 7.4 },
  alkalinity: { min: 80, max: 120 },
  hardness: { min: 0, max: 120 },
};

const PARAM_LABELS: Record<string, string> = {
  ph: 'pH',
  alkalinity: 'Alcalinidad',
  hardness: 'Dureza',
};

const PARAM_UNITS: Record<string, string> = {
  ph: '',
  alkalinity: 'ppm',
  hardness: 'ppm',
};

export function AnalysisResult({ result }: AnalysisResultProps) {
  const { waterQuality, matches, averageConfidence } = result;

  // Filtrar FCL - solo mostrar pH, alkalinity, hardness
  const displayMatches = matches.filter(m => m.parameter !== 'fcl');

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

  // Verifica si un valor está dentro del rango óptimo
  const isInOptimalRange = (parameter: string, value: number): boolean => {
    const range = OPTIMAL_RANGES[parameter];
    if (!range) return true;
    return value >= range.min && value <= range.max;
  };

  // Calcular confianza solo de los parámetros mostrados
  const displayConfidence = displayMatches.length > 0
    ? Math.round(displayMatches.reduce((sum, m) => sum + m.confidence, 0) / displayMatches.length)
    : averageConfidence;

  return (
    <div className="space-y-4">
      {/* Card principal con todos los parámetros */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header con calidad general */}
        <div className="bg-gradient-to-r from-loom to-loom-dark p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/80 text-sm">Calidad del agua</div>
              <div className="text-white text-2xl font-bold">
                {getQualityLabel(waterQuality.quality)}
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-white font-semibold ${getQualityBadgeColor(waterQuality.quality)}`}>
              {displayConfidence}% confianza
            </div>
          </div>
        </div>

        {/* Parámetros en una sola card */}
        <div className="p-4">
          <div className="flex justify-around items-start">
            {displayMatches.map((match, index) => {
              const isOptimal = isInOptimalRange(match.parameter, match.value);
              const range = OPTIMAL_RANGES[match.parameter];

              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  {/* Cuadrado de color detectado */}
                  <div
                    className={`w-16 h-16 rounded-lg shadow-md border-2 ${
                      isOptimal ? 'border-green-400' : 'border-red-400'
                    }`}
                    style={{ backgroundColor: match.detectedColor }}
                  />
                  
                  {/* Información del parámetro */}
                  <div className="text-center mt-3">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {PARAM_LABELS[match.parameter]}
                    </div>
                    <div className={`text-xl font-bold mt-1 ${isOptimal ? 'text-gray-800' : 'text-red-600'}`}>
                      {match.value}{PARAM_UNITS[match.parameter]}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Óptimo: {range?.min}-{range?.max}
                    </div>
                    {!isOptimal && (
                      <div className="text-[10px] text-red-500 font-medium mt-1">
                        ⚠ Fuera de rango
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer con indicadores */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded border-2 border-green-400 bg-green-100"></div>
              <span>En rango</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded border-2 border-red-400 bg-red-100"></div>
              <span>Fuera de rango</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advertencias si la confianza es baja */}
      {displayConfidence < 70 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-semibold text-yellow-800 text-sm">Confianza baja</div>
              <div className="text-xs text-yellow-700 mt-1">
                Mejora la iluminación y centra bien la tira para mejores resultados.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
