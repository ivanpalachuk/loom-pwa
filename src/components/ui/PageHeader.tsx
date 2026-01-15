import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: ReactNode;
    onBack?: () => void;
    backTo?: string;
    rightContent?: ReactNode;
    action?: ReactNode;
    showBack?: boolean;
}

export function PageHeader({ title, onBack, backTo, rightContent, action, showBack = true }: PageHeaderProps) {
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
        <header className="bg-gradient-to-r from-loom to-loom-70 text-white flex-shrink-0">
            <div className="max-w-3xl mx-auto px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {showBack && (
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <h1 className="text-xl font-bold">
                            {title}
                        </h1>
                    </div>
                    {(rightContent || action) && (
                        <div>{rightContent || action}</div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default PageHeader;
