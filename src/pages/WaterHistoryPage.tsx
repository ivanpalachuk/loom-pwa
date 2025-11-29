import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SavedAnalysis {
    id: number;
    date: string;
    ph: number;
    alkalinity: number;
    hardness: number;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    recommendations?: string[];
}

export default function WaterHistoryPage() {
    const navigate = useNavigate();
    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('waterAnalyses');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Ordenar por fecha más reciente primero
            parsed.sort((a: SavedAnalysis, b: SavedAnalysis) => b.id - a.id);
            setAnalyses(parsed);
        }
    }, []);

    const handleBack = () => {
        navigate('/home');
    };

    const handleViewAnalysis = (analysis: SavedAnalysis) => {
        // Navegar a la vista de análisis con el ID (simula fetch desde backend)
        navigate(`/water-analysis/${analysis.id}`);
    };

    const handleDeleteAnalysis = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = analyses.filter(a => a.id !== id);
        setAnalyses(updated);
        localStorage.setItem('waterAnalyses', JSON.stringify(updated));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getQualityBadge = (quality: string) => {
        const styles: Record<string, string> = {
            excellent: 'bg-green-100 text-green-700',
            good: 'bg-lime-100 text-lime-700',
            fair: 'bg-amber-100 text-amber-700',
            poor: 'bg-red-100 text-red-700'
        };
        const labels: Record<string, string> = {
            excellent: 'Excelente',
            good: 'Buena',
            fair: 'Regular',
            poor: 'Deficiente'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[quality] || 'bg-gray-100 text-gray-700'}`}>
                {labels[quality] || quality}
            </span>
        );
    };

    // Determinar si necesita corrección
    const needsCorrection = (analysis: SavedAnalysis) => {
        return analysis.ph < 6 || analysis.ph > 7 || 
               analysis.alkalinity < 50 || analysis.alkalinity > 150 ||
               analysis.hardness > 150;
    };

    return (
        <div className="bg-gray-50 flex flex-col" style={{ height: '100dvh' }}>
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
                        <h1 className="text-xl font-bold text-loom">
                            Historial H<sub className="text-sm">2</sub>O
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-3xl mx-auto px-4 py-6">
                    {analyses.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sin análisis guardados</h3>
                            <p className="text-gray-500 mb-6">Realiza tu primer análisis de agua</p>
                            <button
                                onClick={() => navigate('/home')}
                                className="bg-loom text-white px-6 py-3 rounded-xl font-semibold"
                            >
                                Ir al inicio
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {analyses.map((analysis) => (
                                <div
                                    key={analysis.id}
                                    onClick={() => handleViewAnalysis(analysis)}
                                    className="w-full bg-white p-4 rounded-2xl shadow-md border-2 border-loom/10 text-left active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-sm text-gray-500">{formatDate(analysis.date)}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {getQualityBadge(analysis.quality)}
                                                {needsCorrection(analysis) ? (
                                                    <span className="text-xs text-amber-600 font-medium">Requiere corrección</span>
                                                ) : (
                                                    <span className="text-xs text-green-600 font-medium">OK</span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteAnalysis(analysis.id, e)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">pH</p>
                                            <p className="text-lg font-bold text-gray-800">{analysis.ph}</p>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Alcalinidad</p>
                                            <p className="text-lg font-bold text-gray-800">{analysis.alkalinity}</p>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Dureza</p>
                                            <p className="text-lg font-bold text-gray-800">{analysis.hardness}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
