# Sistema de Análisis de Tiras Reactivas

Este documento explica cómo funciona el sistema de análisis de color para interpretar fotos reales de tiras reactivas.

## Arquitectura del Sistema

El sistema está dividido en varios módulos:

### 1. **Color Extraction** (`colorExtraction.ts`)

Extrae colores RGB de zonas específicas de la imagen.

**Funciones principales:**
- `imageToCanvas()`: Convierte una imagen a canvas para procesamiento
- `extractColorFromZone()`: Extrae el color promedio de una zona rectangular
- `extractStripColors()`: Extrae colores de todas las zonas predefinidas
- `colorDistance()`: Calcula la distancia euclidiana entre dos colores

**Zonas predefinidas:**
```typescript
INSTATEST_ZONES = [
  { x: 20%, y: 30%, width: 15%, height: 40%, parameter: 'ph' },
  { x: 45%, y: 30%, width: 15%, height: 40%, parameter: 'alkalinity' },
  { x: 70%, y: 30%, width: 15%, height: 40%, parameter: 'hardness' },
]
```

### 2. **Color Matching** (`colorMatching.ts`)

Compara colores extraídos con valores de referencia conocidos.

**Referencias de color:**
- `PH_COLOR_REFERENCES`: 12 valores de pH (6.0 - 8.2)
- `ALKALINITY_COLOR_REFERENCES`: 10 valores de alcalinidad (0 - 240 ppm)
- `HARDNESS_COLOR_REFERENCES`: 8 valores de dureza (0 - 425 ppm)

**Algoritmo:**
1. Calcula la distancia entre el color detectado y cada referencia
2. Encuentra el valor más cercano
3. Calcula un nivel de confianza basado en la distancia
4. Opcionalmente interpola entre valores cercanos

### 3. **Strip Analyzer** (`stripAnalyzer.ts`)

Orquesta todo el proceso de análisis.

**Proceso:**
1. Extrae colores de las zonas de la tira
2. Compara cada color con las referencias
3. Construye los datos de calidad del agua
4. Calcula confianza promedio
5. Determina la calidad general

### 4. **Componentes UI**

#### StripCalibration
- Muestra la imagen con zonas superpuestas
- Permite ajustar posición y tamaño de las zonas
- Visualiza los colores extraídos

#### AnalysisResult
- Muestra nivel de confianza del análisis
- Detalla cada parámetro con su valor
- Compara color detectado vs referencia
- Muestra advertencias si la confianza es baja

#### RealStripAnalyzer
- Componente integrado con 3 pasos:
  1. Calibración de zonas
  2. Análisis en progreso
  3. Resultados finales

## Uso del Sistema

### Ejemplo básico:

```typescript
import { analyzeStripPhoto } from '@/modules/h2o/services';
import { RealStripAnalyzer } from '@/modules/h2o/components';

// Usando el servicio directamente
const result = await analyzeStripPhoto(imageDataUrl);
console.log(result.waterQuality);
console.log(result.averageConfidence);

// Usando el componente UI
<RealStripAnalyzer
  imageData={imageDataUrl}
  onComplete={(result) => {
    console.log('Análisis completo:', result);
  }}
  onClose={() => setShowAnalyzer(false)}
/>
```

### Personalización de zonas:

```typescript
import { calibrateZones, INSTATEST_ZONES } from '@/modules/h2o/services';

// Ajustar zonas manualmente
const customZones = calibrateZones(
  INSTATEST_ZONES,
  5,    // offsetX: mover 5% a la derecha
  -3,   // offsetY: mover 3% hacia arriba
  1.1   // scale: aumentar 10%
);

const result = await analyzeStripPhoto(imageData, customZones);
```

## Mejoras Futuras

1. **Machine Learning**: Entrenar un modelo para mejorar la detección
2. **Auto-calibración**: Detectar automáticamente las zonas de la tira
3. **Corrección de iluminación**: Normalizar colores según condiciones de luz
4. **Detección de marca**: Identificar automáticamente el tipo de tira
5. **Guías de captura**: Overlays para ayudar al usuario a tomar mejores fotos

## Limitaciones Actuales

- Las zonas están predefinidas (requiere calibración manual)
- La iluminación afecta significativamente los resultados
- Solo funciona con tiras InstaTest (o similares con mismo layout)
- No detecta si la tira está boca abajo o rotada

## Recomendaciones para Mejores Resultados

1. **Iluminación uniforme**: Evitar sombras y reflejos
2. **Fondo neutro**: Usar una superficie blanca o gris
3. **Distancia correcta**: La tira debe ocupar ~70% del ancho de la foto
4. **Orientación**: Mantener la tira horizontal
5. **Tiempo de espera**: Esperar el tiempo indicado antes de fotografiar (usualmente 60s)
