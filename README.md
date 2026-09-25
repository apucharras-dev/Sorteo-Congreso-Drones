# Sorteo Oficial — Congreso Internacional de Drones Tucumán

Aplicación web para realizar sorteos en vivo durante el Congreso Internacional de Drones Tucumán 2026.

## Inicio rápido

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173` en el navegador.

## Uso

1. Cargar el listado de participantes desde un archivo Excel (.xlsx, .xls, .csv)
2. Activar pantalla completa para proyectar
3. Sortear cada premio con validación de presencia
4. Exportar resultados al finalizar

### Modo demo

Desde la pantalla inicial o el panel de control (⚙), activar el modo demo con 30 participantes ficticios para probar el sistema.

### Configurar premios

Editar `src/config/premios.js`:

```javascript
export const PREMIOS_DEFAULT = [
  { id: 1, nombre: 'PREMIO 01' },
  { id: 2, nombre: 'PREMIO 02' },
];
```

### Sonidos (opcional)

Colocar archivos MP3 en `public/sounds/`:

- `sorteo-inicio.mp3`
- `nombre-pasando.mp3`
- `seleccion-final.mp3`
- `ganador-confirmado.mp3`

La aplicación funciona sin archivos de sonido.

## Formato del Excel

Columnas detectadas automáticamente (no todas son obligatorias):

| Nombre | Apellido | Nombre completo | DNI | Email | Empresa |
|--------|----------|-----------------|-----|-------|---------|

Mínimo requerido: **Nombre** o **Nombre completo**.

## Build para producción

```bash
npm run build
npm run preview
```

## Características

- Sorteo aleatorio con `crypto.getRandomValues()`
- Persistencia en `localStorage`
- Re-sorteo con exclusión de ausentes y ganadores
- Historial completo con timestamps
- Exportación a Excel
- Pantalla completa
- Responsive (1920×1080 y 1366×768)
