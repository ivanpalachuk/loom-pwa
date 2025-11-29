import { Badge, getQualityVariant, getQualityLabel } from '../../../components/ui';
import type { SavedAnalysis } from '../types';
import { formatAnalysisDate, needsCorrection } from '../services';

interface AnalysisCardProps {
    analysis: SavedAnalysis;
    onView: (analysis: SavedAnalysis) => void;
    onDelete: (id: number) => void;
}

export function AnalysisCard({ analysis, onView, onDelete }: AnalysisCardProps) {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(analysis.id);
    };

    const requiresCorrection = needsCorrection(analysis.ph, analysis.alkalinity, analysis.hardness);

    return (
        <div
            onClick={() => onView(analysis)}
            className="w-full bg-white p-4 rounded-2xl shadow-md border-2 border-loom/10 text-left active:scale-[0.98] transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-sm text-gray-500">{formatAnalysisDate(analysis.date)}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getQualityVariant(analysis.quality)}>
                            {getQualityLabel(analysis.quality)}
                        </Badge>
                        {requiresCorrection ? (
                            <span className="text-xs text-amber-600 font-medium">Requiere corrección</span>
                        ) : (
                            <span className="text-xs text-green-600 font-medium">OK</span>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleDelete}
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
    );
}

export default AnalysisCard;
