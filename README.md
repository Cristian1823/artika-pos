# ARTIKA - Sistema de Punto de Venta para Granizados

Sistema web completo de toma de pedidos para **ARTIKA GRANIZADOS**, un negocio especializado en granizados artesanales con y sin alcohol.

## 🎨 Características

### 📝 Módulo de Pedidos
- Selección de tamaño (9oz, 12oz, 16oz)
- Opción de con/sin alcohol
- Selección de dulce obligatoria
- Jeringas adicionales opcionales
- Carrito en tiempo real

### 💰 Módulo de Cobro
- Botones de billetes rápidos (COP)
- Entrada manual personalizada
- Cálculo automático de cambio
- Validación de pago suficiente

### 📊 Panel de Ganancias
- Resumen diario de ventas
- Filtros de fecha (Hoy, Ayer, 7 días, Intervalo personalizado)
- Análisis de productos más vendidos
- Desglose de insumos, luz y ganancia neta
- Calculador de proyecciones

## 🎯 Precios Base (COP)

### Sin Alcohol
- 9oz: $8,000
- 12oz: $12,500
- 16oz: $17,000

### Con Alcohol
- 9oz: $9,000
- 12oz: $15,000
- 16oz: $20,000

### Adicionales
- Jeringa 5ml: $2,000
- Jeringa 10ml: $3,000

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Google Apps Script
- **Base de Datos**: Google Sheets
- **Diseño**: Neon branding (Cyan, Magenta, Purple)

## 🚀 Instalación Local

### Opción 1: Python
```bash
python -m http.server 8000
```

### Opción 2: Node.js
```bash
npx serve
```

Luego abre: `http://localhost:8000/pedidos.html`

## ⚙️ Configuración Google Apps Script

1. Abre tu Google Sheet
2. Ve a **Extensiones → Apps Script**
3. Copia el contenido de `google-apps-script.js`
4. Haz click en **Ejecutar → inicializarArtika**
5. Autoriza cuando pida permisos

## 📋 Estructura de Archivos

```
artika-pos/
├── pedidos.html              # Interfaz de pedidos
├── cobro.html                # Interfaz de cobro
├── ganancias.html            # Dashboard de ganancias
├── sistema.js                # Lógica de pedidos
├── cobro.js                  # Lógica de cobro
├── ganancias.js              # Lógica de ganancias
├── sistema.css               # Estilos (Neon)
├── google-apps-script.js     # Backend (Google Apps Script)
├── CLAUDE.md                 # Documentación técnica
└── Imagenes/Logo.jpg         # Logo ARTIKA
```

## 🔐 Seguridad

- PIN protegido para panel de ganancias (PIN: 1130)
- Validación de entrada en todos los formularios
- Cálculos precisos de cambio

## 📈 Horario de Operación

- **Disponibilidad**: Jueves a Domingo
- **Horario**: 5:00 PM - 10:00 PM (5 horas)
- **Operación mensual**: ~17 días

## 💡 Análisis de Ganancias

Con 10 granizados/día:
- **Ganancia diaria**: ~$65.000
- **Ganancia mensual**: ~$1.100.000

El panel de ganancias calcula automáticamente basado en:
- Ventas reales
- Costo de insumos (30% estimado)
- Gasto de luz ($75.000/mes)
- Proyecciones mensuales

## 🔄 Flujo de Uso

1. **Operario abre `pedidos.html`**
2. **Selecciona tamaño y opciones**
3. **Agrega al carrito**
4. **Presiona "GUARDAR PEDIDO"**
5. **Va a `cobro.html` para cobrar**
6. **Visualiza ganancias en `ganancias.html`**

## 🚀 Deploy en Cloudflare Pages

Este proyecto está preparado para Cloudflare Pages:

1. Conecta tu repositorio GitHub en Cloudflare
2. Build command: (dejar vacío - es un sitio estático)
3. Output directory: `/`
4. Deploy automático en cada push a `main`

## 📞 Soporte

Para reportar issues o sugerencias, abre un issue en GitHub.

## 📄 Licencia

Propiedad de ARTIKA GRANIZADOS - Uso privado

---

**Última actualización**: Agosto 2026  
**Versión**: 1.0.0  
**Estado**: ✅ En producción
