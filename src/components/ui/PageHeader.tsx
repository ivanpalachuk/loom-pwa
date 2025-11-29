import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: ReactNode;
    onBack?: () => void;
    backTo?: string;
    rightContent?: ReactNode;
}

export function PageHeader({ title, onBack, backTo, rightContent }: PageHeaderProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (backTo) {
            navigate(backTo);
        } else {
            navigate(-1);
        }
    };

    return (
        <header className="bg-white shadow-sm flex-shrink-0">
            <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2 text-gray-600 hover:text-loom transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-loom">{title}</h1>
                    </div>
                    {rightContent && (
                        <div>{rightContent}</div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default PageHeader;
