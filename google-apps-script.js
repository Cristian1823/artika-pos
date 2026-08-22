// ============================================
// VARIABLES GLOBALES
// ============================================
let _callbackId = 0;
const _callbacks = {};

// ============================================
// INICIALIZACIÓN
// ============================================
function inicializarArtika() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  crearHoja(ss, "Productos");
  crearHoja(ss, "Pedidos");
  crearHoja(ss, "Dulces");
  crearHoja(ss, "Alcohol");
  crearHoja(ss, "Jeringas");
  crearHoja(ss, "Categorías");
  crearHoja(ss, "Configuración");

  configurarProductos(ss);
  configurarPedidos(ss);
  configurarDulces(ss);
  configurarAlcohol(ss);
  configurarJeringas(ss);
  configurarCategorias(ss);
  configurarConfig(ss);

  SpreadsheetApp.getUi().alert("✅ ARTIKA inicializado correctamente\n\nHojas creadas:\n✓ Productos\n✓ Pedidos\n✓ Dulces\n✓ Alcohol\n✓ Jeringas\n✓ Categorías\n✓ Configuración");
}

// ============================================
// MANEJADOR PRINCIPAL (JSONP)
// ============================================
// ============================================
// FUNCIÓN AUXILIAR: FORMATO DE FECHA CONSISTENTE (YYYY-MM-DD)
// ============================================
function formatoFecha(fecha) {
  if (typeof fecha === 'string') return fecha;
  const d = new Date(fecha);
  const año = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;

  let response = {};

  try {
    switch(action) {
      case 'getProductos':
        response = getProductos();
        break;
      case 'getDulces':
        response = getDulces();
        break;
      case 'getAlcohol':
        response = getAlcohol();
        break;
      case 'getJeringas':
        response = getJeringas();
        break;
      case 'guardarPedido':
        response = guardarPedidoAPI(e.parameter);
        break;
      case 'getConfig':
        response = getConfigAPI(e.parameter.clave);
        break;
      case 'getPedidosHoy':
        response = getPedidosHoy();
        break;
      case 'getResumen':
        response = getResumen(e.parameter);
        break;
      case 'actualizarPedido':
        response = actualizarPedidoAPI(e.parameter);
        break;
      default:
        response = { error: 'Acción no reconocida' };
    }
  } catch(err) {
    response = { error: err.toString() };
  }

  // Retornar JSONP
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(response) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function crearHoja(ss, nombre) {
  const sheet = ss.getSheetByName(nombre);
  if (!sheet) {
    ss.insertSheet(nombre);
  }
}

// ============================================
// CONFIGURAR PRODUCTOS
// ============================================
function configurarProductos(ss) {
  const sheet = ss.getSheetByName("Productos");
  sheet.clear();

  const headers = ["ID", "Nombre", "Categoría", "Tamaño (oz)", "Precio", "Costo", "Activo"];
  sheet.appendRow(headers);

  const productos = [
    // SIN ALCOHOL
    ["G001", "Granizado 9oz", "Sin Alcohol", 9, 8000, 1458, true],
    ["G002", "Granizado 12oz", "Sin Alcohol", 12, 12500, 1498, true],
    ["G003", "Granizado 16oz", "Sin Alcohol", 16, 17000, 1538, true],

    // CON ALCOHOL
    ["G004", "Granizado 9oz + Alcohol", "Con Alcohol", 9, 9000, 2000, true],
    ["G005", "Granizado 12oz + Alcohol", "Con Alcohol", 12, 15000, 2582, true],
    ["G006", "Granizado 16oz + Alcohol", "Con Alcohol", 16, 20000, 2622, true],
  ];

  productos.forEach(p => sheet.appendRow(p));

  // Formatear header
  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground("#00FFFF").setFontColor("#000000").setFontWeight("bold");

  // Ancho de columnas
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 120);
}

// ============================================
// CONFIGURAR PEDIDOS
// ============================================
function configurarPedidos(ss) {
  const sheet = ss.getSheetByName("Pedidos");
  sheet.clear();

  const headers = ["ID", "Fecha", "Hora", "Items (JSON)", "Total", "Dulce", "Alcohol", "Notas", "Estado"];
  sheet.appendRow(headers);

  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground("#FF00FF").setFontColor("#FFFFFF").setFontWeight("bold");

  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 80);
  sheet.setColumnWidth(4, 300);
}

// ============================================
// CONFIGURAR DULCES
// ============================================
function configurarDulces(ss) {
  const sheet = ss.getSheetByName("Dulces");
  sheet.clear();

  const headers = ["ID", "Nombre", "Costo Unitario", "Stock", "Activo"];
  sheet.appendRow(headers);

  const dulces = [
    ["D001", "Frunas", 81, 100, true],
    ["D002", "Cables de Dulce", 255, 60, true],
    ["D003", "Chupos de Dulce", 233, 30, true],
    ["D004", "Oka Loca", 575, 24, true],
    ["D005", "Corazones de Dulce", 110, 50, true],
  ];

  dulces.forEach(d => sheet.appendRow(d));

  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground("#8B00FF").setFontColor("#FFFFFF").setFontWeight("bold");

  sheet.setColumnWidth(2, 200);
}

// ============================================
// CONFIGURAR ALCOHOL
// ============================================
function configurarAlcohol(ss) {
  const sheet = ss.getSheetByName("Alcohol");
  sheet.clear();

  const headers = ["ID", "Nombre", "Tipo", "ml_Botella", "Precio_Botella", "Dosis_9oz_ml", "Dosis_12oz_ml", "Dosis_16oz_ml", "Stock", "Activo"];
  sheet.appendRow(headers);

  const alcohol = [
    ["A001", "Bodka Absolute", "Vodka", 700, 75900, 5, 10, 10, 1, true],
    ["A002", "Four Loko", "Bebida Energética", 473, 14950, 5, 10, 10, 1, true],
  ];

  alcohol.forEach(a => sheet.appendRow(a));

  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground("#00FFFF").setFontColor("#000000").setFontWeight("bold");

  sheet.setColumnWidth(2, 200);
}

// ============================================
// CONFIGURAR JERINGAS
// ============================================
function configurarJeringas(ss) {
  const sheet = ss.getSheetByName("Jeringas");
  sheet.clear();

  const headers = ["ID", "Tamaño (ml)", "Precio", "Costo", "Stock", "Activo"];
  sheet.appendRow(headers);

  const jeringas = [
    ["J001", 5, 2000, 50, 100, true],
    ["J002", 10, 3000, 100, 100, true],
  ];

  jeringas.forEach(j => sheet.appendRow(j));

  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground("#FF00FF").setFontColor("#FFFFFF").setFontWeight("bold");
}

// ============================================
// CONFIGURAR CATEGORÍAS
// ============================================
function configurarCategorias(ss) {
  const sheet = ss.getSheetByName("Categorías");
  sheet.clear();

  const headers = ["ID", "Nombre", "Descripción", "Icono"];
  sheet.appendRow(headers);

  const categorias = [
    ["C001", "Sin Alcohol", "Granizados sin bebida alcohólica", "❄️"],
    ["C002", "Con Alcohol", "Granizados con bebida alcohólica", "🍹"],
    ["C003", "Dulces", "Opciones de dulce", "🍬"],
    ["C004", "Jeringas", "Jeringas de alcohol adicionales", "💉"],
  ];

  categorias.forEach(c => sheet.appendRow(c));

  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground("#8B00FF").setFontColor("#FFFFFF").setFontWeight("bold");

  sheet.setColumnWidth(2, 150);
}

// ============================================
// CONFIGURAR CONFIGURACIÓN
// ============================================
function configurarConfig(ss) {
  const sheet = ss.getSheetByName("Configuración");
  sheet.clear();

  const headers = ["Clave", "Valor", "Descripción"];
  sheet.appendRow(headers);

  const config = [
    ["NOMBRE_NEGOCIO", "ARTIKA GRANIZADOS", "Nombre del negocio"],
    ["VERSION", "1.0.0", "Versión del sistema"],
    ["COSTO_LUZ_DIARIA", 75000, "Costo estimado de luz por día (COP)"],
    ["GRANIZADOS_ESTIMADOS_DIA", 80, "Cantidad estimada de granizados vendidos por día"],
    ["MONEDA", "COP", "Moneda utilizada"],
    ["PIN_COBRO", "1234", "PIN para acceder a la sección de cobro"],
    ["ESTADO_PEDIDO_DEFAULT", "pendiente", "Estado inicial de un nuevo pedido"],
    ["EMAIL_ADMIN", "camiloleon1823@gmail.com", "Email del administrador"],
  ];

  config.forEach(c => sheet.appendRow(c));

  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground("#00FFFF").setFontColor("#000000").setFontWeight("bold");

  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 300);
}

// ============================================
// API: GET PRODUCTOS
// ============================================
function getProductos() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Productos");
  const data = sheet.getDataRange().getValues();

  const productos = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][6] === true) {
      productos.push({
        id: data[i][0],
        nombre: data[i][1],
        categoria: data[i][2],
        tamaño: data[i][3],
        precio: data[i][4],
        costo: data[i][5]
      });
    }
  }

  return productos;
}

// ============================================
// API: GET DULCES
// ============================================
function getDulces() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dulces");
  const data = sheet.getDataRange().getValues();

  const dulces = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === true) {
      dulces.push({
        id: data[i][0],
        nombre: data[i][1],
        costo: data[i][2]
      });
    }
  }

  return dulces;
}

// ============================================
// API: GET ALCOHOL
// ============================================
function getAlcohol() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Alcohol");
  const data = sheet.getDataRange().getValues();

  const alcohol = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][9] === true) {
      alcohol.push({
        id: data[i][0],
        nombre: data[i][1],
        tipo: data[i][2],
        dosis_9oz: data[i][5],
        dosis_12oz: data[i][6],
        dosis_16oz: data[i][7]
      });
    }
  }

  return alcohol;
}

// ============================================
// API: GUARDAR PEDIDO
// ============================================
function guardarPedidoAPI(params) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Pedidos");
    const id = "PED-" + Date.now();
    const fecha = formatoFecha(new Date());
    const hora = new Date().toLocaleTimeString('es-CO');

    const items = decodeURIComponent(params.items);
    const total = parseInt(params.total);
    const dulce = params.dulce || "";
    const alcohol = params.alcohol || "";
    const notas = params.notas || "";
    const cambio = params.cambio || "";

    sheet.appendRow([
      id,
      fecha,
      hora,
      items,
      total,
      dulce,
      alcohol,
      `${notas} | Cambio: $${cambio}`,
      "pendiente"
    ]);

    return {
      success: true,
      id: id,
      mensaje: `✅ Pedido #${id} guardado exitosamente`
    };
  } catch(err) {
    return {
      success: false,
      error: err.toString()
    };
  }
}

// ============================================
// API: GET CONFIGURACIÓN
// ============================================
function getConfigAPI(clave) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Configuración");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === clave) {
      return {
        clave: data[i][0],
        valor: data[i][1]
      };
    }
  }

  return { error: "Configuración no encontrada" };
}

// ============================================
// API: GET PEDIDOS HOY
// ============================================
function getPedidosHoy() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Pedidos");
  const data = sheet.getDataRange().getValues();

  const pedidos = [];

  // Devolver todos los pedidos (sin filtrar por fecha)
  for (let i = 1; i < data.length; i++) {
    pedidos.push({
      id: data[i][0],
      fecha: data[i][1],
      hora: data[i][2],
      items: data[i][3],
      total: data[i][4],
      dulce: data[i][5],
      alcohol: data[i][6],
      notas: data[i][7],
      estado: data[i][8]
    });
  }

  return pedidos;
}

// ============================================
// API: GET RESUMEN (GANANCIAS)
// ============================================
function getResumen(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Pedidos");
  const data = sheet.getDataRange().getValues();

  let totalVentas = 0;
  let totalCosto = 0;
  let totalGastoOp = 75000;
  let cantidadPedidos = 0;
  const productosMap = {};

  const filtroFecha = params?.fecha; // Ej: "21/8/2026"
  const filtroFechaInicio = params?.fechaInicio;
  const filtroFechaFin = params?.fechaFin;

  // Procesar pedidos
  for (let i = 1; i < data.length; i++) {
    // Convertir fecha a string YYYY-MM-DD (Google Sheets la guarda como Date object)
    let fechaStr = "";
    const fechaData = data[i][1];
    if (fechaData instanceof Date) {
      const año = fechaData.getFullYear();
      const mes = String(fechaData.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaData.getDate()).padStart(2, '0');
      fechaStr = `${año}-${mes}-${dia}`;
    } else {
      fechaStr = String(fechaData).trim();
    }

    const total = parseInt(data[i][4]) || 0;

    // Filtrar por fecha si se proporciona
    let cumpleFiltro = true;
    if (filtroFecha) {
      // Comparar fechas en formato YYYY-MM-DD
      const filtroFechaTrim = String(filtroFecha).trim();
      cumpleFiltro = fechaStr === filtroFechaTrim;
    } else if (filtroFechaInicio && filtroFechaFin) {
      // Comparar fechas en formato YYYY-MM-DD
      const inicioStr = String(filtroFechaInicio).trim();
      const finStr = String(filtroFechaFin).trim();
      cumpleFiltro = fechaStr >= inicioStr && fechaStr <= finStr;
    }

    if (total > 0 && cumpleFiltro) {
      totalVentas += total;
      cantidadPedidos++;

      // Estimar costo (aproximado: 30% del total)
      const costoPedido = Math.round(total * 0.30);
      totalCosto += costoPedido;

      // Procesar items del pedido
      try {
        const items = JSON.parse(data[i][3]);
        if (Array.isArray(items)) {
          items.forEach(item => {
            const idProducto = item.idProducto || 'Desconocido';
            const tipoProducto = item.tipo || 'granizado';
            const precio = item.total || 0;

            if (!productosMap[idProducto]) {
              productosMap[idProducto] = {
                id: idProducto,
                nombre: item.tamaño ? `${item.tamaño} ${item.alcohol || ''}` : 'Jeringa',
                cantidad: 0,
                ingreso: 0,
                tipo: tipoProducto
              };
            }
            productosMap[idProducto].cantidad++;
            productosMap[idProducto].ingreso += precio;
          });
        }
      } catch(e) {
        // Error parseando JSON, ignorar
      }
    }
  }

  // Convertir a array y ordenar por cantidad vendida
  const productosArray = Object.values(productosMap)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10); // Top 10

  // Calcular costo estimado para cada producto
  productosArray.forEach(prod => {
    prod.costo = Math.round(prod.ingreso * 0.30);
  });

  // Calcular días en el período filtrado
  let diasPeriodo = 1; // Default
  if (filtroFecha) {
    diasPeriodo = 1;
  } else if (filtroFechaInicio && filtroFechaFin) {
    const inicio = new Date(filtroFechaInicio);
    const fin = new Date(filtroFechaFin);
    diasPeriodo = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
  } else {
    // Sin filtro = todo, estimar ~30 días
    diasPeriodo = 30;
  }

  // Prorratear luz según días
  const gastoLuzPeriodo = Math.round(75000 * diasPeriodo / 30);

  const gananciaNeta = totalVentas - totalCosto - gastoLuzPeriodo;
  const ticketPromedio = cantidadPedidos > 0 ? Math.round(totalVentas / cantidadPedidos) : 0;
  const margenPromedio = cantidadPedidos > 0 ? Math.round(gananciaNeta / cantidadPedidos) : 9500;

  return {
    totalVentas: totalVentas,
    totalCosto: totalCosto,
    totalGastoOp: gastoLuzPeriodo,
    gananciaNeta: gananciaNeta,
    cantidadPedidos: cantidadPedidos,
    ticketPromedio: ticketPromedio,
    margenPromedio: margenPromedio,
    diasPeriodo: diasPeriodo,
    productos: productosArray,
    debug: {
      filtroFecha: filtroFecha,
      filtroFechaInicio: filtroFechaInicio,
      filtroFechaFin: filtroFechaFin,
      totalFilas: data.length - 1,
      pedidosEncontrados: cantidadPedidos
    }
  };
}

// ============================================
// API: ACTUALIZAR PEDIDO
// ============================================
function actualizarPedidoAPI(params) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Pedidos");
    const data = sheet.getDataRange().getValues();

    const id = params.id;
    const notas = decodeURIComponent(params.notas || "");
    const estado = params.estado || "pendiente";

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.getRange(i + 1, 8).setValue(notas);
        sheet.getRange(i + 1, 9).setValue(estado);

        return {
          success: true,
          mensaje: "Pedido actualizado"
        };
      }
    }

    return {
      success: false,
      error: "Pedido no encontrado"
    };
  } catch(err) {
    return {
      success: false,
      error: err.toString()
    };
  }
}
