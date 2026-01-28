# 🤖 Documentación para Agentes: Loom PWA

## 📚 Contexto
Esta aplicación es una **Progressive Web App (PWA)** diseñada para el análisis de calidad del agua mediante el escaneo de tiras reactivas (test strips). Su función principal es permitir a los usuarios capturar una foto de su tira de prueba, analizar automáticamente los colores para determinar niveles de químicos (pH, Alcalinidad, Dureza) y ofrecer recomendaciones de tratamiento.

## 🎯 ¿Qué hacemos? (Lógica de Negocio)

El núcleo de la aplicación es el módulo **`h2o`**. El flujo de valor es el siguiente:

1.  **Captura**: El usuario toma una foto de la tira reactiva usando la cámara del dispositivo.
2.  **Procesamiento**: La imagen se procesa digitalmente para extraer los colores de zonas específicas.
3.  **Análisis**: Los colores extraídos entra en un algoritmo de comparación de color (Euclidean distance) contra una base de datos de colores de referencia calibrados.
4.  **Diagnóstico**: Se determinan los valores químicos exactos y se evalúa la calidad del agua (Excelente, Buena, Regular, Mala).
5.  **Recomendación**: Se generan acciones correctivas basadas en los desvíos encontrados.

## 🛠 ¿Cómo lo hacemos? (Implementación Técnica)

### 1. Estructura del Proyecto
El código relevante se encuentra principalmente en:
- `src/modules/h2o/`: **Cerebro del análisis**. Contiene toda la lógica de dominio.
- `src/components/Camera.tsx`: Manejo de hardware, permisos y UX de captura.

### 2. El Pipeline de Análisis (`src/modules/h2o`)
El proceso de análisis está orquestado por `stripAnalyzer.ts` y sigue estos pasos:

#### A. Detección de Tira (`stripDetection.ts`) [NUEVO]
- **Objetivo**: Localizar automáticamente la tira reactiva en la imagen, permitiendo mayor libertad en la captura.
- **Método**: Analiza histogramas de brillo (columnas y filas) para encontrar el rectángulo blanco dominante (la tira plástica).
- **Fallback**: Si no se detecta una tira (confianza baja), usa las zonas estáticas predefinidas (`INSTATEST_ZONES`).

#### B. Extracción de Color (`colorExtraction.ts`)
- Convierte la imagen a un Canvas.
- **Zonas Dinámicas**: Si se detectó la tira, las zonas (pH, Alk, Hardness) se calculan como porcentajes relativos al *rectángulo de la tira detectada*, no de la imagen completa.
- Extrae el color promedio (RGB) de cada zona.

#### C. Coincidencia de Color (`colorMatching.ts`)
- Utiliza **Distancia Euclidiana** en el espacio RGB para encontrar la coincidencia más cercana.
- Compara contra constantes definidas (`PH_COLOR_REFERENCES`, etc.) que mapean valores RGB a valores químicos reales.
- Calcula un "Nivel de Confianza" basado en qué tan lejos está el color detectado de la referencia más cercana.

### 3. Captura y Simulación (`components/Camera.tsx`)
- Utiliza la API nativa `MediaDevices.getUserMedia`.
- **Modo Simulación**: Para desarrollo local (donde no hay cámara accesible), el componente incluye un modo que carga una imagen de prueba (`/water-test-strip-sample.png`) o genera un canvas sintético. Esto es crucial validaciones rápidas sin dispositivos físicos.

## 🧬 Modelos de Datos Clave (`types.ts`)

La interfaz principal es `WaterQualityData`:
```typescript
interface WaterQualityData {
    ph: number;          // Valor medido
    alkalinity: number;  // ppm
    hardness: number;    // ppm
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    recommendations: string[]; // Lista de acciones para el usuario
}
```

## ⚠️ Puntos de Atención para Agentes
- **Calibración**: La precisión depende fuertemente de la iluminación y la posición de la tira. El sistema asume una orientación y distancia específicas.
- **Referencias de Color**: Si se cambia de marca de tiras, se deben recalibrar las constantes en `colorMatching.ts`.
- **Navegación**: El flujo de análisis ocurre estado `location.state` para pasar la imagen entre `Camera.tsx` y `WaterAnalysisPage.tsx`.

## 🚀 Cómo extender
Si necesitas añadir un nuevo parámetro de análisis (ej. Cloro):
1.  Define las nuevas zonas en `colorExtraction.ts`.
2.  Añade las referencias de color en `colorMatching.ts`.
3.  Actualiza `WaterQualityData` y la lógica de recomendaciones en `stripAnalyzer.ts`.
