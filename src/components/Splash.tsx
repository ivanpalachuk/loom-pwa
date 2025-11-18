import { useEffect, useState } from 'react';

interface SplashProps {
  onFinish: () => void;
}

export default function Splash({ onFinish }: SplashProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Iniciar fade out antes de finalizar
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Finalizar splash después del fade out
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center p-4 bg-loom transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center animate-[pulse_2s_ease-in-out_infinite]">
        <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-white tracking-wider">
          loom
        </h1>
      </div>
    </div>
  );
}
