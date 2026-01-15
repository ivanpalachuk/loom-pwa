/**
 * Componente integrado para análisis real de tiras reactivas
 */

import { useState } from 'react';
import { analyzeStripPhoto, validateStripImage, type StripAnalysisResult } from '../services/stripAnalyzer';
import { StripCalibration } from './StripCalibration';
import { AnalysisResult } from './AnalysisResult';
import type { ColorZone } from '../services/colorExtraction';

interface RealStripAnalyzerProps {
  imageData: string;
  onComplete?: (result: StripAnalysisResult) => void;
  onClose?: () => void;
}

export function RealStripAnalyzer({ imageData, onComplete, onClose }: RealStripAnalyzerProps) {
  const [step, setStep] = useState<'calibrate' | 'analyzing' | 'result'>('calibrate');
  const [customZones, setCustomZones] = useState<ColorZone[] | undefined>();
  const [analysisResult, setAnalysisResult] = useState<StripAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setStep('analyzing');
    setError(null);

    try {
      // Validar que la imagen contenga una tira
      const isValid = await validateStripImage(imageData);
      if (!isValid) {
        throw new Error('No se detectó una tira reactiva en la imagen');
      }

      // Analizar la tira
      const result = await analyzeStripPhoto(imageData, customZones);
      setAnalysisResult(result);
      setStep('result');

      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setStep('calibrate');
    }
  };

  const handleRecalibrate = () => {
    setStep('calibrate');
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-loom to-loom-70 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {step === 'calibrate' && 'Calibración de Tira'}
                {step === 'analyzing' && 'Analizando...'}
                {step === 'result' && 'Resultados del Análisis'}
              </h2>
              <p className="text-sm text-white text-opacity-90 mt-1">
                {step === 'calibrate' && 'Ajusta las zonas de detección si es necesario'}
                {step === 'analyzing' && 'Extrayendo y comparando colores'}
                {step === 'result' && 'Análisis completado con éxito'}
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-50 border-2 border-red-400 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold text-red-800">Error en el análisis</div>
                  <div className="text-sm text-red-700 mt-1">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Calibration */}
          {step === 'calibrate' && (
            <>
              <StripCalibration
                imageData={imageData}
                onZonesCalibrated={setCustomZones}
              />
              <div className="mt-6 flex gap-3">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  onClick={handleAnalyze}
                  className="flex-1 bg-loom text-white py-3 px-4 rounded-lg font-semibold hover:bg-loom-70 transition-colors"
                >
                  Analizar Tira
                </button>
              </div>
            </>
          )}

          {/* Step: Analyzing */}
          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-loom-10 rounded-full" />
                <div className="absolute inset-0 border-4 border-loom border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-lg font-medium text-gray-600">Analizando colores de la tira...</p>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-loom rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-loom rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-loom rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Step: Results */}
          {step === 'result' && analysisResult && (
            <>
              <AnalysisResult result={analysisResult} />
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleRecalibrate}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Recalibrar
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="flex-1 bg-loom text-white py-3 px-4 rounded-lg font-semibold hover:bg-loom-70 transition-colors"
                  >
                    Finalizar
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
