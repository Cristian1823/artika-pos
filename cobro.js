// ============================================
// CONFIGURACIÓN
// ============================================
const API_URL = `https://script.google.com/macros/s/AKfycbxRZPNJXwywxdLBAsmQH2DFOOuntZYsArqEjP6BwcrINw13BkoEpgXJEQv8XDydEx8A/exec`;

// DATOS LOCALES
let pedidos = [];
let pedidoEnCobro = null;

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎉 ARTIKA - Panel de Cobro cargado');
  cargarPedidos();
});

// ============================================
// CARGAR PEDIDOS PENDIENTES
// ============================================
function cargarPedidos() {
  const callbackName = 'handlePedidos_' + Date.now();

  const url = API_URL + '?action=getPedidosHoy&callback=' + callbackName;

  const script = document.createElement('script');
  script.src = url;

  window[callbackName] = function(response) {
    console.log('📦 Respuesta completa:', response);

    if (Array.isArray(response)) {
      // Filtrar solo pedidos sin cobrar (estado = pendiente)
      pedidos = response.filter(p => {
        const esPendiente = p.estado === 'pendiente' || p.estado === undefined;
        const noCobrado = !p.notas || !p.notas.includes('Cobrado');
        return esPendiente && noCobrado;
      });

      console.log('📦 Pedidos filtrados:', pedidos);
      actualizarPedidosList();
    } else {
      console.error('Error cargando pedidos', response);
      document.getElementById('pedidosList').innerHTML = '<div class="empty-cart">❌ Error al cargar pedidos</div>';
    }

    document.body.removeChild(script);
    delete window[callbackName];
  };

  document.body.appendChild(script);
  console.log('📤 Cargando pedidos...');
}

// ============================================
// ACTUALIZAR LISTA DE PEDIDOS
// ============================================
function actualizarPedidosList() {
  const container = document.getElementById('pedidosList');
  container.innerHTML = '';

  let totalPendiente = 0;

  if (pedidos.length === 0) {
    container.innerHTML = '<div class="empty-cart">✅ No hay pedidos pendientes</div>';
    document.getElementById('totalPendiente').textContent = '$0';
    return;
  }

  pedidos.forEach((pedido, index) => {
    totalPendiente += parseInt(pedido.total) || 0;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    const fecha = pedido.fecha || '-';
    const hora = pedido.hora || '-';
    const total = parseInt(pedido.total) || 0;

    // Decodificar y limpiar notas
    let notasLimpio = pedido.notas || '';
    try {
      notasLimpio = decodeURIComponent(notasLimpio);
    } catch(e) {
      // Si ya está decodificado, lo dejamos como está
    }

    // Extraer información de descuentos
    let descuentoInfo = '';
    let descuentoMatch = notasLimpio.match(/Descuento: (\d+)%\s*\(-\$([0-9,]+)\)/);
    if (descuentoMatch) {
      descuentoInfo = `<div style="color: #00d4aa; font-size: 0.85em; margin-top: 5px;">🏷️ ${descuentoMatch[1]}% OFF -$${descuentoMatch[2]}</div>`;
      // Remover descuento de notas para mostrar limpio
      notasLimpio = notasLimpio.replace(/\s*\|\s*Descuento: \d+%\s*\(-\$[0-9,]+\)/, '').trim();
    }

    // Remover "Cambio: $0" del final si existe
    notasLimpio = notasLimpio.replace(/\s*\|\s*Cambio:\s*\$\d+\s*$/, '').trim();

    const infoDiv = document.createElement('div');
    infoDiv.className = 'cart-item-info';
    infoDiv.style.cursor = 'pointer';
    infoDiv.style.flex = '1';
    infoDiv.onclick = () => abrirCobro(pedido);
    infoDiv.innerHTML = `
      <div class="cart-item-name">📋 ${pedido.id}</div>
      <div class="cart-item-details">
        🕐 ${fecha} - ${hora}<br>
        📝 ${notasLimpio}
      </div>
      ${descuentoInfo}
    `;

    const actionDiv = document.createElement('div');
    actionDiv.style.display = 'flex';
    actionDiv.style.gap = '10px';
    actionDiv.style.alignItems = 'center';

    const priceDiv = document.createElement('div');
    priceDiv.className = 'cart-item-price';
    priceDiv.textContent = `$${total.toLocaleString('es-CO')}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-remove-item';
    deleteBtn.textContent = '✕';
    deleteBtn.title = 'Eliminar este pedido';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      eliminarPedidoDuplicado(pedido.id);
    };

    actionDiv.appendChild(priceDiv);
    actionDiv.appendChild(deleteBtn);

    itemDiv.appendChild(infoDiv);
    itemDiv.appendChild(actionDiv);

    container.appendChild(itemDiv);
  });

  document.getElementById('totalPendiente').textContent = `$${totalPendiente.toLocaleString('es-CO')}`;
}

// ============================================
// ABRIR MODAL DE COBRO
// ============================================
function abrirCobro(pedido) {
  pedidoEnCobro = pedido;

  const total = parseInt(pedido.total) || 0;

  document.getElementById('pedidoID').textContent = pedido.id || '-';
  document.getElementById('totalAPagar').textContent = `$${total.toLocaleString('es-CO')}`;
  document.getElementById('resultadoCambio').style.display = 'none';
  document.getElementById('billetePerson').value = '';

  document.getElementById('cobroModal').style.display = 'flex';
  document.getElementById('cobroOverlay').style.display = 'block';

  console.log('💰 Modal de cobro abierto', pedido);
}

function cerrarCobro() {
  document.getElementById('cobroModal').style.display = 'none';
  document.getElementById('cobroOverlay').style.display = 'none';
  document.getElementById('resultadoCambio').style.display = 'none';
  pedidoEnCobro = null;
}

// ============================================
// CALCULAR CAMBIO
// ============================================
function calcularCambio(billete) {
  if (!pedidoEnCobro) return;

  const total = parseInt(pedidoEnCobro.total) || 0;
  const cambio = billete - total;

  mostrarResultadoCambio(billete, total, cambio);
}

function calcularCambioPersonalizado() {
  const billete = parseInt(document.getElementById('billetePerson').value);

  if (isNaN(billete) || billete <= 0) {
    alert('❌ Ingresa una cantidad válida');
    return;
  }

  if (!pedidoEnCobro) return;

  const total = parseInt(pedidoEnCobro.total) || 0;
  const cambio = billete - total;

  mostrarResultadoCambio(billete, total, cambio);
}

function mostrarResultadoCambio(billete, total, cambio) {
  document.getElementById('recibido').textContent = `$${billete.toLocaleString('es-CO')}`;
  document.getElementById('totalCambio').textContent = `$${total.toLocaleString('es-CO')}`;
  document.getElementById('cambio').textContent = `$${cambio.toLocaleString('es-CO')}`;

  const mensaje = document.getElementById('cambioMessage');
  const resultado = document.getElementById('resultadoCambio');

  if (cambio >= 0) {
    mensaje.className = 'cambio-message correcto';
    mensaje.textContent = '✅ Pago recibido correctamente';
  } else {
    mensaje.className = 'cambio-message insuficiente';
    mensaje.textContent = `❌ Falta: $${Math.abs(cambio).toLocaleString('es-CO')}`;
  }

  resultado.style.display = 'block';
}

// ============================================
// FINALIZAR COBRO
// ============================================
function finalizarCobro() {
  if (!pedidoEnCobro) {
    alert('❌ No hay pedido seleccionado');
    return;
  }

  const cambio = parseInt(document.getElementById('cambio').textContent.replace(/[^0-9]/g, '')) || 0;

  if (cambio < 0) {
    alert('❌ El pago es insuficiente');
    return;
  }

  // Marcar como cobrado en Google Sheets
  const callbackName = 'handleCobrado_' + Date.now();

  const notas = `${pedidoEnCobro.notas} | Cambio: $${cambio.toLocaleString('es-CO')} | Cobrado`;

  const params = {
    action: 'actualizarPedido',
    id: pedidoEnCobro.id,
    notas: encodeURIComponent(notas),
    estado: 'entregado',
    callback: callbackName
  };

  const queryString = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

  const url = API_URL + '?' + queryString;

  const script = document.createElement('script');
  script.src = url;

  window[callbackName] = function(response) {
    if (response.success) {
      alert(`✅ Pedido cobrado\nID: ${pedidoEnCobro.id}\nCambio: $${cambio.toLocaleString('es-CO')}`);

      cerrarCobro();
      cargarPedidos();

      console.log('💾 Pedido cobrado exitosamente');
    } else {
      alert(`❌ Error: ${response.error}`);
    }

    document.body.removeChild(script);
    delete window[callbackName];
  };

  document.body.appendChild(script);

  console.log('📤 Registrando cobro...');
}

// ============================================
// ELIMINAR PEDIDO DUPLICADO
// ============================================
function eliminarPedidoDuplicado(pedidoId) {
  if (!confirm(`¿Estás seguro de que quieres eliminar el pedido ${pedidoId}?\n\nEsta acción no se puede deshacer.`)) {
    return;
  }

  const callbackName = 'handleEliminar_' + Date.now();

  const params = {
    action: 'eliminarPedido',
    id: pedidoId,
    callback: callbackName
  };

  const queryString = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

  const url = API_URL + '?' + queryString;

  const script = document.createElement('script');
  script.src = url;

  window[callbackName] = function(response) {
    if (response.success) {
      alert(`✅ Pedido ${pedidoId} eliminado correctamente\n\nEl cálculo de ganancias se actualizará automáticamente`);
      cargarPedidos();
      console.log('🗑️ Pedido eliminado exitosamente');
    } else {
      alert(`❌ Error: ${response.error}`);
      console.error('Error al eliminar:', response);
    }

    document.body.removeChild(script);
    delete window[callbackName];
  };

  script.onerror = function() {
    alert('❌ Error de conexión al eliminar el pedido');
    document.body.removeChild(script);
  };

  document.body.appendChild(script);

  console.log('📤 Eliminando pedido...');
}
