import { useState, useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

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
    
    // Calcular si mostrar instrucciones iOS
    const shouldShowIOSInstructions = !isInStandaloneMode() && 
                                      (isIOS() && isSafari() && !localStorage.getItem('ios-install-dismissed')) ||
                                      (isChromeIOS() && !localStorage.getItem('chrome-ios-install-dismissed'));

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
        window.location.reload(); // Recargar para actualizar el estado
    };

    const startIOSTour = () => {
        const driverObj = driver({
            showProgress: true,
            showButtons: ['next', 'previous', 'close'],
            steps: [
                {
                    element: 'body',
                    popover: {
                        title: 'Instalar Loom como App',
                        description: 'Te guiaremos paso a paso para instalar Loom en tu dispositivo',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: '📱 Paso 1: Encuentra el botón Compartir',
                        description: 'En Safari, busca el botón de <strong>Compartir</strong> en la parte inferior de la pantalla. Es un cuadrado con una flecha hacia arriba (▭⬆)',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: '➕ Paso 2: Agregar a pantalla de inicio',
                        description: 'Desplázate por el menú y toca <strong>"Agregar a pantalla de inicio"</strong> o <strong>"Add to Home Screen"</strong>',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: '✅ Paso 3: Confirmar',
                        description: 'Toca el botón <strong>"Agregar"</strong> en la esquina superior derecha',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: '🎉 ¡Listo!',
                        description: 'La app Loom aparecerá en tu pantalla de inicio. Ábrela desde ahí para una experiencia completa',
                        side: 'top',
                        align: 'center'
                    }
                }
            ],
            onDestroyed: () => {
                handleIOSDismiss();
            }
        });
        
        driverObj.drive();
    };

    const startChromeTour = () => {
        const driverObj = driver({
            showProgress: true,
            showButtons: ['next', 'previous', 'close'],
            steps: [
                {
                    element: 'body',
                    popover: {
                        title: '⚠️ Chrome no puede instalar apps en iOS',
                        description: 'Chrome en iOS no soporta la instalación de PWAs. Necesitas usar Safari',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: '🌐 Paso 1: Abre Safari',
                        description: 'Copia esta URL y ábrela en el navegador <strong>Safari</strong> (el navegador azul de Apple)',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: '📱 Paso 2: Botón Compartir',
                        description: 'Una vez en Safari, toca el botón de <strong>Compartir</strong> (▭⬆) en la parte inferior',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: '➕ Paso 3: Agregar a pantalla',
                        description: 'Selecciona <strong>"Agregar a pantalla de inicio"</strong>',
                        side: 'top',
                        align: 'center'
                    }
                },
                {
                    popover: {
                        title: '🎉 ¡Todo listo!',
                        description: 'Confirma y la app estará disponible en tu pantalla de inicio',
                        side: 'top',
                        align: 'center'
                    }
                }
            ],
            onDestroyed: () => {
                handleIOSDismiss();
            }
        });
        
        driverObj.drive();
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

                        <div className="flex gap-2">
                            <button
                                onClick={isChrome ? startChromeTour : startIOSTour}
                                className="flex-1 bg-loom text-white py-2 px-4 rounded-lg text-sm font-semibold active:scale-95 transition-transform"
                            >
                                Ver guía paso a paso
                            </button>
                            <button
                                onClick={handleIOSDismiss}
                                className="px-4 py-2 text-gray-600 text-sm font-medium active:scale-95 transition-transform"
                            >
                                Cerrar
                            </button>
                        </div>
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
