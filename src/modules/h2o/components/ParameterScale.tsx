interface ParameterScaleProps {
    label: string;
    value: number;
    min: number;
    max: number;
    optimalMin: number;
    optimalMax: number;
    unit: string;
}

export function ParameterScale({ label, value, min, max, optimalMin, optimalMax, unit }: ParameterScaleProps) {
    // Calcular posiciones en porcentaje
    const valuePercent = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    const optimalMinPercent = ((optimalMin - min) / (max - min)) * 100;
    const optimalMaxPercent = ((optimalMax - min) / (max - min)) * 100;
    const optimalMidPercent = (optimalMinPercent + optimalMaxPercent) / 2;

    // Determinar si está en rango óptimo
    const isOptimal = value >= optimalMin && value <= optimalMax;

    // Generar marcas de la escala
    const scaleMarks = [];
    const step = (max - min) / 5;
    for (let i = 0; i <= 5; i++) {
        scaleMarks.push(Math.round(min + step * i));
    }

    return (
        <div className="bg-white p-5 rounded-2xl shadow-md border-2 border-loom/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">{label}</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isOptimal ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                    {value}{unit ? ` ${unit}` : ''}
                </div>
            </div>

            {/* Flechas indicadoras */}
            <div className="relative h-8 mb-1">
                {/* Flecha del valor actual */}
                <div
                    className="absolute flex flex-col items-center transition-all duration-500"
                    style={{ left: `${valuePercent}%`, transform: 'translateX(-50%)' }}
                >
                    <span className={`text-xs font-bold mb-0.5 ${isOptimal ? 'text-green-600' : 'text-loom'}`}>
                        Actual
                    </span>
                    <svg className={`w-4 h-4 ${isOptimal ? 'text-green-600' : 'text-loom'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>

                {/* Flecha del ideal - solo si NO está en rango óptimo */}
                {!isOptimal && (
                    <div
                        className="absolute flex flex-col items-center"
                        style={{ left: `${optimalMidPercent}%`, transform: 'translateX(-50%)' }}
                    >
                        <span className="text-xs font-bold text-green-600 mb-0.5">Ideal</span>
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Barra de escala */}
            <div className="relative">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="absolute h-3 bg-green-400 rounded-full"
                        style={{
                            left: `${optimalMinPercent}%`,
                            width: `${optimalMaxPercent - optimalMinPercent}%`
                        }}
                    />
                </div>
                <div
                    className="absolute top-0 w-1 h-3 bg-loom rounded-full transition-all duration-500"
                    style={{ left: `${valuePercent}%`, transform: 'translateX(-50%)' }}
                />
            </div>

            {/* Marcas numéricas */}
            <div className="relative h-5 mt-1">
                {scaleMarks.map((mark, index) => (
                    <span
                        key={index}
                        className="absolute text-xs text-gray-500 transform -translate-x-1/2"
                        style={{ left: `${(index / 5) * 100}%` }}
                    >
                        {mark}
                    </span>
                ))}
            </div>

            {/* Leyenda */}
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>Óptimo: {optimalMin}-{optimalMax}{unit ? ` ${unit}` : ''}</span>
                </div>
            </div>
        </div>
    );
}

export default ParameterScale;
