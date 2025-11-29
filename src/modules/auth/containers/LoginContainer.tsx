import { useState, useEffect } from 'react';
import { login } from '../services';

interface LoginContainerProps {
    onLogin: () => void;
}

export function LoginContainer({ onLogin }: LoginContainerProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setFadeIn(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login();
        onLogin();
    };

    return (
        <div className={`min-h-screen bg-white flex items-center justify-center px-4 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <img
                        src="/logotest_02.png"
                        alt="Loom - Agricultura Inteligente"
                        className="h-40 mx-auto mb-4"
                    />
                </div>

                <div className="w-full">
                    <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Correo electrónico
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-loom focus:border-loom text-base"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-loom focus:border-loom text-base"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-loom focus:ring-loom border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Recordarme
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-loom hover:text-loom/80">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-loom hover:bg-loom/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-loom transition-colors"
                                >
                                    Iniciar Sesión
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href="#"
                                    className="w-full flex justify-center py-3 px-4 border border-loom rounded-lg shadow-sm text-base font-medium text-loom bg-white hover:bg-gray-50 transition-colors"
                                >
                                    Crear cuenta
                                </a>
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-xs text-gray-500">
                        Al iniciar sesión, aceptas nuestros{' '}
                        <a href="#" className="text-loom hover:underline">Términos de Servicio</a>
                        {' '}y{' '}
                        <a href="#" className="text-loom hover:underline">Política de Privacidad</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginContainer;
