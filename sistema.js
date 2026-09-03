// ============================================
// CONFIGURACIÓN
// ============================================
const API_URL = `https://script.google.com/macros/s/AKfycbxRZPNJXwywxdLBAsmQH2DFOOuntZYsArqEjP6BwcrINw13BkoEpgXJEQv8XDydEx8A/exec`;

// DATOS LOCALES
let carrito = [];
let guardandoPedido = false;
let descuentoSeleccionado = 0;

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎉 ARTIKA Sistema de Pedidos cargado');
});

// ============================================
// FUNCIONES DE DESCUENTO
// ============================================
function seleccionarDescuento(porcentaje) {
  descuentoSeleccionado = porcentaje;

  // Actualizar UI
  document.querySelectorAll('[id^="desc-"]').forEach(btn => btn.style.background = '');
  document.querySelectorAll('[id^="desc-"]').forEach(btn => btn.style.color = '');

  const btnSeleccionado = document.getElementById(`desc-${porcentaje}`);
  if (btnSeleccionado) {
    btnSeleccionado.style.background = '#00d4aa';
    btnSeleccionado.style.color = '#0A0E27';
  }

  document.getElementById('descuentoActual').textContent = `Descuento actual: ${porcentaje}%`;
  console.log(`💰 Descuento seleccionado: ${porcentaje}%`);
}

function obtenerDescuentoSeleccionado() {
  return descuentoSeleccionado;
}

// ============================================
// AGREGAR AL CARRITO (AUTOMÁTICO)
// ============================================
function agregarAlCarrito(id, oz, conAlcohol, precio, descuento = 0) {
  const tipoAlcohol = conAlcohol ? '🍺 Con Alcohol' : '❄️ Sin Alcohol';

  const precioConDescuento = Math.round(precio * (1 - descuento / 100));
  const montoDescuento = precio - precioConDescuento;

  const item = {
    id: Date.now(),
    idProducto: id,
    tipo: 'granizado',
    tamaño: oz,
    conAlcohol: conAlcohol,
    alcohol: tipoAlcohol,
    precio: precio,
    descuento: descuento,
    montoDescuento: montoDescuento,
    total: precioConDescuento
  };

  carrito.push(item);
  actualizarCarrito();

  console.log(`✅ Item agregado: ${oz} ${tipoAlcohol} - $${precio} (Descuento: ${descuento}%)`, item);
}

// ============================================
// AGREGAR JERINGA
// ============================================
function agregarJeringa(id, tamaño, precio) {
  const item = {
    id: Date.now(),
    idProducto: id,
    tipo: 'jeringa',
    tamaño: tamaño,
    precio: precio,
    total: precio
  };

  carrito.push(item);
  actualizarCarrito();

  console.log(`💉 Jeringa agregada al carrito: ${tamaño}ml - $${precio}`);
}

// ============================================
// ACTUALIZAR CARRITO UI
// ============================================
function actualizarCarrito() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';

  let subtotal = 0;
  let totalDescuentos = 0;

  carrito.forEach((item, index) => {
    subtotal += item.total;
    totalDescuentos += item.montoDescuento || 0;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    let itemHTML = '';
    let detalleDescuento = '';

    if (item.tipo === 'granizado') {
      if (item.descuento > 0) {
        detalleDescuento = `<div style="color: #00d4aa; font-size: 0.85em;">-${item.descuento}% DESCUENTO -$${item.montoDescuento.toLocaleString('es-CO')}</div>`;
      }

      itemHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.tamaño} ${item.alcohol}</div>
          <div class="cart-item-details">
            🍬 Incluye dulce
            ${item.descuento > 0 ? `<br>💰 Precio original: $${item.precio.toLocaleString('es-CO')}` : ''}
          </div>
          ${detalleDescuento}
        </div>
      `;
    } else if (item.tipo === 'jeringa') {
      itemHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">💉 Jeringa ${item.tamaño}ml</div>
        </div>
      `;
    }

    itemDiv.innerHTML = itemHTML + `
      <div>
        <div class="cart-item-price">$${item.total.toLocaleString('es-CO')}</div>
        <button class="btn-remove-item" onclick="quitarDelCarrito(${index})">✕</button>
      </div>
    `;

    cartItems.appendChild(itemDiv);
  });

  if (carrito.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Carrito vacío</div>';
  }

  document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
  document.getElementById('totalPrice').textContent = `$${subtotal.toLocaleString('es-CO')}`;
}

// ============================================
// QUITAR DEL CARRITO
// ============================================
function quitarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
  console.log('🗑️ Item removido del carrito');
}

// ============================================
// LIMPIAR CARRITO
// ============================================
function limpiarCarrito() {
  if (carrito.length === 0) {
    alert('❌ El carrito está vacío');
    return;
  }

  if (confirm('¿Estás seguro de que quieres limpiar el carrito?')) {
    carrito = [];
    actualizarCarrito();
    console.log('🗑️ Carrito limpiado');
  }
}

// ============================================
// GUARDAR PEDIDO
// ============================================
function enviarACocina() {
  if (carrito.length === 0) {
    alert('❌ El carrito está vacío');
    return;
  }

  // Prevenir duplicados por mala conexión
  if (guardandoPedido) {
    alert('⏳ Por favor espera, el pedido se está procesando...');
    return;
  }

  guardandoPedido = true;
  const btnGuardar = document.querySelector('.btn-primary');
  if (btnGuardar) {
    btnGuardar.disabled = true;
    btnGuardar.style.opacity = '0.5';
    btnGuardar.textContent = '⏳ Guardando...';
  }

  console.log('🔄 Iniciando guardado de pedido...');
  console.log('API_URL:', API_URL);

  const total = carrito.reduce((sum, item) => sum + item.total, 0);
  const callbackName = 'handlePedido_' + Math.random().toString(36).substring(2, 11);

  const items = JSON.stringify(carrito);
  const jeringasCount = carrito.filter(i => i.tipo === 'jeringa').length;
  const jeringasInfo = jeringasCount > 0 ? `${jeringasCount} jeringa(s)` : 'Sin jeringas';

  // Calcular descuentos aplicados
  let montoDescuentoTotal = 0;
  let descuentoPromedio = 0;
  const itemsConDescuento = carrito.filter(i => i.descuento > 0);
  if (itemsConDescuento.length > 0) {
    montoDescuentoTotal = itemsConDescuento.reduce((sum, i) => sum + (i.montoDescuento || 0), 0);
    descuentoPromedio = itemsConDescuento[0].descuento;
  }

  try {
    const params = {
      action: 'guardarPedido',
      items: encodeURIComponent(items),
      total: total,
      dulce: 'Incluido en cada granizado',
      alcohol: carrito.some(i => i.tipo === 'granizado' && i.conAlcohol) ? 'Sí' : 'No',
      notas: encodeURIComponent(`${jeringasInfo} | Pendiente de cobro`),
      descuentoAplicado: descuentoPromedio,
      montoDescuento: montoDescuentoTotal,
      cambio: 0,
      callback: callbackName
    };

    const queryParts = [];
    for (const [k, v] of Object.entries(params)) {
      queryParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
    const queryString = queryParts.join('&');
    const url = API_URL + '?' + queryString;

    console.log('URL:', url);

    const script = document.createElement('script');
    script.src = url;
    script.timeout = 15000;

    script.onerror = function() {
      alert('❌ Error de conexión con el servidor. Verifica tu internet e intenta de nuevo.');
      console.error('Error en JSONP');
      guardandoPedido = false;
      resetearBotonGuardar(btnGuardar);
      document.body.removeChild(script);
    };

    window[callbackName] = function(response) {
      console.log('📩 Respuesta:', response);

      if (response && response.success) {
        alert(`✅ Pedido guardado\nID: ${response.id}\nTotal: $${total.toLocaleString('es-CO')}\n\nVe a COBRO para procesarlo`);

        carrito = [];
        actualizarCarrito();

        console.log('💾 Pedido guardado exitosamente', response);
      } else {
        alert(`❌ Error: ${response?.error || 'Error desconocido'}`);
        console.error('Error al guardar:', response);
      }

      guardandoPedido = false;
      resetearBotonGuardar(btnGuardar);
      document.body.removeChild(script);
      delete window[callbackName];
    };

    document.body.appendChild(script);

    console.log('📤 Guardando pedido...');
  } catch (err) {
    console.error('❌ Error:', err);
    alert('❌ Error al procesar el pedido: ' + err.message);
    guardandoPedido = false;
    resetearBotonGuardar(btnGuardar);
  }
}

function resetearBotonGuardar(btn) {
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent = '💾 GUARDAR PEDIDO';
  }
}


// ============================================
// CARGAR PRODUCTOS
// ============================================
function cargarProductos() {
  console.log('📦 Productos cargados');
}
