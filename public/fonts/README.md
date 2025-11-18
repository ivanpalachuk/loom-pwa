# Tipografía Loos - Instrucciones de Instalación

## 📁 Estructura de Archivos de Fuentes

Coloca los archivos de fuentes Loos en la carpeta `public/fonts/` con los siguientes nombres:

### Loos Condensed
- `Loos-Condensed-Light.woff2` / `Loos-Condensed-Light.woff`
- `Loos-Condensed-Regular.woff2` / `Loos-Condensed-Regular.woff`
- `Loos-Condensed-Medium.woff2` / `Loos-Condensed-Medium.woff`
- `Loos-Condensed-Bold.woff2` / `Loos-Condensed-Bold.woff`
- `Loos-Condensed-Black.woff2` / `Loos-Condensed-Black.woff`

### Loos Normal
- `Loos-Normal-Light.woff2` / `Loos-Normal-Light.woff`
- `Loos-Normal-Regular.woff2` / `Loos-Normal-Regular.woff`
- `Loos-Normal-Medium.woff2` / `Loos-Normal-Medium.woff`
- `Loos-Normal-Bold.woff2` / `Loos-Normal-Bold.woff`
- `Loos-Normal-Black.woff2` / `Loos-Normal-Black.woff`

### Loos Wide
- `Loos-Wide-Light.woff2` / `Loos-Wide-Light.woff`
- `Loos-Wide-Regular.woff2` / `Loos-Wide-Regular.woff`
- `Loos-Wide-Medium.woff2` / `Loos-Wide-Medium.woff`
- `Loos-Wide-Bold.woff2` / `Loos-Wide-Bold.woff`
- `Loos-Wide-Black.woff2` / `Loos-Wide-Black.woff`

## 🎨 Uso en Tailwind CSS

### Fuente Normal (predeterminada)
```jsx
<div className="font-loos">Texto con Loos Normal</div>
```

### Variantes de peso
```jsx
<div className="font-loos font-light">Light (300)</div>
<div className="font-loos font-normal">Regular (400)</div>
<div className="font-loos font-medium">Medium (500)</div>
<div className="font-loos font-bold">Bold (700)</div>
<div className="font-loos font-black">Black (900)</div>
```

### Loos Condensed
```jsx
<div className="font-loos-condensed font-bold" style={{ fontStretch: 'condensed' }}>
  Texto Condensado
</div>
```

### Loos Wide
```jsx
<div className="font-loos-wide font-bold" style={{ fontStretch: 'expanded' }}>
  Texto Wide
</div>
```

## ⚙️ Configuración Aplicada

- **fonts.css**: Define todos los @font-face
- **tailwind.config.js**: Configura las familias de fuentes personalizadas
- **index.css**: Importa las definiciones de fuentes

## 📦 Formatos de Fuente

Se recomienda usar WOFF2 como formato principal (mejor compresión) con WOFF como fallback para navegadores más antiguos.
