interface PhotoConfirmProps {
    imageData: string;
    onConfirm: () => void;
    onRetake: () => void;
    onCancel: () => void;
}

export default function PhotoConfirm({ imageData, onConfirm, onRetake, onCancel }: PhotoConfirmProps) {
    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col" style={{ height: '100dvh' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur flex-shrink-0">
                <button
                    onClick={onCancel}
                    className="text-white p-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-white font-semibold text-sm">Confirmar foto</h2>
                <div className="w-6"></div>
            </div>

            {/* Image Preview */}
            <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden min-h-0">
                <img
                    src={imageData}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                />
            </div>

            {/* Message */}
            <div className="px-6 py-4 bg-gradient-to-t from-black via-black/90 to-transparent flex-shrink-0">
                <div className="text-center mb-4">
                    <p className="text-white font-medium text-lg">¿La foto se ve bien?</p>
                </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 bg-black flex-shrink-0" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
                <div className="flex gap-3">
                    <button
                        onClick={onRetake}
                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                        No, saquemos otra
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-loom text-white rounded-lg font-medium hover:bg-loom-70 transition-colors"
                    >
                        Sí, se ve bien
                    </button>
                </div>
            </div>
        </div>
    );
}
