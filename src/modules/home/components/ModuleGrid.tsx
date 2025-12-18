import type { Module } from '../types';

interface ModuleGridProps {
    modules: Module[];
    onModuleClick: (moduleId: string) => void;
}

export function ModuleGrid({ modules, onModuleClick }: ModuleGridProps) {
    return (
        <div className="flex-1 flex flex-col gap-4 min-h-0 px-4">
            {modules.map((module) => (
                <button
                    key={module.id}
                    onClick={() => onModuleClick(module.id)}
                    className="relative overflow-hidden bg-loom text-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3),0_10px_30px_-5px_rgba(0,78,168,0.5)] active:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] active:scale-95 transition-all duration-150 flex flex-col items-center justify-center border-2 border-black/10 py-6 group"
                >
                    {/* Patrón de fondo */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 group-hover:opacity-30 transition-opacity"
                        style={{ 
                            backgroundImage: "url('/patron-03.png')",
                            backgroundSize: '200%'
                        }}
                    />
                    
                    {/* Contenido */}
                    <div className="relative z-10 text-center">
                        <h3 className="text-4xl sm:text-5xl font-bold mb-2">
                            {module.id === 'h2o' ? (
                                <>H<sub className="text-2xl sm:text-3xl">2</sub>O</>
                            ) : (
                                module.name
                            )}
                        </h3>
                        <p className="text-sm sm:text-base text-white/90 font-medium">
                            {module.description}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default ModuleGrid;
