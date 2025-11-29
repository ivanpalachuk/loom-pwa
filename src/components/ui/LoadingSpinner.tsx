interface LoadingSpinnerProps {
    title?: string;
    subtitle?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
};

export function LoadingSpinner({ 
    title = 'Cargando...', 
    subtitle,
    size = 'md' 
}: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className={`relative ${sizeClasses[size]}`}>
                <div className="absolute inset-0 border-4 border-loom/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-loom border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-lg font-semibold text-gray-800">{title}</p>
            {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
            )}
        </div>
    );
}

export default LoadingSpinner;
