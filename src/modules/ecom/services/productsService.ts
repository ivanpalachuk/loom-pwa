import type { Product, ProductFilters } from '../types';

// Mock de productos
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Loom Glif 48',
        description: 'Malla antigranizo premium de alta resistencia. Protección superior contra granizo y condiciones climáticas extremas. Tecnología de tejido reforzado con filtro UV.',
        shortDescription: 'Malla antigranizo premium',
        imageUrl: '/loom_hail.png',
        price: 45000,
        category: 'antigranizo',
        stock: 15,
        sku: 'LOOM-GLIF-001'
    },
    {
        id: '2',
        name: 'Loom Atra 50',
        description: 'Malla antigranizo con tecnología avanzada de triple capa. Ideal para protección de cultivos de alto valor. Mayor durabilidad y resistencia al desgarro.',
        shortDescription: 'Malla antigranizo avanzada',
        imageUrl: '/loom_hail.png',
        price: 52000,
        category: 'antigranizo',
        stock: 12,
        sku: 'LOOM-ATRA-002'
    },
    {
        id: '3',
        name: 'Loom Viento Pro',
        description: 'Malla cortaviento de alta resistencia estructural. Protección efectiva contra vientos fuertes y ráfagas. Reduce velocidad del viento hasta 80% sin frenar completamente el flujo de aire.',
        shortDescription: 'Malla cortaviento profesional',
        imageUrl: '/loom_wind.png',
        price: 35000,
        category: 'cortaviento',
        stock: 10,
        sku: 'LOOM-TEBU-003'
    },
    {
        id: '4',
        name: 'Loom Shield Plus',
        description: 'Sistema de protección integral multi-capa. Combina resistencia al granizo con barrera cortaviento. Máxima protección para cultivos de alto valor. Incluye sistema de anclaje reforzado.',
        shortDescription: 'Protección integral premium',
        imageUrl: '/loom_shield.png',
        price: 65000,
        category: 'proteccion',
        stock: 8,
        sku: 'LOOM-CIP-004'
    },
    {
        id: '5',
        name: 'Loom Viento Lite',
        description: 'Malla cortaviento económica de alta calidad. Solución eficiente para protección básica contra vientos. Fácil instalación y mantenimiento. Reduce velocidad del viento hasta 60%.',
        shortDescription: 'Malla cortaviento económica',
        imageUrl: '/loom_wind.png',
        price: 25000,
        category: 'cortaviento',
        stock: 18,
        sku: 'LOOM-LAM-005'
    },
    {
        id: '6',
        name: 'Loom Ferti N',
        description: 'Fertilizante nitrogenado de alta concentración. Fuente de nitrógeno de liberación rápida para aplicación al suelo. Ideal para cultivos de alta demanda nutricional.',
        shortDescription: 'Fertilizante nitrogenado',
        imageUrl: '/loom_products.png',
        price: 25000,
        category: 'fertilizantes',
        stock: 120,
        sku: 'LOOM-FERT-006'
    },
    {
        id: '7',
        name: 'Loom Ferti P',
        description: 'Fertilizante fosforado con nitrógeno. 18% N - 46% P2O5. Ideal para arranque de cultivos. Aporta fósforo de alta disponibilidad y nitrógeno para desarrollo inicial.',
        shortDescription: 'Fertilizante arrancador',
        imageUrl: '/loom_products.png',
        price: 28500,
        category: 'fertilizantes',
        stock: 95,
        sku: 'LOOM-FERTP-007'
    },
    {
        id: '8',
        name: 'Loom Pulverizadora 20L',
        description: 'Pulverizadora de espalda con bomba de presión manual. Tanque de 20 litros en polietileno de alta densidad. Incluye lanza regulable, boquillas intercambiables y correa acolchada.',
        shortDescription: 'Pulverizadora de 20L',
        imageUrl: '/loom_products.png',
        price: 45000,
        category: 'equipos',
        stock: 15,
        sku: 'LOOM-PULV-008'
    },
    {
        id: '9',
        name: 'Loom Boquillas Pro',
        description: 'Set de 4 boquillas de abanico plano 110 grados. Construcción en cerámica de alta durabilidad. Caudal calibrado para aplicaciones uniformes. Compatibles con barras pulverizadoras estándar.',
        shortDescription: 'Set 4 boquillas cerámicas',
        imageUrl: '/loom_products.png',
        price: 8500,
        category: 'equipos',
        stock: 67,
        sku: 'LOOM-BOQ-009'
    },
    {
        id: '10',
        name: 'Loom Storm Guard',
        description: 'Protección contra tormentas severas y granizo extremo. Sistema de doble capa con tejido reforzado de alta densidad. Soporta impactos de hasta 4cm de diámetro. Garantía extendida.',
        shortDescription: 'Protección anti-tormenta extrema',
        imageUrl: '/loom_hail.png',
        price: 72000,
        category: 'antigranizo',
        stock: 6,
        sku: 'LOOM-MET-010'
    },
    {
        id: '11',
        name: 'Loom Breeze',
        description: 'Malla cortaviento ligera y versátil. Permite circulación de aire controlada mientras protege cultivos delicados. Ideal para zonas con vientos moderados. Fácil transporte e instalación.',
        shortDescription: 'Malla cortaviento ligera',
        imageUrl: '/loom_wind.png',
        price: 20000,
        category: 'cortaviento',
        stock: 30,
        sku: 'LOOM-AZO-011'
    },
    {
        id: '12',
        name: 'Loom Frost Shield',
        description: 'Protección anti-heladas avanzada con tecnología térmica multicapa. Mantiene temperatura interna y protege contra heladas hasta -5°C. Incluye refuerzo contra viento y granizo leve.',
        shortDescription: 'Protección térmica anti-heladas',
        imageUrl: '/loom_shield.png',
        price: 42000,
        category: 'proteccion',
        stock: 16,
        sku: 'LOOM-IMI-012'
    },
    // Productos para corrección de agua
    {
        id: '13',
        name: 'Loom pH Down',
        description: 'Corrector de pH ácido para agua de riego. Reduce el pH del agua de forma controlada. Ideal para aguas con pH alto (mayor a 7.5). Formulación concentrada de ácido fosfórico.',
        shortDescription: 'Corrector de pH ácido',
        imageUrl: '/loom_products.png',
        price: 18500,
        category: 'agua',
        stock: 45,
        sku: 'LOOM-PHD-013',
        waterCorrection: { parameter: 'ph', action: 'decrease' }
    },
    {
        id: '14',
        name: 'Loom pH Up',
        description: 'Corrector de pH alcalino para agua de riego. Eleva el pH del agua de forma segura. Recomendado para aguas ácidas (pH menor a 6.5). Base de hidróxido de potasio.',
        shortDescription: 'Corrector de pH alcalino',
        imageUrl: '/loom_products.png',
        price: 19500,
        category: 'agua',
        stock: 38,
        sku: 'LOOM-PHU-014',
        waterCorrection: { parameter: 'ph', action: 'increase' }
    },
    {
        id: '15',
        name: 'Loom Alkalinity Down',
        description: 'Reductor de alcalinidad total. Disminuye carbonatos y bicarbonatos en el agua. Mejora la eficiencia de fertilizantes y pesticidas. Fórmula de ácido sulfúrico estabilizado.',
        shortDescription: 'Reductor de alcalinidad',
        imageUrl: '/loom_products.png',
        price: 22000,
        category: 'agua',
        stock: 28,
        sku: 'LOOM-ALD-015',
        waterCorrection: { parameter: 'alkalinity', action: 'decrease' }
    },
    {
        id: '16',
        name: 'Loom Soft Water',
        description: 'Ablandador de agua para dureza alta. Reduce calcio y magnesio mediante intercambio iónico. Previene obstrucciones en sistemas de riego. Protege equipos de irrigación.',
        shortDescription: 'Ablandador de agua',
        imageUrl: '/loom_products.png',
        price: 35000,
        category: 'agua',
        stock: 20,
        sku: 'LOOM-SFT-016',
        waterCorrection: { parameter: 'hardness', action: 'decrease' }
    },
    {
        id: '17',
        name: 'Loom Water Balance',
        description: 'Acondicionador completo de agua. Estabiliza pH, alcalinidad y dureza. Solución todo-en-uno para aguas problemáticas. Incluye quelatos y dispersantes.',
        shortDescription: 'Acondicionador completo',
        imageUrl: '/loom_products.png',
        price: 42000,
        category: 'agua',
        stock: 15,
        sku: 'LOOM-WBL-017',
        waterCorrection: { parameter: 'all', action: 'balance' }
    }
];

/**
 * Simula obtención de productos desde API
 */
export const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));

    let filtered = [...MOCK_PRODUCTS];

    if (filters) {
        // Filtro por categoría
        if (filters.category && filters.category !== 'todos') {
            filtered = filtered.filter(p => p.category === filters.category);
        }

        // Filtro por precio mínimo
        if (filters.minPrice !== undefined) {
            filtered = filtered.filter(p => p.price >= filters.minPrice!);
        }

        // Filtro por precio máximo
        if (filters.maxPrice !== undefined) {
            filtered = filtered.filter(p => p.price <= filters.maxPrice!);
        }

        // Filtro por búsqueda
        if (filters.searchQuery && filters.searchQuery.trim()) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.shortDescription?.toLowerCase().includes(query)
            );
        }
    }

    return filtered;
};

/**
 * Obtiene un producto por ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
};

/**
 * Obtiene todas las categorías disponibles
 */
export const getCategories = (): string[] => {
    return [...new Set(MOCK_PRODUCTS.map(p => p.category))];
};
