import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
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

  if (!showInstallPrompt) return null;

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
