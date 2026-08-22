// ============================================
// CONFIGURACIÓN
// ============================================
const API_URL = `https://script.google.com/macros/s/AKfycbxRZPNJXwywxdLBAsmQH2DFOOuntZYsArqEjP6BwcrINw13BkoEpgXJEQv8XDydEx8A/exec`;
const PIN_CORRECTO = '1130';

// COSTOS DE PRODUCTOS (En COP)
const COSTOS = {
  'G001': 1458, // 9oz sin alcohol
  'G002': 1498, // 12oz sin alcohol
  'G003': 1538, // 16oz sin alcohol
  'G004': 2000, // 9oz con alcohol
  'G005': 2582, // 12oz con alcohol
  'G006': 2622, // 16oz con alcohol
  'J001': 50,   // 5ml jeringa
  'J002': 100   // 10ml jeringa
};

// DATOS LOCALES
let gananciasData = null;
let pinIngresado = '';
let filtroActual = {
  tipo: 'todo', // 'todo', 'hoy', 'ayer', '7dias', 'personalizado'
  fecha: null,
  fechaInicio: null,
  fechaFin: null
};

// Constantes
const MARGEN_PROMEDIO = 9500; // Margen estimado por granizado
const DIAS_OPERACION_SEMANA = 4; // Jueves a domingo
const SEMANAS_MES = 4.3;

// Función para formato consistente de fecha (YYYY-MM-DD)
function formatoFecha(fecha) {
  if (typeof fecha === 'string') return fecha;
  const d = new Date(fecha);
  const año = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔐 Panel de Ganancias cargado');
});

// ============================================
// NAVEGACIÓN DE PIN
// ============================================
function avanzarPin(input, fieldId) {
  if (input.value.length === 1) {
    // Pasar al siguiente campo
    const campos = document.querySelectorAll('.pin-digit');
    const indice = Array.from(campos).indexOf(input);
    if (indice < campos.length - 1) {
      campos[indice + 1].focus();
    }
  }
}

function verificarPin() {
  const pin1 = document.querySelectorAll('.pin-digit')[0].value;
  const pin2 = document.querySelectorAll('.pin-digit')[1].value;
  const pin3 = document.querySelectorAll('.pin-digit')[2].value;
  const pin4 = document.querySelectorAll('.pin-digit')[3].value;

  const pinIngresado = pin1 + pin2 + pin3 + pin4;

  if (pinIngresado === PIN_CORRECTO) {
    document.getElementById('pinScreen').style.display = 'none';
    document.getElementById('gainingsContent').style.display = 'block';
    cargarGanancias();
  } else {
    alert('❌ PIN incorrecto');
    limpiarPin();
  }
}

function limpiarPin() {
  document.querySelectorAll('.pin-digit').forEach(campo => {
    campo.value = '';
  });
  document.querySelectorAll('.pin-digit')[0].focus();
}

function salirGanancias() {
  window.location.href = 'pedidos.html';
}

// ============================================
// CARGAR GANANCIAS (CON FILTROS)
// ============================================
function cargarGanancias() {
  const callbackName = 'handleGanancias_' + Date.now();

  const params = {
    action: 'getResumen',
    callback: callbackName
  };

  // Agregar parámetros de filtro
  if (filtroActual.tipo === 'hoy' && filtroActual.fecha) {
    params.fecha = filtroActual.fecha;
  } else if (filtroActual.tipo === 'ayer' && filtroActual.fecha) {
    params.fecha = filtroActual.fecha;
  } else if (filtroActual.tipo === '7dias' && filtroActual.fechaInicio && filtroActual.fechaFin) {
    params.fechaInicio = filtroActual.fechaInicio;
    params.fechaFin = filtroActual.fechaFin;
  } else if (filtroActual.tipo === 'personalizado' && filtroActual.fechaInicio && filtroActual.fechaFin) {
    params.fechaInicio = filtroActual.fechaInicio;
    params.fechaFin = filtroActual.fechaFin;
  }

  const queryParts = [];
  for (const [k, v] of Object.entries(params)) {
    queryParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  }
  const queryString = queryParts.join('&');
  const url = API_URL + '?' + queryString;

  const script = document.createElement('script');
  script.src = url;

  window[callbackName] = function(response) {
    if (response && response.totalVentas !== undefined) {
      gananciasData = response;
      actualizarResumen();
      console.log('📊 Ganancias cargadas:', response);
    } else {
      console.error('Error cargando ganancias', response);
      alert('❌ Error al cargar ganancias');
    }

    document.body.removeChild(script);
    delete window[callbackName];
  };

  document.body.appendChild(script);
  console.log('📤 Cargando ganancias...');
}

// ============================================
// FUNCIONES DE FILTRO
// ============================================
function filtrarPorHoy() {
  filtroActual = { tipo: 'hoy', fecha: formatoFecha(new Date()) };
  document.getElementById('filtroActual').textContent = 'Mostrando: Hoy';
  document.getElementById('filterPersonalizado').style.display = 'none';
  cargarGanancias();
}

function filtrarPorAyer() {
  const ayer = new Date(Date.now() - 86400000);
  filtroActual = { tipo: 'ayer', fecha: formatoFecha(ayer) };
  document.getElementById('filtroActual').textContent = 'Mostrando: Ayer';
  document.getElementById('filterPersonalizado').style.display = 'none';
  cargarGanancias();
}

function filtrarPor7Dias() {
  const hoy = new Date();
  const hace7 = new Date(hoy.getTime() - 7 * 86400000);
  filtroActual = {
    tipo: '7dias',
    fechaInicio: formatoFecha(hace7),
    fechaFin: formatoFecha(hoy)
  };
  document.getElementById('filtroActual').textContent = 'Mostrando: Últimos 7 días';
  document.getElementById('filterPersonalizado').style.display = 'none';
  cargarGanancias();
}

function filtrarTodo() {
  filtroActual = { tipo: 'todo' };
  document.getElementById('filtroActual').textContent = 'Mostrando: Todo';
  document.getElementById('filterPersonalizado').style.display = 'none';
  cargarGanancias();
}

function mostrarFilterPersonalizado() {
  document.getElementById('filterPersonalizado').style.display = 'block';
  // Pre-llenar con hoy
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('fechaInicio').value = hoy;
  document.getElementById('fechaFin').value = hoy;
}

function filtrarPorIntervalo() {
  const inicio = document.getElementById('fechaInicio').value;
  const fin = document.getElementById('fechaFin').value;

  if (!inicio || !fin) {
    alert('❌ Selecciona ambas fechas');
    return;
  }

  if (new Date(inicio) > new Date(fin)) {
    alert('❌ La fecha de inicio no puede ser mayor a la fecha de fin');
    return;
  }

  // Convertir formato YYYY-MM-DD a DD/MM/YYYY (formato consistente)
  const inicioDate = new Date(inicio);
  const finDate = new Date(fin);

  filtroActual = {
    tipo: 'personalizado',
    fechaInicio: formatoFecha(inicioDate),
    fechaFin: formatoFecha(finDate)
  };

  document.getElementById('filtroActual').textContent = `Mostrando: ${filtroActual.fechaInicio} a ${filtroActual.fechaFin}`;
  cargarGanancias();
}

// ============================================
// ACTUALIZAR RESUMEN
// ============================================
function actualizarResumen() {
  if (!gananciasData) return;

  const totalVentas = gananciasData.totalVentas || 0;
  const totalCosto = gananciasData.totalCosto || 0;
  const totalGastoOp = gananciasData.totalGastoOp || 75000; // Luz prorratead
  const gananciaNeta = totalVentas - totalCosto - totalGastoOp;
  const cantidadPedidos = gananciasData.cantidadPedidos || 0;

  // Resumen simplificado y claro
  const cards = `
    <div class="summary-card" style="border-left: 4px solid #00FFFF; background: rgba(0, 255, 255, 0.15);">
      <div class="card-title">💵 VENDISTE</div>
      <div class="card-value" style="font-size: 1.4em;">$${totalVentas.toLocaleString('es-CO')}</div>
      <div style="color: #00FFFF; font-size: 0.8em; margin-top: 5px;">${cantidadPedidos} pedidos</div>
    </div>

    <div class="summary-card" style="border-left: 4px solid #ff6b35; background: rgba(255, 107, 53, 0.15);">
      <div class="card-title">📦 INSUMOS (30%)</div>
      <div class="card-value" style="font-size: 1.4em; color: #ff6b35;">-$${totalCosto.toLocaleString('es-CO')}</div>
      <div style="color: #ff6b35; font-size: 0.8em; margin-top: 5px;">Guarda para comprar</div>
    </div>

    <div class="summary-card" style="border-left: 4px solid #ff6b35; background: rgba(255, 107, 53, 0.15);">
      <div class="card-title">⚡ LUZ</div>
      <div class="card-value" style="font-size: 1.4em; color: #ff6b35;">-$${totalGastoOp.toLocaleString('es-CO')}</div>
      <div style="color: #ff6b35; font-size: 0.8em; margin-top: 5px;">$${Math.round(totalGastoOp / (DIAS_OPERACION_SEMANA * SEMANAS_MES)).toLocaleString('es-CO')}/día</div>
    </div>

    <div class="summary-card" style="border-left: 4px solid #00d4aa; background: rgba(0, 212, 170, 0.2);">
      <div class="card-title">💰 TU GANANCIA</div>
      <div class="card-value" style="font-size: 1.6em; color: #00d4aa;">$${gananciaNeta.toLocaleString('es-CO')}</div>
      <div style="color: #00d4aa; font-size: 0.8em; margin-top: 5px;">Para ti 💸</div>
    </div>
  `;

  document.getElementById('summaryCards').innerHTML = cards;

  // Productos vendidos
  actualizarProductos();
}

// ============================================
// CALCULAR PROYECCIÓN
// ============================================
function calcularProyeccion(granizadosPorDia) {
  if (!gananciasData) return;

  // Usar ticket promedio real del período, o valor por defecto
  let ticketPromedio = gananciasData.ticketPromedio || 12500;
  if (ticketPromedio <= 0) ticketPromedio = 12500;

  // DESGLOSE POR DÍA DE OPERACIÓN (lo que el operario retira cada día)
  const ventasUnDia = granizadosPorDia * ticketPromedio;
  const insumosUnDia = Math.round(ventasUnDia * 0.30); // 30% para insumos

  // Luz prorratead por día de operación (no por calendario)
  // $75.000 luz/mes ÷ 17 días de operación = ~$4.412/día
  const diasOperacionMes = DIAS_OPERACION_SEMANA * SEMANAS_MES; // ~17 días
  const gastoLuzDia = Math.round(75000 / diasOperacionMes); // Luz por día de apertura

  const gananciaDia = ventasUnDia - insumosUnDia - gastoLuzDia;

  // PROYECCIÓN MENSUAL
  const granizadosMes = granizadosPorDia * diasOperacionMes;
  const ventasMes = granizadosMes * ticketPromedio;
  const insumosmes = Math.round(ventasMes * 0.30);
  const gastoLuzMes = 75000; // Costo fijo de luz
  const gananciaNetaMes = ventasMes - insumosmes - gastoLuzMes;

  const colorGanancia = gananciaDia > 0 ? '#00d4aa' : '#ff6b35';
  const colorGananciaMes = gananciaNetaMes > 0 ? '#00d4aa' : '#ff6b35';

  const resultado = `
    <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid ${colorGanancia};">

      <!-- DESGLOSE PRÁCTICO POR DÍA -->
      <div style="margin-bottom: 15px; padding: 12px; background: rgba(0, 255, 255, 0.15); border-radius: 5px; border: 1px solid #00FFFF;">
        <div style="color: #00FFFF; font-weight: bold; margin-bottom: 10px; font-size: 0.95em;">📅 CADA DÍA QUE ABRES (Retira esto):</div>

        <div style="display: flex; justify-content: space-between; color: #FFFFFF; margin-bottom: 6px; font-size: 1em;">
          <span>Ventas del día:</span>
          <span style="font-weight: bold;">$${ventasUnDia.toLocaleString('es-CO')}</span>
        </div>

        <div style="display: flex; justify-content: space-between; color: #ff6b35; margin-bottom: 4px; font-size: 0.9em;">
          <span>→ Guarda insumos (30%):</span>
          <span>$${insumosUnDia.toLocaleString('es-CO')}</span>
        </div>

        <div style="display: flex; justify-content: space-between; color: #ff6b35; margin-bottom: 8px; font-size: 0.9em;">
          <span>→ Guarda luz (${Math.round(diasOperacionMes)} días/mes):</span>
          <span>$${gastoLuzDia.toLocaleString('es-CO')}</span>
        </div>

        <div style="border-top: 2px solid rgba(0, 255, 255, 0.3); padding-top: 8px; display: flex; justify-content: space-between; color: ${colorGanancia}; font-weight: bold; font-size: 1.05em;">
          <span>→ Tu ganancia del día:</span>
          <span>$${gananciaDia.toLocaleString('es-CO')}</span>
        </div>
      </div>

      <!-- PROYECCIÓN MENSUAL -->
      <div style="padding: 12px; background: rgba(255, 0, 255, 0.15); border-radius: 5px; border: 1px solid #FF00FF;">
        <div style="color: #FF00FF; font-weight: bold; margin-bottom: 10px; font-size: 0.95em;">📊 PROYECCIÓN MENSUAL (${DIAS_OPERACION_SEMANA} días/semana × ${SEMANAS_MES} semanas):</div>

        <div style="display: flex; justify-content: space-between; color: #FFFFFF; margin-bottom: 6px; font-size: 1em;">
          <span>${Math.round(granizadosMes)} granizados = Ventas:</span>
          <span style="font-weight: bold;">$${ventasMes.toLocaleString('es-CO')}</span>
        </div>

        <div style="display: flex; justify-content: space-between; color: #ff6b35; margin-bottom: 4px; font-size: 0.9em;">
          <span>→ Insumos (30% cada día):</span>
          <span>-$${insumosmes.toLocaleString('es-CO')}</span>
        </div>

        <div style="display: flex; justify-content: space-between; color: #ff6b35; margin-bottom: 8px; font-size: 0.9em;">
          <span>→ Luz ($${gastoLuzDia.toLocaleString('es-CO')}/día × ${Math.round(diasOperacionMes)} días):</span>
          <span>-$${gastoLuzMes.toLocaleString('es-CO')}</span>
        </div>

        <div style="border-top: 2px solid rgba(255, 0, 255, 0.3); padding-top: 8px; display: flex; justify-content: space-between; color: ${colorGananciaMes}; font-weight: bold; font-size: 1.05em;">
          <span>💰 GANANCIA MENSUAL:</span>
          <span>$${gananciaNetaMes.toLocaleString('es-CO')}</span>
        </div>
      </div>

    </div>
  `;

  document.getElementById('resultadoProyeccion').innerHTML = resultado;
}

// ============================================
// ACTUALIZAR TABLA DE PRODUCTOS
// ============================================
function actualizarProductos() {
  if (!gananciasData || !gananciasData.productos || gananciasData.productos.length === 0) {
    document.getElementById('productsTable').innerHTML = '<div class="empty-cart">Sin productos en este período</div>';
    return;
  }

  const container = document.getElementById('productsTable');
  container.innerHTML = '';

  const productos = gananciasData.productos; // Ya vienen ordenados y limitados

  productos.forEach((prod, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    const nombre = prod.nombre || prod.id || 'Producto desconocido';
    const cantidad = prod.cantidad || 0;
    const ingreso = prod.ingreso || 0;
    const costo = prod.costo || 0;
    const ganancia = ingreso - costo;

    const medallaEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📦';

    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${medallaEmoji} ${nombre}</div>
        <div class="cart-item-details">
          Vendidas: <strong>${cantidad}</strong> | Ingreso: $${ingreso.toLocaleString('es-CO')}
        </div>
      </div>
      <div>
        <div class="cart-item-price" style="color: #00d4aa;">💰 $${ganancia.toLocaleString('es-CO')}</div>
      </div>
    `;

    container.appendChild(itemDiv);
  });
}

// ============================================
// ESTILOS ADICIONALES
// ============================================
const style = document.createElement('style');
style.textContent = `
.pin-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 39, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.pin-container {
  background: linear-gradient(135deg, #8B00FF 0%, #FF00FF 100%);
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 0 40px rgba(255, 0, 255, 0.4);
  max-width: 400px;
  width: 90%;
}

.pin-container h2 {
  color: #0A0E27;
  margin-bottom: 10px;
  font-size: 1.8em;
}

.pin-container p {
  color: rgba(10, 14, 39, 0.8);
  margin-bottom: 30px;
}

.pin-input-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 25px;
}

.pin-digit {
  width: 60px;
  height: 60px;
  font-size: 2em;
  text-align: center;
  border: 3px solid #0A0E27;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  font-weight: bold;
}

.pin-digit::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.pin-digit:focus {
  outline: none;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

.summary-card {
  background: rgba(0, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #00FFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  color: #FFFFFF;
  font-weight: bold;
}

.card-value {
  font-size: 1.2em;
  font-weight: bold;
  color: #00FFFF;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}
`;

document.head.appendChild(style);
