/**
 * Componente para calibrar y visualizar las zonas de detección en la tira
 */

import { useState, useEffect, useRef } from 'react';
import { extractStripColors, INSTATEST_ZONES, type ColorZone, type ExtractedColor } from '../services/colorExtraction';

interface StripCalibrationProps {
  imageData: string;
  onZonesCalibrated?: (zones: ColorZone[]) => void;
}

export function StripCalibration({ imageData, onZonesCalibrated }: StripCalibrationProps) {
  const [zones, setZones] = useState<ColorZone[]>(INSTATEST_ZONES);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageData && imageRef.current) {
      const img = imageRef.current;
      img.src = imageData;
    }
  }, [imageData]);

  const handleExtractColors = async () => {
    setIsExtracting(true);
    try {
      const colors = await extractStripColors(imageData, zones);
      setExtractedColors(colors);
    } catch (error) {
      console.error('Error extrayendo colores:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleZoneChange = (index: number, field: keyof ColorZone, value: number) => {
    const newZones = [...zones];
    (newZones[index][field] as number) = value;
    setZones(newZones);
    
    if (onZonesCalibrated) {
      onZonesCalibrated(newZones);
    }
  };

  const renderZoneOverlay = () => {
    if (!imageRef.current) return null;

    return zones.map((zone, index) => {
      const color = extractedColors.find(c => c.parameter === zone.parameter);
      
      return (
        <div
          key={index}
          className="absolute border-2 border-yellow-400"
          style={{
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            width: `${zone.width}%`,
            height: `${zone.height}%`,
            backgroundColor: color ? `${color.hex}40` : 'rgba(255, 255, 0, 0.2)',
          }}
        >
          <div className="absolute -top-6 left-0 bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded">
            {zone.parameter.toUpperCase()}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Vista previa de imagen con zonas */}
      <div className="relative inline-block w-full">
        <img
          ref={imageRef}
          alt="Water test strip"
          className="w-full rounded-lg"
          onLoad={() => handleExtractColors()}
        />
        <div className="absolute inset-0">
          {renderZoneOverlay()}
        </div>
      </div>

      {/* Botón para extraer colores */}
      <button
        onClick={handleExtractColors}
        disabled={isExtracting}
        className="w-full bg-loom text-white py-2 px-4 rounded-lg font-semibold hover:bg-loom-70 disabled:opacity-50"
      >
        {isExtracting ? 'Extrayendo colores...' : 'Actualizar análisis'}
      </button>

      {/* Colores extraídos */}
      {extractedColors.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {extractedColors.map((color, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-md">
              <div className="text-xs font-semibold text-gray-600 mb-2">
                {color.parameter.toUpperCase()}
              </div>
              <div
                className="w-full h-16 rounded mb-2"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-xs text-gray-500 font-mono">
                {color.hex}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Controles de calibración */}
      <details className="bg-gray-50 rounded-lg p-4">
        <summary className="cursor-pointer font-semibold text-gray-700 mb-3">
          Ajustes de calibración (avanzado)
        </summary>
        <div className="space-y-4 mt-3">
          {zones.map((zone, index) => (
            <div key={index} className="bg-white rounded p-3 space-y-2">
              <div className="font-semibold text-sm text-gray-700">
                {zone.parameter.toUpperCase()}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex flex-col">
                  <span className="text-gray-600 mb-1">X (%)</span>
                  <input
                    type="number"
                    value={zone.x}
                    onChange={(e) => handleZoneChange(index, 'x', Number(e.target.value))}
                    className="border rounded px-2 py-1"
                    min="0"
                    max="100"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-gray-600 mb-1">Y (%)</span>
                  <input
                    type="number"
                    value={zone.y}
                    onChange={(e) => handleZoneChange(index, 'y', Number(e.target.value))}
                    className="border rounded px-2 py-1"
                    min="0"
                    max="100"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-gray-600 mb-1">Ancho (%)</span>
                  <input
                    type="number"
                    value={zone.width}
                    onChange={(e) => handleZoneChange(index, 'width', Number(e.target.value))}
                    className="border rounded px-2 py-1"
                    min="1"
                    max="50"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-gray-600 mb-1">Alto (%)</span>
                  <input
                    type="number"
                    value={zone.height}
                    onChange={(e) => handleZoneChange(index, 'height', Number(e.target.value))}
                    className="border rounded px-2 py-1"
                    min="1"
                    max="50"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
