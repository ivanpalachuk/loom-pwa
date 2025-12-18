import { PARAMETER_RANGES } from '../services/waterAnalysis';
import type { WaterQualityData } from '../types';

interface InstaTestStripProps {
    data: WaterQualityData;
}

interface TestPad {
    label: string;
    value: number;
    unit: string;
    color: string;
    isOptimal: boolean;
}

export function InstaTestStrip({ data }: InstaTestStripProps) {
    const { ph, alkalinity, hardness } = data;
    const ranges = PARAMETER_RANGES;

    // Determinar colores según valor (simulando colores reales de tiras InstaTest)
    const getPhColor = (value: number): string => {
        if (value <= 6.2) return '#FFE135'; // Amarillo
        if (value <= 6.8) return '#F4E157'; // Amarillo-verde
        if (value <= 7.2) return '#90EE90'; // Verde claro
        if (value <= 7.8) return '#5DADE2'; // Azul claro
        return '#3498DB'; // Azul
    };

    const getAlkalinityColor = (value: number): string => {
        if (value === 0) return '#FFE5E5'; // Rosa muy claro
        if (value <= 40) return '#FFB6C1'; // Rosa claro
        if (value <= 80) return '#FF69B4'; // Rosa
        if (value <= 120) return '#FF1493'; // Rosa intenso
        if (value <= 180) return '#C71585'; // Rosa oscuro
        return '#8B008B'; // Magenta oscuro
    };

    const getHardnessColor = (value: number): string => {
        if (value === 0) return '#E8F5E9'; // Verde muy claro
        if (value <= 50) return '#A5D6A7'; // Verde claro
        if (value <= 120) return '#66BB6A'; // Verde
        if (value <= 250) return '#43A047'; // Verde intenso
        return '#2E7D32'; // Verde oscuro
    };

    const pads: TestPad[] = [
        {
            label: ranges.hardness.label,
            value: hardness,
            unit: ranges.hardness.unit,
            color: getHardnessColor(hardness),
            isOptimal: hardness >= ranges.hardness.optimalMin && hardness <= ranges.hardness.optimalMax
        },
        {
            label: ranges.alkalinity.label,
            value: alkalinity,
            unit: ranges.alkalinity.unit,
            color: getAlkalinityColor(alkalinity),
            isOptimal: alkalinity >= ranges.alkalinity.optimalMin && alkalinity <= ranges.alkalinity.optimalMax
        },
        {
            label: ranges.ph.label,
            value: ph,
            unit: ranges.ph.unit,
            color: getPhColor(ph),
            isOptimal: ph >= ranges.ph.optimalMin && ph <= ranges.ph.optimalMax
        }
    ];

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Tira reactiva */}
            <div className="relative bg-gradient-to-b from-gray-50 to-white p-8 rounded-3xl shadow-2xl border-4 border-loom/30">
                {/* Pads de prueba */}
                <div className="flex justify-around items-start gap-6 mb-8">
                    {pads.map((pad, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                            {/* Pad coloreado */}
                            <div className="relative">
                                <div
                                    className="w-20 h-28 rounded-2xl shadow-lg border-2 border-gray-200 transition-all duration-500 transform hover:scale-105"
                                    style={{ backgroundColor: pad.color }}
                                >
                                    {/* Indicador de óptimo */}
                                    {pad.isOptimal && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-md">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Etiqueta y valor */}
                            <div className="text-center mt-3">
                                <p className="text-xs font-semibold text-gray-600 mb-1">{pad.label}</p>
                                <p className={`text-lg font-bold ${pad.isOptimal ? 'text-green-600' : 'text-loom'}`}>
                                    {pad.value}{pad.unit}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Escala de referencia */}
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 text-center">
                        Rangos Óptimos
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                        {pads.map((pad, index) => (
                            <div key={index} className="text-center">
                                <p className="font-semibold text-gray-600 mb-1">{pad.label}</p>
                                <p className="text-green-600 font-bold">
                                    {pad.label === 'pH' 
                                        ? `${ranges.ph.optimalMin} - ${ranges.ph.optimalMax}`
                                        : pad.label === 'Alcalinidad'
                                        ? `${ranges.alkalinity.optimalMin} - ${ranges.alkalinity.optimalMax} ${ranges.alkalinity.unit}`
                                        : `${ranges.hardness.optimalMin} - ${ranges.hardness.optimalMax} ${ranges.hardness.unit}`
                                    }
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
