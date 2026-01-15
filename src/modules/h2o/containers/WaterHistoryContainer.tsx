import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui';
import { AnalysisCard } from '../components';
import type { SavedAnalysis } from '../types';
import { getAnalyses, deleteAnalysis } from '../services';

export function WaterHistoryContainer() {
    const navigate = useNavigate();
    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);

    useEffect(() => {
        setAnalyses(getAnalyses());
    }, []);

    const handleViewAnalysis = (analysis: SavedAnalysis) => {
        navigate(`/water-analysis/${analysis.id}`);
    };

    const handleDeleteAnalysis = (id: number) => {
        deleteAnalysis(id);
        setAnalyses(prev => prev.filter(a => a.id !== id));
    };

    return (
        <div className="bg-gray-50 flex flex-col" style={{ height: '100dvh' }}>
            <PageHeader 
                title={<>Historial H<sub className="text-sm">2</sub>O</>}
                backTo="/home"
            />

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
                                <AnalysisCard
                                    key={analysis.id}
                                    analysis={analysis}
                                    onView={handleViewAnalysis}
                                    onDelete={handleDeleteAnalysis}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default WaterHistoryContainer;
