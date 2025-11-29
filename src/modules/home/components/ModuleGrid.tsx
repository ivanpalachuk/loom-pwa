import type { Module } from '../types';

interface ModuleGridProps {
    modules: Module[];
    onModuleClick: (moduleId: string) => void;
}

export function ModuleGrid({ modules, onModuleClick }: ModuleGridProps) {
    return (
        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
            {modules.map((module) => (
                <button
                    key={module.id}
                    onClick={() => onModuleClick(module.id)}
                    className="bg-loom text-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3),0_10px_30px_-5px_rgba(0,78,168,0.5)] active:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] active:scale-95 transition-all duration-150 flex items-center justify-center border-2 border-black/10"
                >
                    <h3 className="text-4xl sm:text-5xl font-bold">
                        {module.id === 'h2o' ? (
                            <>H<sub className="text-2xl sm:text-3xl">2</sub>O</>
                        ) : (
                            module.name
                        )}
                    </h3>
                </button>
            ))}
        </div>
    );
}

export default ModuleGrid;
