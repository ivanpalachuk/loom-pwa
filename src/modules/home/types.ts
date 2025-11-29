export interface Module {
    id: string;
    name: string;
    description: string;
}

export const MODULES: Module[] = [
    {
        id: 'h2o',
        name: 'H2O',
        description: 'Gestión de agua'
    },
    {
        id: 'mix',
        name: 'MIX',
        description: 'Mezclas y fórmulas'
    },
    {
        id: 'unknown',
        name: '?',
        description: 'Próximamente'
    },
    {
        id: 'ecommerce',
        name: 'E-COM',
        description: 'Comercio electrónico'
    }
];
