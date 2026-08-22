# ARTIKA - Sistema de Pedidos de Granizados

## Descripción del Proyecto

Sistema web de toma de pedidos para **ARTIKA GRANIZADOS**, un negocio especializado en granizados artesanales con y sin alcohol. La plataforma permite al personal tomar pedidos rápidamente y calcular cambios automáticamente.

## Características Principales

### 1. Sistema de Pedidos
- Selección de tamaño (9oz, 12oz, 16oz)
- Opción de con/sin alcohol
- Variedad de bebidas alcohólicas (Bodka Absolute, Four Loko)
- Selección de dulce obligatoria (Frunas, Cables, Chupos, Oka Loca, Corazones)
- Jeringas adicionales opcionales
- Carrito de pedido en tiempo real
- Notas de pedido

### 2. Pantalla de Cobro
- Botones de billetes rápidos ($2,000 a $100,000 COP)
- Entrada manual de cantidad personalizada
- Cálculo automático de cambio
- Validación de pago suficiente
- Interfaz clara y accesible

### 3. Branding Neon
- Colores: Cyan (#00FFFF), Magenta (#FF00FF), Púrpura (#8B00FF)
- Fondo oscuro (#0A0E27)
- Tipografía clara y legible
- Glow effects en elementos principales

## Tecnologías Utilizadas

- **HTML5** — Estructura
- **CSS3** — Diseño con animaciones
- **JavaScript Vanilla** — Lógica de pedidos
- **Google Sheets** — Base de datos
- **Google Apps Script** — Backend/API

## Estructura del Proyecto

```
Artika/
├── pedidos.html              # Sistema de toma de pedidos
├── sistema.css               # Estilos Neon
├── sistema.js                # Lógica de pedidos
├── google-apps-script.js     # Backend (copiar a Google)
├── Imagenes/
│   └── Logo.jpg              # Logo Neon
└── CLAUDE.md                 # Esta documentación
```

## Precios del Menú (COP)

### Sin Alcohol
- 9oz: **$8,000** (gancho)
- 12oz: **$12,500**
- 16oz: **$17,000** (mejor precio)

### Con Alcohol (Bodka o Four Loko)
- 9oz: **$9,000** (gancho)
- 12oz: **$15,000**
- 16oz: **$20,000** (mejor precio)

### Jeringas Adicionales
- 5ml: **$2,000**
- 10ml: **$3,000**

## Base de Datos (Google Sheets)

### Hojas Creadas Automáticamente

**Productos** — Catálogo de granizados
- Columnas: ID | Nombre | Categoría | Tamaño (oz) | Precio | Costo | Activo

**Pedidos** — Registro de pedidos tomados
- Columnas: ID | Fecha | Hora | Items (JSON) | Total | Dulce | Alcohol | Notas | Estado

**Dulces** — Opciones de dulce
- Columnas: ID | Nombre | Costo Unitario | Stock | Activo

**Alcohol** — Bebidas alcohólicas
- Columnas: ID | Nombre | Tipo | ml_Botella | Precio_Botella | Dosis_9oz_ml | Dosis_12oz_ml | Dosis_16oz_ml | Stock | Activo

**Jeringas** — Jeringas adicionales
- Columnas: ID | Tamaño (ml) | Precio | Costo | Stock | Activo

**Categorías** — Información de categorías
- Columnas: ID | Nombre | Descripción | Icono

**Configuración** — Parámetros del sistema
- Columnas: Clave | Valor | Descripción

## Funcionalidades Principales

### Sistema de Pedidos (pedidos.html)

1. **Seleccionar Tamaño**
   - 3 opciones: 9oz, 12oz, 16oz
   - Precios mostrados dinámicamente

2. **Elegir Tipo de Bebida**
   - Sin Alcohol (defecto)
   - Con Alcohol (muestra opciones)

3. **Seleccionar Alcohol**
   - Bodka Absolute
   - Four Loko
   - Ambos al mismo precio de granizado

4. **Elegir Dulce**
   - Obligatorio
   - 5 opciones disponibles
   - Una unidad por granizado

5. **Jeringas Adicionales (Opcional)**
   - 5ml - $2,000
   - 10ml - $3,000
   - Cantidad ilimitada

6. **Carrito de Pedido**
   - Vista en tiempo real
   - Muestra: tamaño, alcohol, dulce, jeringas, notas, precio
   - Botón para quitar items
   - Total actualizado

### Pantalla de Cobro (Modal)

1. **Mostrar Total a Pagar**
   - Número grande y visible
   - En COP

2. **Botones de Billetes Rápidos**
   - $2,000, $5,000, $10,000, $20,000, $50,000, $100,000

3. **Entrada Manual**
   - Campo para cantidad personalizada
   - Validación de número

4. **Cálculo de Cambio**
   - Automático al seleccionar billete
   - Muestra: recibido, total, cambio
   - Código de color: verde si hay cambio, rojo si es insuficiente

5. **Guardar Pedido**
   - Botón confirmación
   - Guarda en Google Sheets
   - Limpiar carrito después de guardar

## Flujo de Uso

1. **Operario abre pedidos.html**
2. **Selecciona tamaño** (9oz, 12oz, 16oz)
3. **Elige tipo de bebida** (con/sin alcohol)
4. **Si es con alcohol**, selecciona cuál
5. **Elige dulce** (obligatorio)
6. **Opcionalmente agrega jeringas** (5ml o 10ml)
7. **Opcionalmente agrega notas**
8. **Presiona "AGREGAR AL CARRITO"**
9. **Repite pasos 2-8 si hay más items**
10. **Presiona "COBRAR"**
11. **Selecciona billete o ingresa cantidad**
12. **Sistema calcula cambio automáticamente**
13. **Presiona "GUARDAR PEDIDO"**
14. **Pedido se guarda en Google Sheets**

## Costos y Márgenes

### Cálculo de Costos Base

**Costo por granizado (sin alcohol, con dulce incluido):**
- 9oz: $1,458 (vaso $340 + pitillo $100 + luz $937 + frunas $81)
- 12oz: $1,498
- 16oz: $1,538

**Con alcohol:**
- Bodka 5ml (9oz): +$542
- Bodka 10ml (12oz/16oz): +$1,084
- Four Loko 5ml (9oz): +$158
- Four Loko 10ml (12oz/16oz): +$316

**Márgenes aproximados:**
- Sin alcohol (9oz): ~$6,500 margen
- Con alcohol (9oz): ~$7,500-8,000 margen
- Mayor tamaño = mejor margen

## Mejoras Futuras Sugeridas

1. **Integración completa con Google Sheets**
   - Guardar pedidos automáticamente
   - Leer productos desde la BD
   - Sincronizar cambios en tiempo real

2. **Panel de Cocina**
   - Ver pedidos pendientes
   - Marcar como listos

3. **Reportes de Ventas**
   - Resumen del día
   - Por producto
   - Ganancias

4. **Historial de Pedidos**
   - Ver pedidos pasados
   - Filtrar por fecha/cliente

5. **Sistema de Clientes**
   - Cartera de clientes frecuentes
   - Descuentos personalizados

6. **Despliegue en Cloudflare**
   - Deploy automático desde GitHub
   - Dominio personalizado
   - SSL incluido

## Instrucciones de Desarrollo

### Cómo Ejecutar Localmente

```bash
# Opción 1: Servidor Python
python -m http.server 8000

# Opción 2: Servidor Node.js
npx serve

# Opción 3: Live Server (VS Code)
# Click derecho en pedidos.html > Open with Live Server
```

Luego abre en el navegador: `http://localhost:8000/pedidos.html`

### Configurar Google Apps Script

1. Abre tu Google Sheet
2. Ve a Extensiones → Apps Script
3. Copia el contenido de `google-apps-script.js`
4. Haz click en "Ejecutar" → "inicializarArtika"
5. Autoriza cuando pida permisos

### Personalizar Colores

Todos los colores están en variables CSS (`:root`):
- `--cyan: #00FFFF`
- `--magenta: #FF00FF`
- `--purple: #8B00FF`
- `--dark-bg: #0A0E27`

Edita estas variables en `sistema.css` para cambiar toda la paleta.

## Configuración de Precios

Para cambiar precios, edita en `google-apps-script.js` el array de `productos`:

```javascript
const productos = [
  ["G001", "Granizado 9oz", "Sin Alcohol", 9, 8000, 1458, true],
  //                                              ^^^^  ^^^^
  //                                           precio costo
];
```

O mejor aún, edita directamente en la hoja "Productos" de Google Sheets.

## Seguridad

- ✅ PIN para acceso (futuro)
- ✅ Validación de entrada
- ✅ Cálculos de cambio precisos
- ⚠️ NO guardar datos sensibles en cliente
- ⚠️ Usar HTTPS en producción

## Licencia

Este proyecto es propiedad de ARTIKA GRANIZADOS.

---

**Última actualización:** Agosto 2026  
**Versión:** 1.0.0 - Lanzamiento inicial  
**Estado:** En desarrollo - Sistema de pedidos funcional, integración con Google Sheets en progreso
