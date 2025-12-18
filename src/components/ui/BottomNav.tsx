import { useNavigate, useLocation } from 'react-router-dom';
import { useBottomNav } from '../../contexts/BottomNavContext';
import type { ReactElement } from 'react';

interface NavItem {
    id: string;
    label: string;
    icon: ReactElement;
    path: string;
}

const navItems: NavItem[] = [
    {
        id: 'home',
        label: 'Home',
        path: '/home',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        id: 'perfil',
        label: 'Perfil',
        path: '/perfil',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        id: 'mapa',
        label: 'Mapa',
        path: '/mapa',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
        ),
    },
    {
        id: 'contacto',
        label: 'Contacto',
        path: '/contacto',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

export function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isVisible } = useBottomNav();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    // Solo mostrar el widget en estas rutas específicas
    const allowedRoutes = ['/home', '/perfil', '/mapa', '/contacto'];
    const shouldShow = allowedRoutes.includes(location.pathname) && isVisible;

    if (!shouldShow) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
            {/* Glassmorphism container */}
            <div className="mx-4 mb-4 rounded-2xl backdrop-blur-md border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]">
                <div className="flex items-center justify-around px-2 py-3">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`relative overflow-hidden flex items-center justify-center p-3 rounded-xl transition-all ${
                                    active
                                        ? 'text-white'
                                        : 'text-gray-700 hover:text-loom'
                                }`}
                            >
                                {active && (
                                    <>
                                        {/* Fondo con patrón */}
                                        <div className="absolute inset-0 bg-loom">
                                            <div 
                                                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                                                style={{ 
                                                    backgroundImage: "url('/patron-03.png')",
                                                    backgroundSize: '200%'
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="relative z-10 w-7 h-7 flex items-center justify-center">
                                    {item.icon}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
