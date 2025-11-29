import type { WaterQualityData } from '../types';
import { needsCorrection } from '../services';

interface CorrectionStatusProps {
    analysis: WaterQualityData;
}

export function CorrectionStatus({ analysis }: CorrectionStatusProps) {
    const requiresCorrection = needsCorrection(analysis.ph, analysis.alkalinity, analysis.hardness);

    return (
        <div className={`rounded-2xl p-6 ${requiresCorrection ? 'bg-amber-50 border-2 border-amber-200' : 'bg-green-50 border-2 border-green-200'}`}>
            <div className="flex items-center justify-center gap-3">
                {requiresCorrection ? (
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
    );
}

export default CorrectionStatus;
