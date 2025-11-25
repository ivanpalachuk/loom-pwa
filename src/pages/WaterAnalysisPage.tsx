import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { analyzeWaterStrip, getQualityColor, getQualityLabel, type WaterQualityData } from '../services/waterAnalysisService';

export default function WaterAnalysisPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const imageData = location.state?.imageData as string | undefined;

    const [analysis, setAnalysis] = useState<WaterQualityData | null>(null);
    const [analyzing, setAnalyzing] = useState(true);

    useEffect(() => {
        // Redirect if no image data
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
    }, [imageData, navigate]);

    const handleBack = () => {
        navigate('/home');
    };

    if (!imageData) {
        return null;
    }

    return (
        <div className="bg-loom-10 flex flex-col" style={{ height: '100dvh' }}>
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
                <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {analyzing ? (
                    /* Loading State */
                    <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white rounded-2xl shadow-lg border border-loom/10">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-loom-20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-loom border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-lg font-semibold text-gray-800">Analizando tira reactiva</p>
                        <p className="text-sm text-gray-500">Detectando parámetros de agua</p>
                    </div>
                ) : analysis && (
                    <>
                        {/* Quality Badge */}
                        <div className="flex items-center justify-center">
                            <div
                                className="px-10 py-4 rounded-xl text-white font-bold text-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-2 border-white/20"
                                style={{ backgroundColor: getQualityColor(analysis.quality) }}
                            >
                                {getQualityLabel(analysis.quality)}
                            </div>
                        </div>

                        {/* Parameters Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Hardness Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Dureza (GH)</h3>
                                    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="mb-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-gray-800">{analysis.hardness}</span>
                                        <span className="text-lg text-gray-600">dGH</span>
                                    </div>
                                </div>
                                <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.min((analysis.hardness / 12) * 100, 100)}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Óptimo: 0-4 dGH
                                </p>
                            </div>

                            {/* pH Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Acidez (pH)</h3>
                                    <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <div className="mb-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-gray-800">{analysis.ph}</span>
                                        <span className="text-lg text-gray-600">pH</span>
                                    </div>
                                </div>
                                <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-400 to-pink-600 rounded-full transition-all duration-1000"
                                        style={{ width: `${((analysis.ph - 6) / 3) * 100}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Óptimo: 6.5-7.5 pH
                                </p>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-loom/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-loom-10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-loom" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Recomendaciones</h3>
                            </div>
                            <ul className="space-y-2">
                                {analysis.recommendations.map((rec, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3 p-4 bg-loom-10/50 rounded-xl"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-loom mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 leading-relaxed">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pb-4">
                            <button
                                onClick={handleBack}
                                className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold active:scale-95 transition-all"
                            >
                                Volver al Inicio
                            </button>
                            <button
                                onClick={() => navigate('/mix')}
                                className="flex-1 bg-loom text-white py-4 px-6 rounded-xl font-semibold shadow-[0_8px_30px_rgb(0,78,168,0.3)] active:scale-95 transition-all"
                            >
                                Generar MIX
                            </button>
                        </div>
                    </>
                )}
                </div>
            </main>
        </div>
    );
}
