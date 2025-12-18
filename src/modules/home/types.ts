export interface Module {
    id: string;
    name: string;
    description: string;
}

export const MODULES: Module[] = [
    {
        id: 'h2o',
        name: 'H2O',
        description: 'Análisis de calidad de agua para riego'
    },
    {
        id: 'mix',
        name: 'MIX',
        description: 'Calculadora de caldo y dosis'
    },
    {
        id: 'unknown',
        name: '?',
        description: 'Preguntas y respuestas'
    },
    {
        id: 'ecommerce',
        name: 'TIENDA',
        description: 'Productos de protección agrícola'
    }
];
