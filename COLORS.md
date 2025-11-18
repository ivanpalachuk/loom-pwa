# Paleta de Colores Loom - Guía de Desarrollo

## 🎨 Color Principal - PANTONE 2145 C

### RGB
- **R**: 0
- **G**: 78  
- **B**: 168

### HEX: `#004EA8`

---

## 📊 Variantes de Color (Opacidades)

### 100% - Color Principal
```css
background-color: #004EA8;
color: #004EA8;
```
**Uso en Tailwind**: `bg-loom` | `text-loom`

### 70% - Hover States
```css
background-color: #4D7FBD;
color: #4D7FBD;
```
**Uso en Tailwind**: `bg-loom-70` | `text-loom-70`

### 50% - Estados Intermedios
```css
background-color: #8099D3;
color: #8099D3;
```
**Uso en Tailwind**: `bg-loom-50` | `text-loom-50`

### 20% - Fondos Sutiles
```css
background-color: #CCDBF0;
color: #CCDBF0;
```
**Uso en Tailwind**: `bg-loom-20` | `text-loom-20`

### 10% - Fondos Muy Claros
```css
background-color: #E5EDF7;
color: #E5EDF7;
```
**Uso en Tailwind**: `bg-loom-10` | `text-loom-10`

---

## 💡 Guía de Uso

### Botones Primarios
```jsx
<button className="bg-loom hover:bg-loom-70 text-white">
  Acción Principal
</button>
```

### Botones Secundarios
```jsx
<button className="bg-white border border-loom text-loom hover:bg-loom-10">
  Acción Secundaria
</button>
```

### Fondos de Página
```jsx
<div className="bg-loom-10">
  Contenido de página
</div>
```

### Títulos y Encabezados
```jsx
<h1 className="text-loom font-bold">
  Título Principal
</h1>
```

### Links
```jsx
<a className="text-loom hover:text-loom-70">
  Enlace
</a>
```

### Inputs y Focus States
```jsx
<input className="border border-gray-300 focus:border-loom focus:ring-loom" />
```

---

## 🚨 Importantes

### Si los colores de Tailwind no funcionan:

Usar **inline styles** como fallback:
```jsx
// En lugar de className="bg-loom"
style={{ backgroundColor: '#004EA8' }}

// En lugar de className="text-loom"
style={{ color: '#004EA8' }}
```

### Verificar que tailwind.config.js tenga:
```js
colors: {
  'loom': {
    DEFAULT: '#004EA8',
    100: '#004EA8',
    70: '#4D7FBD',
    50: '#8099D3',
    20: '#CCDBF0',
    10: '#E5EDF7',
  },
}
```

---

## 🎯 Casos de Uso por Componente

| Componente | Uso Principal | Color |
|------------|---------------|-------|
| Splash | Fondo completo | `#004EA8` (100%) |
| Login | Fondo de página | `#E5EDF7` (10%) |
| Login | Botón principal | `#004EA8` (100%) |
| Login | Título | `#004EA8` (100%) |
| Header | Título/Logo | `#004EA8` (100%) |
| Botones hover | Estado hover | `#4D7FBD` (70%) |
| Fondos sutiles | Cards, secciones | `#E5EDF7` (10%) |

---

## 📱 Accesibilidad

### Contraste con Blanco
- **#004EA8 sobre blanco**: ✅ WCAG AAA (9.54:1)
- **Blanco sobre #004EA8**: ✅ WCAG AAA (9.54:1)

### Contraste con #E5EDF7 (10%)
- **#004EA8 sobre #E5EDF7**: ✅ WCAG AAA (8.92:1)

---

## 🔍 Debugging

Si no ves los colores:
1. Verificar que Vite esté corriendo
2. Limpiar caché: `rm -rf node_modules/.vite`
3. Reiniciar dev server: `npm run dev`
4. Verificar que `tailwind.config.js` tenga los colores
5. Verificar que `index.css` importe Tailwind
