import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface NavigatorStandalone extends Navigator {
    standalone?: boolean;
}

// Detectar iOS
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
};

// Detectar si está en Safari
const isSafari = () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

// Detectar si es Chrome en iOS
const isChromeIOS = () => {
    return /CriOS/.test(navigator.userAgent);
};

// Detectar si ya está instalada como PWA
const isInStandaloneMode = () => {
    return (window.matchMedia('(display-mode: standalone)').matches) || 
           (window.navigator as NavigatorStandalone).standalone === true;
};

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [iosDismissed, setIosDismissed] = useState(() => {
        return localStorage.getItem('ios-install-dismissed') === 'true' || 
               localStorage.getItem('chrome-ios-install-dismissed') === 'true';
    });
    
    // Calcular si mostrar instrucciones iOS
    const shouldShowIOSInstructions = !isInStandaloneMode() && 
                                      !iosDismissed &&
                                      (isIOS() && isSafari()) ||
                                      isChromeIOS();

    useEffect(() => {
        // No configurar listener si ya está instalada
        if (isInStandaloneMode()) {
            return;
        }

        // Handler para Android/Desktop Chrome
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User response: ${outcome}`);
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
    };

    const handleIOSDismiss = () => {
        if (isChromeIOS()) {
            localStorage.setItem('chrome-ios-install-dismissed', 'true');
        } else {
            localStorage.setItem('ios-install-dismissed', 'true');
        }
        setIosDismissed(true);
    };

    // Mostrar prompt de Android/Chrome Desktop
    if (showInstallPrompt && deferredPrompt) {
        return (
            <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl border-2 border-loom/20 p-4 z-50 animate-slide-up">
                <div className="flex items-start gap-3">
                    <img src="/logotest.png" alt="Loom" className="w-12 h-12 rounded-lg flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm mb-1">
                            Instalar Loom
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                            Instala la app para acceso rápido y funciona sin conexión
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="flex-1 bg-loom text-white py-2 px-4 rounded-lg text-sm font-semibold active:scale-95 transition-transform"
                            >
                                Instalar
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-2 text-gray-600 text-sm font-medium active:scale-95 transition-transform"
                            >
                                Ahora no
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    // Mostrar instrucciones para iOS
    if (shouldShowIOSInstructions) {
        const isChrome = isChromeIOS();
        
        return (
            <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl border-2 border-loom/20 p-4 z-50">
                <div className="flex items-start gap-3">
                    <img src="/logotest.png" alt="Loom" className="w-12 h-12 rounded-lg flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm mb-1">
                            Instalar Loom como App
                        </h3>
                        
                        {isChrome ? (
                            <div className="space-y-2 mb-3">
                                <p className="text-xs text-gray-600">
                                    Chrome no puede instalar apps en iOS. Por favor:
                                </p>
                                <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                                    <li>Abre esta página en <strong>Safari</strong></li>
                                    <li>Toca el botón <strong>Compartir</strong> (▭⬆)</li>
                                    <li>Selecciona <strong>"Agregar a pantalla de inicio"</strong></li>
                                </ol>
                            </div>
                        ) : (
                            <div className="space-y-2 mb-3">
                                <p className="text-xs text-gray-600 mb-2">
                                    Para instalar como app:
                                </p>
                                <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                                    <li>Toca el botón <strong>Compartir</strong> (▭⬆) abajo</li>
                                    <li>Desplázate y toca <strong>"Agregar a pantalla de inicio"</strong></li>
                                    <li>Toca <strong>"Agregar"</strong></li>
                                </ol>
                            </div>
                        )}

                        <button
                            onClick={handleIOSDismiss}
                            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium active:scale-95 transition-transform"
                        >
                            Entendido
                        </button>
                    </div>

                    <button
                        onClick={handleIOSDismiss}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
