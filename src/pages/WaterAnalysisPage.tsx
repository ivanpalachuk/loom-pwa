import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { analyzeWaterStrip, PARAMETER_RANGES, getRecommendations, type WaterQualityData } from '../services/waterAnalysisService';

// Simular fetch de análisis desde backend
const fetchAnalysisById = async (id: string): Promise<WaterQualityData | null> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Por ahora, buscar en localStorage (en el futuro sería una llamada a API)
    const saved = localStorage.getItem('waterAnalyses');
    if (saved) {
        const analyses = JSON.parse(saved);
        const found = analyses.find((a: { id: number }) => a.id === parseInt(id));
        if (found) {
            return {
                ph: found.ph,
                alkalinity: found.alkalinity,
                hardness: found.hardness,
                quality: found.quality,
                recommendations: found.recommendations || getRecommendations(found.ph, found.alkalinity, found.hardness)
            };
        }
    }
    return null;
};

// Componente para mostrar un parámetro con línea de rango y flechas
interface ParameterScaleProps {
    label: string;
    value: number;
    min: number;
    max: number;
    optimalMin: number;
    optimalMax: number;
    unit: string;
}

function ParameterScale({ label, value, min, max, optimalMin, optimalMax, unit }: ParameterScaleProps) {
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
                {/* Flecha del valor actual - verde si está en rango óptimo */}
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

                {/* Flecha del ideal - solo mostrar si NO está en rango óptimo */}
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
                {/* Línea base */}
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    {/* Zona óptima */}
                    <div 
                        className="absolute h-3 bg-green-400 rounded-full"
                        style={{ 
                            left: `${optimalMinPercent}%`, 
                            width: `${optimalMaxPercent - optimalMinPercent}%` 
                        }}
                    />
                </div>

                {/* Marcador del valor actual */}
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

export default function WaterAnalysisPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const imageData = location.state?.imageData as string | undefined;

    const [analysis, setAnalysis] = useState<WaterQualityData | null>(null);
    const [analyzing, setAnalyzing] = useState(true);
    const [loadingFromHistory, setLoadingFromHistory] = useState(false);
    
    // Estado de ubicación persistente
    const [savedLocation, setSavedLocation] = useState<string | null>(null);
    
    // Modal de ubicación (para agregar ubicación o para PDF)
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationModalPurpose, setLocationModalPurpose] = useState<'save' | 'pdf'>('save');
    const [customLocation, setCustomLocation] = useState('');
    const [useAutoLocation, setUseAutoLocation] = useState(true);

    useEffect(() => {
        // Si viene con ID en la URL, hacer fetch desde "backend"
        if (id) {
            setLoadingFromHistory(true);
            fetchAnalysisById(id).then(result => {
                if (result) {
                    setAnalysis(result);
                } else {
                    // Si no se encontró, redirigir al historial
                    navigate('/water-history', { replace: true });
                }
                setAnalyzing(false);
                setLoadingFromHistory(false);
            });
            return;
        }

        // Redirect if no image data for new analysis
        if (!imageData) {
            navigate('/home', { replace: true });
            return;
        }

        // Simulate analysis delay for better UX
        const timer = setTimeout(() => {
            const result = analyzeWaterStrip(imageData);
            setAnalysis(result);
            setAnalyzing(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [id, imageData, navigate]);

    const handleBack = () => {
        navigate('/home');
    };

    // Guardar análisis en historial (futuro: enviar a backend)
    const handleSaveAnalysis = () => {
        if (!analysis) return;
        
        // Por ahora guardamos en localStorage
        const savedAnalyses = JSON.parse(localStorage.getItem('waterAnalyses') || '[]');
        const newAnalysis = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...analysis
        };
        savedAnalyses.push(newAnalysis);
        localStorage.setItem('waterAnalyses', JSON.stringify(savedAnalyses));
        
        alert('Análisis guardado en el historial');
    };

    // Agregar ubicación al análisis
    const handleAddLocation = () => {
        setLocationModalPurpose('save');
        setShowLocationModal(true);
    };

    // Guardar la ubicación en el estado
    const handleSaveLocation = async () => {
        let locationText = '';
        
        if (useAutoLocation) {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000
                    });
                });
                locationText = `Lat: ${position.coords.latitude.toFixed(6)}, Long: ${position.coords.longitude.toFixed(6)}`;
            } catch {
                alert('No se pudo obtener la ubicación automática');
                return;
            }
        } else {
            if (!customLocation.trim()) {
                alert('Por favor ingresa una ubicación');
                return;
            }
            locationText = customLocation;
        }
        
        setSavedLocation(locationText);
        setShowLocationModal(false);
        setCustomLocation('');
    };

    // Descargar como PDF - si ya tiene ubicación, generar directo
    const handleDownloadPDF = () => {
        if (savedLocation) {
            // Ya tiene ubicación, generar PDF directamente
            generatePDFWithLocation(savedLocation);
        } else {
            // Preguntar por ubicación
            setLocationModalPurpose('pdf');
            setShowLocationModal(true);
        }
    };

    // Confirmar ubicación desde modal y generar PDF
    const handleConfirmLocationForPDF = async () => {
        let locationText = 'Ubicación no especificada';
        
        if (useAutoLocation) {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000
                    });
                });
                locationText = `Lat: ${position.coords.latitude.toFixed(6)}, Long: ${position.coords.longitude.toFixed(6)}`;
            } catch {
                locationText = 'No se pudo obtener ubicación automática';
            }
        } else {
            locationText = customLocation || 'Ubicación no especificada';
        }
        
        // Guardar también en el estado
        setSavedLocation(locationText);
        setShowLocationModal(false);
        setCustomLocation('');
        
        generatePDFWithLocation(locationText);
    };

    // Generar el PDF con ubicación
    const generatePDFWithLocation = (locationText: string) => {
        if (!analysis) return;

        // Determinar si necesita corrección
        const needsCorrection = analysis.ph < 6 || analysis.ph > 7 || 
                               analysis.alkalinity < 50 || analysis.alkalinity > 150 ||
                               analysis.hardness > 150;
        const correctionText = needsCorrection ? '⚠️ REQUIERE CORRECCIÓN' : '✅ NO REQUIERE CORRECCIÓN';
        const correctionColor = needsCorrection ? '#ef4444' : '#22c55e';

        const now = new Date();
        const dateStr = now.toLocaleDateString('es-AR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Logo en base64 o URL absoluta
        const logoUrl = window.location.origin + '/logotest_02.png';

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Análisis de Agua - Loom</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #004EA8; padding-bottom: 20px; }
                    .logo-img { max-width: 200px; margin-bottom: 10px; }
                    .date { color: #888; font-size: 12px; margin-top: 10px; }
                    .section-title { color: #004EA8; font-size: 18px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
                    .location-box { background: #004EA8; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .location-label { font-size: 12px; opacity: 0.8; }
                    .location-value { font-size: 16px; font-weight: bold; margin-top: 5px; }
                    .parameter { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #004EA8; }
                    .param-name { font-weight: bold; color: #333; }
                    .param-value { font-size: 24px; color: #004EA8; margin: 5px 0; }
                    .param-optimal { font-size: 12px; color: #666; }
                    .correction-box { background: ${correctionColor}; color: white; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; font-size: 18px; font-weight: bold; }
                    .footer { margin-top: 40px; text-align: center; color: #888; font-size: 11px; border-top: 1px solid #eee; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${logoUrl}" alt="Loom" class="logo-img" />
                    <div class="date">${dateStr}</div>
                </div>

                <div class="section-title">📍 Ubicación</div>
                <div class="location-box">
                    <div class="location-label">Punto de muestreo</div>
                    <div class="location-value">${locationText}</div>
                </div>

                <div class="section-title">🔬 Resultados del Análisis</div>

                <div class="parameter">
                    <div class="param-name">pH</div>
                    <div class="param-value">${analysis.ph}</div>
                    <div class="param-optimal">Rango óptimo: 6 - 7</div>
                </div>

                <div class="parameter">
                    <div class="param-name">Alcalinidad</div>
                    <div class="param-value">${analysis.alkalinity} ppm</div>
                    <div class="param-optimal">Rango óptimo: 50 - 150 ppm</div>
                </div>

                <div class="parameter">
                    <div class="param-name">Dureza</div>
                    <div class="param-value">${analysis.hardness} ppm</div>
                    <div class="param-optimal">Rango óptimo: 0 - 150 ppm</div>
                </div>

                <div class="correction-box">
                    ${correctionText}
                </div>

                <div class="footer">
                    Generado por Loom - Agricultura Inteligente<br>
                    www.loom.com.ar
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            // Esperar a que cargue la imagen
            setTimeout(() => {
                printWindow.print();
            }, 500);
        }
    };

    // Calcular si necesita corrección
    const needsCorrection = analysis ? (
        analysis.ph < 6 || analysis.ph > 7 || 
        analysis.alkalinity < 50 || analysis.alkalinity > 150 ||
        analysis.hardness > 150
    ) : false;

    // Si no hay imagen y no hay ID (no viene del historial), no renderizar
    if (!imageData && !id) {
        return null;
    }

    return (
        <div className="bg-gray-50 flex flex-col" style={{ height: '100dvh' }}>
            {/* Modal de ubicación */}
            {showLocationModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            {locationModalPurpose === 'save' ? 'Agregar ubicación' : 'Ubicación del muestreo'}
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Opción automática */}
                            <label className="flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors"
                                style={{ borderColor: useAutoLocation ? '#004EA8' : '#e5e7eb' }}>
                                <input
                                    type="radio"
                                    checked={useAutoLocation}
                                    onChange={() => setUseAutoLocation(true)}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">Usar ubicación automática</p>
                                    <p className="text-sm text-gray-500">Obtener coordenadas GPS del dispositivo</p>
                                </div>
                            </label>

                            {/* Opción manual */}
                            <label className="flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors"
                                style={{ borderColor: !useAutoLocation ? '#004EA8' : '#e5e7eb' }}>
                                <input
                                    type="radio"
                                    checked={!useAutoLocation}
                                    onChange={() => setUseAutoLocation(false)}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">Escribir ubicación</p>
                                    <p className="text-sm text-gray-500 mb-2">Ej: Lote 5, Campo San José</p>
                                    {!useAutoLocation && (
                                        <input
                                            type="text"
                                            value={customLocation}
                                            onChange={(e) => setCustomLocation(e.target.value)}
                                            placeholder="Ingresá la ubicación..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-loom"
                                        />
                                    )}
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={locationModalPurpose === 'save' ? handleSaveLocation : handleConfirmLocationForPDF}
                                className="flex-1 py-3 px-4 bg-loom text-white rounded-xl font-semibold"
                            >
                                {locationModalPurpose === 'save' ? 'Guardar' : 'Generar PDF'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white shadow-sm flex-shrink-0">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2 text-gray-600 hover:text-loom transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-loom">Análisis de Agua</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
                    {analyzing ? (
                        /* Loading State */
                        <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-4 border-loom/20 rounded-full" />
                                <div className="absolute inset-0 border-4 border-loom border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                                {loadingFromHistory ? 'Cargando análisis' : 'Analizando muestra'}
                            </p>
                            <p className="text-sm text-gray-500">
                                {loadingFromHistory ? 'Obteniendo datos guardados' : 'Detectando parámetros de agua'}
                            </p>
                        </div>
                    ) : analysis && (
                        <>
                            {/* pH */}
                            <ParameterScale
                                label="pH"
                                value={analysis.ph}
                                min={PARAMETER_RANGES.ph.min}
                                max={PARAMETER_RANGES.ph.max}
                                optimalMin={PARAMETER_RANGES.ph.optimalMin}
                                optimalMax={PARAMETER_RANGES.ph.optimalMax}
                                unit={PARAMETER_RANGES.ph.unit}
                            />

                            {/* Alcalinidad */}
                            <ParameterScale
                                label="Alcalinidad"
                                value={analysis.alkalinity}
                                min={PARAMETER_RANGES.alkalinity.min}
                                max={PARAMETER_RANGES.alkalinity.max}
                                optimalMin={PARAMETER_RANGES.alkalinity.optimalMin}
                                optimalMax={PARAMETER_RANGES.alkalinity.optimalMax}
                                unit={PARAMETER_RANGES.alkalinity.unit}
                            />

                            {/* Dureza */}
                            <ParameterScale
                                label="Dureza"
                                value={analysis.hardness}
                                min={PARAMETER_RANGES.hardness.min}
                                max={PARAMETER_RANGES.hardness.max}
                                optimalMin={PARAMETER_RANGES.hardness.optimalMin}
                                optimalMax={PARAMETER_RANGES.hardness.optimalMax}
                                unit={PARAMETER_RANGES.hardness.unit}
                            />

                            {/* Recomendación de corrección */}
                            <div className={`p-5 rounded-2xl shadow-md border-2 text-center ${
                                needsCorrection 
                                    ? 'bg-amber-50 border-amber-400' 
                                    : 'bg-green-50 border-green-400'
                            }`}>
                                <div className="flex items-center justify-center gap-3">
                                    {needsCorrection ? (
                                        <>
                                            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span className="text-xl font-bold text-amber-700">Requiere corrección</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-xl font-bold text-green-700">No requiere corrección</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Actions List */}
                            <div className="bg-white rounded-2xl shadow-md border-2 border-loom/20 overflow-hidden">
                                {/* Agregar ubicación */}
                                <button
                                    onClick={handleAddLocation}
                                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100"
                                >
                                    <div className="w-10 h-10 rounded-full bg-loom/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold text-gray-800">
                                            {savedLocation ? 'Cambiar ubicación' : 'Agregar ubicación'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {savedLocation || 'GPS automático o manual'}
                                        </p>
                                    </div>
                                    {savedLocation ? (
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </button>

                                {/* Guardar Análisis - solo si es nuevo análisis */}
                                {!id && (
                                    <button
                                        onClick={handleSaveAnalysis}
                                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-loom/10 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-semibold text-gray-800">Guardar análisis en historial</p>
                                            <p className="text-sm text-gray-500">Almacenar para consultar después</p>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}

                                {/* Descargar PDF */}
                                <button
                                    onClick={handleDownloadPDF}
                                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100"
                                >
                                    <div className="w-10 h-10 rounded-full bg-loom/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold text-gray-800">Descargar como PDF</p>
                                        <p className="text-sm text-gray-500">Exportar análisis con ubicación</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Corregir mi agua */}
                                <button
                                    disabled
                                    className="w-full flex items-center gap-4 p-4 opacity-50 cursor-not-allowed"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold text-gray-400">Corregir mi agua</p>
                                        <p className="text-sm text-gray-400">Próximamente</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Back Button */}
                            <div className="pb-4">
                                <button
                                    onClick={handleBack}
                                    className="w-full bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold active:scale-95 transition-all"
                                >
                                    Volver al inicio
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
