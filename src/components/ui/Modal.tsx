import type { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: ReactNode;
    subtitle?: string;
    showCloseButton?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg';
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

export function Modal({
    isOpen,
    onClose,
    children,
    title,
    subtitle,
    showCloseButton = true,
    maxWidth = 'md',
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`bg-white rounded-2xl p-6 w-full ${maxWidthClasses[maxWidth]} shadow-2xl`}>
                {(title || subtitle) && (
                    <div className="text-center mb-6">
                        {title && (
                            <h3 className="text-2xl font-bold text-loom">{title}</h3>
                        )}
                        {subtitle && (
                            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
                        )}
                    </div>
                )}

                {children}

                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="w-full mt-4 py-3 text-gray-500 font-medium"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </div>
    );
}

export default Modal;
