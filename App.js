// Elementos del HTML
const sopas = document.getElementById("sopas");
const platos = document.getElementById("platos");
const bebidas = document.getElementById("bebidas");
const postres = document.getElementById("postres");
const adicionales = document.getElementById("adicionales");

const detallePedido = document.getElementById("detallePedido");
const totalElemento = document.getElementById("total");
const listaPedidos = document.getElementById("listaPedidos");

// Cargar historial al iniciar
mostrarPedidosGuardados();

// Detectar cambios en los select
const selects = [
    sopas,
    platos,
    bebidas,
    postres,
    adicionales
];

selects.forEach(select => {
    select.addEventListener("change", actualizarResumen);
});

// Actualizar resumen automáticamente
function actualizarResumen() {

    let html = "";
    let total = 0;

    selects.forEach(select => {

    // Si seleccionó algo diferente a "Seleccione..."
       if (select.selectedIndex > 0) {
            const opcion = select.options[select.selectedIndex];
            const nombre = opcion.dataset.nombre;
            const precio = Number(opcion.value);
            let categoria = "";
            if (select.id === "sopas") categoria = "🍲 Sopa";
            if (select.id === "platos") categoria = "🍝 Plato Principal";
            if (select.id === "bebidas") categoria = "☕ Bebida";
            if (select.id === "postres") categoria = "🍨 Postre";
            if (select.id === "adicionales") categoria = "🥙 Adicional";
            html += `
                <strong>${categoria}:</strong> ${nombre}
                <span style="float:right">
                    $${precio.toLocaleString("es-CO")}
                </span>
                <br>
            `;
            total += precio;
        }
    });

    if (html === "") {
        detallePedido.innerHTML = "No hay productos seleccionados";
    } else {
        detallePedido.innerHTML = html;
    }
    totalElemento.textContent = total.toLocaleString("es-CO");
}

// Guardar pedidos
function guardarPedido() {

    if (
        sopas.selectedIndex === 0 &&
        platos.selectedIndex === 0 &&
        bebidas.selectedIndex === 0 &&
        postres.selectedIndex === 0 &&
        adicionales.selectedIndex === 0
    ) {
        alert("Seleccione al menos un producto.");
        return;
    }

    const pedido = {
        fecha: new Date().toLocaleString("es-CO"),
        sopa: sopas.selectedIndex > 0
            ? sopas.options[sopas.selectedIndex].dataset.nombre
            : null,
        plato: platos.selectedIndex > 0
            ? platos.options[platos.selectedIndex].dataset.nombre
            : null,
        bebida: bebidas.selectedIndex > 0
            ? bebidas.options[bebidas.selectedIndex].dataset.nombre
            : null,
        postre: postres.selectedIndex > 0
            ? postres.options[postres.selectedIndex].dataset.nombre
            : null,
        adicional: adicionales.selectedIndex > 0
            ? adicionales.options[adicionales.selectedIndex].dataset.nombre
            : null,
        total:
            Number(sopas.value || 0) +
            Number(platos.value || 0) +
            Number(bebidas.value || 0) +
            Number(postres.value || 0) +
            Number(adicionales.value || 0)
    };
    const pedidos =
        JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(pedido);
    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );
    mostrarPedidosGuardados();
}

document.getElementById("formPedido").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();
        guardarPedido();
        alert("Pedido enviado correctamente.");

        // Limpiar formulario
        document.getElementById("formPedido").reset();

        // Limpiar resumen
        detallePedido.innerHTML =
            "No hay productos seleccionados";
        totalElemento.textContent = "0";

        // Esperar 15 segundos antes de limpiar mensaje
        setTimeout(() => {
            const mensaje =
                document.getElementById("mensaje");
            if (mensaje) {
                mensaje.innerHTML = "";
            }
        }, 15000);
    }
);

// Mostrar pedidos
function mostrarPedidosGuardados() {
    const pedidos =
        JSON.parse(localStorage.getItem("pedidos")) || [];
    const listaPedidos =
        document.getElementById("listaPedidos");
    if (!listaPedidos) return;
    if (pedidos.length === 0) {
        listaPedidos.innerHTML =
            "No existen pedidos almacenados.";
        return;
    }

    let html = "";
    pedidos.forEach((pedido, index) => {

        html += `
            <div class="pedido-guardado">
                <p></p>
                <h3>Pedido ${index + 1}</h3>
                <strong>Fecha:</strong> ${pedido.fecha}<br>
                ${pedido.sopa ? `${pedido.sopa}<br>` : ""}
                ${pedido.plato ? `${pedido.plato}<br>` : ""}
                ${pedido.bebida ? `${pedido.bebida}<br>` : ""}
                ${pedido.postre ? `${pedido.postre}<br>` : ""}
                ${pedido.adicional ? `${pedido.adicional}<br>` : ""}
                <p>
                    <strong>Total:</strong>
                    $${pedido.total.toLocaleString("es-CO")}
                </p>
                 <button onclick="eliminarPedido(${index})">
                    🗑 Eliminar
                </button>
                <hr>
            </div>
        `;
    });
    listaPedidos.innerHTML = html;
}

// Eliminar un pedido
function eliminarPedido(indice) {
    let pedidos =
        JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.splice(indice, 1);
    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );
    mostrarPedidosGuardados();
}

// Borrar historial completo
function borrarHistorial() {
    if (!confirm("¿Desea eliminar todos los pedidos?")) {
        return;
    }
    localStorage.removeItem("pedidos");
    if (listaPedidos) {
        listaPedidos.innerHTML =
            "No existen pedidos almacenados.";
    }
}
