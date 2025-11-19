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
      className={`fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      style={{
        backgroundImage: 'url(/patron_loom_01.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#004EA8'
      }}
    >
      <div className="text-center animate-[pulse_2s_ease-in-out_infinite]">
        <img
          src="/logotest.png"
          alt="Loom"
          className="w-80 sm:w-96 md:w-[32rem] lg:w-[40rem] mx-auto"
        />
      </div>
    </div>
  );
}
