import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: ReactNode;
    onBack?: () => void;
    backTo?: string;
    rightContent?: ReactNode;
    action?: ReactNode;
    transparent?: boolean;
    withPattern?: boolean;
}

export function PageHeader({ title, onBack, backTo, rightContent, action, transparent = false, withPattern = false }: PageHeaderProps) {
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

    const headerContent = (
        <header className={`flex-shrink-0 ${transparent ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
            <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className={`p-2 transition-colors ${transparent ? 'text-white hover:bg-white hover:bg-opacity-20 rounded-full' : 'text-gray-600 hover:text-loom'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className={`text-2xl font-extrabold ${transparent ? 'text-white' : 'text-loom'}`}>
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

    if (withPattern) {
        return (
            <>
                {/* Extensión del color de fondo para cubrir el notch */}
                <div 
                    className="bg-gradient-to-br from-loom to-loom-70" 
                    style={{ 
                        height: 'env(safe-area-inset-top)',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 40
                    }}
                />
                <div 
                    className="relative bg-gradient-to-br from-loom to-loom-70 overflow-hidden flex-shrink-0" 
                    style={{ 
                        paddingTop: 'env(safe-area-inset-top)'
                    }}
                >
                    <div className="absolute inset-0 opacity-30">
                        <img 
                            src="/patron-03.png" 
                            alt="Patrón Loom" 
                            className="w-full h-full object-cover"
                            style={{ objectPosition: 'center' }}
                        />
                    </div>
                    <div className="relative z-10">
                        {headerContent}
                    </div>
                </div>
            </>
        );
    }

    return headerContent;
}

export default PageHeader;
