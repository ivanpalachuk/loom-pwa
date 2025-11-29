import { Modal } from '../../../components/ui';

interface H2OModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNewAnalysis: () => void;
    onViewHistory: () => void;
}

export function H2OModal({ isOpen, onClose, onNewAnalysis, onViewHistory }: H2OModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={<>H<sub className="text-lg">2</sub>O</>}
            subtitle="Análisis de agua"
            maxWidth="sm"
        >
            <div className="space-y-3">
                {/* Nuevo Análisis */}
                <button
                    onClick={onNewAnalysis}
                    className="w-full flex items-center gap-4 p-4 bg-loom text-white rounded-xl active:scale-95 transition-all"
                >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-lg">Nuevo análisis</p>
                        <p className="text-sm text-white/70">Tomar foto de tira reactiva</p>
                    </div>
                </button>

                {/* Ver Historial */}
                <button
                    onClick={onViewHistory}
                    className="w-full flex items-center gap-4 p-4 bg-gray-100 text-gray-800 rounded-xl active:scale-95 transition-all"
                >
                    <div className="w-12 h-12 rounded-full bg-loom/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-lg">Ver historial</p>
                        <p className="text-sm text-gray-500">Análisis guardados</p>
                    </div>
                </button>
            </div>
        </Modal>
    );
}

export default H2OModal;
