type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    neutral: 'bg-gray-100 text-gray-700',
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
};

export function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
    return (
        <span className={`rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]}`}>
            {children}
        </span>
    );
}

// Helper para mapear quality a variant
export function getQualityVariant(quality: string): BadgeVariant {
    switch (quality) {
        case 'excellent':
            return 'success';
        case 'good':
            return 'success';
        case 'fair':
            return 'warning';
        case 'poor':
            return 'error';
        default:
            return 'neutral';
    }
}

export function getQualityLabel(quality: string): string {
    const labels: Record<string, string> = {
        excellent: 'Excelente',
        good: 'Buena',
        fair: 'Regular',
        poor: 'Deficiente',
    };
    return labels[quality] || quality;
}

export default Badge;
