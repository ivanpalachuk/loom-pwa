import type { Product, ProductFilters } from '../types';

// Productos H2oControl Agro 2026 - Precios con 50% de incremento + IVA
const H2O_CONTROL_PRODUCTS: Product[] = [
    {
        id: 'h2o-001',
        name: 'XTM',
        description: 'Coadyuvante compatibilizante con tecnología de nano-emulsión. Mejora la mezcla y compatibilidad de productos fitosanitarios.',
        shortDescription: 'Coadyuvante Compatibilizante Tecnología de nano-emulsión',
        imageUrl: '/h2o_xtm.png',
        price: 22.5, // 15.00 * 1.5
        presentations: [
            { size: '10 Lts', pricePerLiter: 22.5, stock: 50 }
        ],
        category: 'coadyuvantes',
        stock: 50,
        sku: 'H2O-XTM-001',
        brand: 'H2oControl',
        color: '#D32F2F', // rojo
        waterCorrection: {
            parameter: 'all',
            action: 'balance'
        }
    },
    {
        id: 'h2o-002',
        name: 'ACTION',
        description: 'Aceite multixito coadyuvante emulsionante. Excelente adhesividad y adherencia. Mejora la penetración de productos.',
        shortDescription: 'Aceite multixito Coadyuvante Emulsionante Adherente Antievaporante',
        imageUrl: '/h2o_action.png',
        price: 15.0, // 10.00 * 1.5
        presentations: [
            { size: '20 Lts', pricePerLiter: 15.0, stock: 100 },
            { size: '5 Lts', pricePerLiter: 16.5, stock: 80 } // 11.00 * 1.5
        ],
        category: 'coadyuvantes',
        stock: 180,
        sku: 'H2O-ACTION-002',
        brand: 'H2oControl',
        color: '#FF6F00', // naranja
        waterCorrection: {
            parameter: 'all',
            action: 'balance'
        }
    },
    {
        id: 'h2o-003',
        name: 'DROP',
        description: 'Fitosanulante coadyuvante y corrector de aguas. Acidificante de agua de pulverización. Mejora la efectividad de agroquímicos.',
        shortDescription: 'Fitosanulante Coadyuvante Corrector de aguas Adherente',
        imageUrl: '/h2o_drop.png',
        price: 18.0, // 12.00 * 1.5
        presentations: [
            { size: '5 Lts', pricePerLiter: 18.0, stock: 60 },
            { size: '1 Lt', pricePerLiter: 19.5, stock: 120 } // 13.00 * 1.5
        ],
        category: 'correctores',
        stock: 180,
        sku: 'H2O-DROP-003',
        brand: 'H2oControl',
        color: '#1976D2', // azul
        waterCorrection: {
            parameter: 'ph',
            action: 'decrease'
        }
    },
    {
        id: 'h2o-004',
        name: 'MIX',
        description: 'Compatibilizador universal de productos fitosanitarios. Facilita la mezcla de productos incompatibles. Evita floculación y precipitaciones.',
        shortDescription: 'Compatibilizador',
        imageUrl: '/h2o_mix.png',
        price: 15.0, // 10.00 * 1.5
        presentations: [
            { size: '5 Lts', pricePerLiter: 15.0, stock: 70 }
        ],
        category: 'coadyuvantes',
        stock: 70,
        sku: 'H2O-MIX-004',
        brand: 'H2oControl',
        color: '#757575', // gris
        waterCorrection: {
            parameter: 'all',
            action: 'balance'
        }
    },
    {
        id: 'h2o-005',
        name: 'SYNERGYCIDE',
        description: 'Coadyuvante humectante y antievaporante. Reduce la evaporación del caldo. Mejora cobertura y penetración foliar.',
        shortDescription: 'Coadyuvante Humectante Antievaporante Adherente',
        imageUrl: '/h2o_synergycide.png',
        price: 15.0, // 10.00 * 1.5
        presentations: [
            { size: '5 Lts', pricePerLiter: 15.0, stock: 90 },
            { size: '1 Lt', pricePerLiter: 16.5, stock: 150 } // 11.00 * 1.5
        ],
        category: 'coadyuvantes',
        stock: 240,
        sku: 'H2O-SYNC-005',
        brand: 'H2oControl',
        color: '#0288D1', // celeste
        waterCorrection: {
            parameter: 'all',
            action: 'balance'
        }
    },
    {
        id: 'h2o-006',
        name: 'COMBATE',
        description: 'Sulfato de amonio Premium. Corrector de pH y fuente de nitrógeno. Potencia la acción de herbicidas. Reduce dureza del agua.',
        shortDescription: 'Sulfato de amonio Premium Corrector de aguas',
        imageUrl: '/h2o_combate.png',
        price: 4.2, // 2.80 * 1.5
        presentations: [
            { size: '20 Lts', pricePerLiter: 4.2, stock: 200 },
            { size: '5 Lts', pricePerLiter: 4.5, stock: 150 } // 3.00 * 1.5
        ],
        category: 'correctores',
        stock: 350,
        sku: 'H2O-COMBATE-006',
        brand: 'H2oControl',
        color: '#388E3C', // verde
        waterCorrection: {
            parameter: 'ph',
            action: 'decrease'
        }
    },
    {
        id: 'h2o-007',
        name: 'AGROTURBO',
        description: 'Corrector de pH y secuestrante de cationes. Elimina sales que interfieren con agroquímicos. Optimiza dureza del agua.',
        shortDescription: 'Corrector de pH Secuestrante de Cationes',
        imageUrl: '/h2o_agroturbo.png',
        price: 15.0, // 10.00 * 1.5
        presentations: [
            { size: '5 Lts', pricePerLiter: 15.0, stock: 60 },
            { size: '1 Lt', pricePerLiter: 16.5, stock: 100 } // 11.00 * 1.5
        ],
        category: 'correctores',
        stock: 160,
        sku: 'H2O-AGRO-007',
        brand: 'H2oControl',
        color: '#D32F2F', // rojo
        waterCorrection: {
            parameter: 'ph',
            action: 'decrease'
        }
    },
    {
        id: 'h2o-008',
        name: 'OXOCAT',
        description: 'Bactericida y fungicida de amplio espectro. A base de peróxido de hidrógeno estabilizado. Limpieza de sistemas de riego.',
        shortDescription: 'Bactericida Fungicida',
        imageUrl: '/h2o_oxocat.png',
        price: 19.5, // 13.0 * 1.5
        presentations: [
            { size: '5 Lts', pricePerLiter: 19.5, stock: 40 }
        ],
        category: 'bactericidas',
        stock: 40,
        sku: 'H2O-OXOCAT-008',
        brand: 'H2oControl',
        color: '#1565C0', // azul oscuro
    },
    {
        id: 'h2o-009',
        name: 'PERCYDE',
        description: 'Bioactiv proteoproteína para tratamiento de sistemas de riego. Elimina biofilm y obstrucciones. Previene taponamientos de goteros.',
        shortDescription: 'Bioactiv proteoproteína Tratamiento de sistemas de riego',
        imageUrl: '/h2o_percyde.png',
        price: 7.5, // 5.00 * 1.5
        presentations: [
            { size: '20 Lts', pricePerLiter: 7.5, stock: 80 }
        ],
        category: 'bactericidas',
        stock: 80,
        sku: 'H2O-PERCYDE-009',
        brand: 'H2oControl',
        color: '#2E7D32', // verde oscuro
    },
    {
        id: 'h2o-010',
        name: 'CLEAN',
        description: 'Limpiador o moldeador de fitosanitarios. Limpieza de equipos de aplicación. Elimina residuos de herbicidas, insecticidas y fungicidas.',
        shortDescription: 'Limpiador o moldeador de Fitosanitarios',
        imageUrl: '/h2o_clean.png',
        price: 10.5, // 7.00 * 1.5
        presentations: [
            { size: '1 Lt', pricePerLiter: 10.5, stock: 100 }
        ],
        category: 'limpiadores',
        stock: 100,
        sku: 'H2O-CLEAN-010',
        brand: 'H2oControl',
        color: '#00ACC1', // cyan
    },
];

// Mock de productos Loom originales
const LOOM_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Loom Glif 48',
        description: 'Malla antigranizo premium de alta resistencia. Protección superior contra granizo y condiciones climáticas extremas. Tecnología de tejido reforzado con filtro UV.',
        shortDescription: 'Malla antigranizo premium',
        imageUrl: '/loom_hail.png',
        price: 45000,
        category: 'antigranizo',
        stock: 15,
        sku: 'LOOM-GLIF-001',
        brand: 'Loom'
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
        sku: 'LOOM-LAM-005',
        brand: 'Loom'
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
        sku: 'LOOM-FERT-006',
        brand: 'Loom'
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
        sku: 'LOOM-FERTP-007',
        brand: 'Loom'
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
        sku: 'LOOM-PULV-008',
        brand: 'Loom'
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
        sku: 'LOOM-BOQ-009',
        brand: 'Loom'
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
        sku: 'LOOM-MET-010',
        brand: 'Loom'
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
        sku: 'LOOM-AZO-011',
        brand: 'Loom'
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
        sku: 'LOOM-IMI-012',
        brand: 'Loom'
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
        brand: 'Loom',
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
        brand: 'Loom',
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
        brand: 'Loom',
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
        brand: 'Loom',
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
        brand: 'Loom',
        waterCorrection: { parameter: 'all', action: 'balance' }
    }
];

// Combinar todos los productos
const MOCK_PRODUCTS: Product[] = [...H2O_CONTROL_PRODUCTS, ...LOOM_PRODUCTS];

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
                p.shortDescription?.toLowerCase().includes(query) ||
                p.brand?.toLowerCase().includes(query)
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

/**
 * Obtiene productos de H2oControl Agro
 */
export const getH2oControlProducts = async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return H2O_CONTROL_PRODUCTS;
};

/**
 * Obtiene productos por marca
 */
export const getProductsByBrand = async (brand: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PRODUCTS.filter(p => p.brand === brand);
};
