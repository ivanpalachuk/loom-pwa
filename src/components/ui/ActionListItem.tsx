import type { ReactNode } from 'react';

interface ActionListItemProps {
    icon: ReactNode;
    title: string;
    subtitle?: string;
    onClick?: () => void;
    disabled?: boolean;
    rightIcon?: ReactNode;
    iconBgClass?: string;
}

export function ActionListItem({
    icon,
    title,
    subtitle,
    onClick,
    disabled = false,
    rightIcon,
    iconBgClass = 'bg-loom/10',
}: ActionListItemProps) {
    const baseClasses = "w-full flex items-center gap-4 p-4 transition-colors border-b border-gray-100 last:border-b-0";
    const interactiveClasses = disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-gray-50 active:bg-gray-100 cursor-pointer";

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`${baseClasses} ${interactiveClasses}`}
        >
            <div className={`w-10 h-10 rounded-full ${iconBgClass} flex items-center justify-center flex-shrink-0`}>
                {icon}
            </div>
            <div className="flex-1 text-left">
                <p className={`font-semibold ${disabled ? 'text-gray-400' : 'text-gray-800'}`}>
                    {title}
                </p>
                {subtitle && (
                    <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
                        {subtitle}
                    </p>
                )}
            </div>
            {rightIcon || (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            )}
        </button>
    );
}

interface ActionListProps {
    children: ReactNode;
}

export function ActionList({ children }: ActionListProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md border-2 border-loom/20 overflow-hidden">
            {children}
        </div>
    );
}

export default ActionListItem;
