let juegos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let usuarioLogueado = localStorage.getItem("usuarioActivo");
let dineroDisponible = parseFloat(localStorage.getItem("dineroDisponible")) || 35000; // valor inicial


let catalogoJuegos = [];
const authContainer = document.getElementById("authContainer");
const contenido = document.getElementById("contenido");
const usuarioInput = document.getElementById("usuario");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const catalogoContainer = document.getElementById("catalogo");
const carritoContainer = document.getElementById("carrito");
const filtroCategoria = document.getElementById("filtroCategoria");
const dineroSpan = document.getElementById("dineroDisponible");
const cargarSaldoBtn = document.getElementById("cargarSaldoBtn");
const comprarBtn = document.getElementById("comprarBtn");


// LOGIN
if (usuarioLogueado) {
    mostrarContenido();
}

registerBtn.addEventListener("click", () => {
    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    if (!usuario || !password) {
        // SweetAlert2: muestra error si algún campo está vacío
        Swal.fire("Error", "Completa todos los campos", "error");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.some(u => u.usuario === usuario);

    if (existe) {
        // SweetAlert2: muestra error si el usuario ya existe
        Swal.fire("Error", "El usuario ya existe", "error");
        return;
    }

    usuarios.push({ usuario, password });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // SweetAlert2: usuario registrado correctamente
    Swal.fire("Éxito", "Usuario registrado correctamente", "success");

    usuarioInput.value = "";
    passwordInput.value = "";
});


loginBtn.addEventListener("click", () => {
    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioValido = usuarios.find(
        u => u.usuario === usuario && u.password === password
    );

    if (!usuarioValido) {
        // SweetAlert2: error al loguearse
        Swal.fire("Error", "Usuario o contraseña incorrectos", "error");
        return;
    }

    localStorage.setItem("usuarioActivo", usuario);
    mostrarContenido();

    // Toastify: mensaje de bienvenida al usuario
    Toastify({
        text: "Bienvenido " + usuario,
        duration: 2000,
        gravity: "top",
        position: "right",
        backgroundColor: "green"
    }).showToast();
});


logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    location.reload();
});


function mostrarContenido() {
    authContainer.classList.add("hidden");
    contenido.classList.remove("hidden");
    cargarJuegos();
    actualizarDinero();
}

function cargarJuegos() {
    fetch("data/juegos.json")
        .then(res => res.json())
        .then(data => {
        juegos = data;
        generarCategorias();
        renderizarCatalogo(juegos);
        renderizarCarrito();
        });
}


function generarCategorias() {
    const categoriasUnicas = new Set(juegos.map(j => j.categoria));

    categoriasUnicas.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        filtroCategoria.appendChild(option);
    });
}


filtroCategoria.addEventListener("change", () => {
    if (filtroCategoria.value === "todos") {
        renderizarCatalogo(juegos);
    } else {
        const filtrados = juegos.filter(
        j => j.categoria === filtroCategoria.value
        );
        renderizarCatalogo(filtrados);
    }
});


function renderizarCatalogo(lista) {
    catalogoContainer.innerHTML = "";

    lista.forEach(juego => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${juego.nombre}</h3>
            
            <p>Categoría: ${juego.categoria}</p>
            <p>Precio: $${juego.precio}</p>
            <button>Agregar</button>
        `;

        card.querySelector("button").addEventListener("click", () => {
            agregarAlCarrito(juego.id);
        });

        catalogoContainer.appendChild(card);
    });
}


function actualizarDinero() {
    dineroSpan.textContent = dineroDisponible.toFixed(2);
}

cargarSaldoBtn.addEventListener("click", () => {

    //SweetAlert2: Menu para carga de dinero

    Swal.fire({
        title: 'Cargar Dinero',
        input: 'number',
        inputLabel: 'Ingresa el monto a cargar',
        inputAttributes: {min: 1},
        showCancelButton: true,
        confirmButtonText: 'Cargar'
    }).then(result => {
        if (result.isConfirmed) {
            const monto = parseFloat(result.value);
            if (isNaN(monto) || monto <= 0) {

                //SweetAlert2: Cantidad invalida
                Swal.fire("Error", "Monto inválido", "error");
                return;
            }
            dineroDisponible += monto;
            localStorage.setItem("dineroDisponible", dineroDisponible);
            actualizarDinero();

            // Toastify: carga completa
            Toastify({
                text: `Se cargaron $${monto} correctamente`,
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "green"
            }).showToast();
        }
    });
});


function agregarAlCarrito(id) {
    const existe = carrito.some(j => j.id === id);

    if (existe) {
        // Toastify: aviso que el juego ya está en el carrito
        Toastify({
            text: "Ya está en el carrito",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "orange"
        }).showToast();
        return;
    }

    const juego = juegos.find(j => j.id === id);
    carrito.push(juego);
    guardarCarrito();
    renderizarCarrito();

    // Toastify: juego agregado al carrito
    Toastify({
        text: "Juego agregado",
        duration: 2000,
        gravity: "top",
        position: "right",
        backgroundColor: "green"
    }).showToast();
}


function renderizarCarrito() {
  carritoContainer.innerHTML = "";

  carrito.forEach(juego => {
        const div = document.createElement("div");

        div.innerHTML = `
            ${juego.nombre} - $${juego.precio}
            <button>Eliminar</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            eliminarDelCarrito(juego.id);
        });

        carritoContainer.appendChild(div);
    });

    const total = carrito.reduce((acc, j) => acc + j.precio, 0);

    const totalDiv = document.createElement("h3");
    totalDiv.textContent = "Total: $" + total;
    carritoContainer.appendChild(totalDiv);
}


function eliminarDelCarrito(id) {

    // SweetAlert2: confirmar eliminar juego
    Swal.fire({
        title: "¿Eliminar juego?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar"
    }).then(result => {
        if (result.isConfirmed) {
            carrito = carrito.filter(j => j.id !== id);
            guardarCarrito();
            renderizarCarrito();

            // Toastify: juego eliminado
            Toastify({
                text: "Juego eliminado",
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "red"
            }).showToast();
        }
    });
}


function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


comprarBtn.addEventListener("click", () => {
    if (carrito.length === 0) {
        // SweetAlert2: carrito vacío
        Swal.fire("Carrito vacío", "Agrega juegos antes de comprar", "info");
        return;
    }

    const total = carrito.reduce((acc, j) => acc + j.precio, 0);

    if (dineroDisponible < total) {
        // SweetAlert2: saldo insuficiente
        Swal.fire("Saldo insuficiente", "No tienes dinero suficiente para comprar", "error");
        return;
    }
    // SweetAlert2: confirmar compra
    Swal.fire({
        title: "Confirmar compra",
        text: `Total: $${total.toFixed(2)}. ¿Deseas comprar estos juegos?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Comprar"
    }).then(result => {
        if (result.isConfirmed) {
            dineroDisponible -= total;
            localStorage.setItem("dineroDisponible", dineroDisponible);
            actualizarDinero();
            carrito = [];
            guardarCarrito();
            renderizarCarrito();

            // Toastify: compra realizada con éxito
            Toastify({
                text: "Compra realizada con éxito",
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "green"
            }).showToast();
        }
    });
});