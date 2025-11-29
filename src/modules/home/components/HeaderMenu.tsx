interface HeaderMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    onLogout: () => void;
}

export function HeaderMenu({ isOpen, onToggle, onLogout }: HeaderMenuProps) {
    return (
        <>
            <button
                onClick={onToggle}
                className="p-2 text-gray-600 hover:text-loom transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50 mr-4">
                    <button
                        onClick={onLogout}
                        className="w-full px-4 py-3 text-left hover:bg-loom-10 transition-colors flex items-center gap-3 text-gray-700 hover:text-loom"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </>
    );
}

export default HeaderMenu;
