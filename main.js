let claveAcceso = "1867";
let precioSalida = 330800;

let intentos = 3;
let dineroDisponible = 35000;


let catalogoJuegos = ["Elden Ring","God of War Ragnarök - Aventura", "FIFA 26", "GTA VI"];

function validarPIN() {
    alert("Bienvenido al sistema de reserva");

    for (let i = 1; i <= intentos; i++) {
        let pinIngresado = prompt("Ingrese su PIN:");

        if (pinIngresado === claveAcceso) {
            alert("PIN correcto. Bienvenido");
            return true;
        } else {
            alert("PIN incorrecto. Intento " + i + " de " + intentos);
        }
    }

    return false;   
}


function consultarPrecioEntrada() {
    alert("El precio de salida es: $" + precioSalida + "\nTu saldo disponible es de: $" + dineroDisponible);
    console.log("Precio y saldo consultado:", precioSalida, dineroDisponible);
}



function realizarCompra() {
    alert("El precio de reserva del juego es $" + precioSalida);

    if (dineroDisponible < precioSalida) {
        alert("No tienes suficiente dinero para realizar la compra.");
        return;
    } else {
        dineroDisponible -= precioSalida;
        alert("Reserva realizada con exito \nNuevo saldo: $" + dineroDisponible);
        console.log("Compra realizada. Saldo restante:", dineroDisponible);
    }
}

function realizarDeposito() {
    let monto = parseFloat(prompt("Ingrese el monto a depositar:"));
    
    if (monto <= 0) {
        alert("Monto inválido.");
        return;
    } else {
        dineroDisponible += monto;
        alert("Depósito exitoso. Nuevo saldo: $" + dineroDisponible);
        console.log("Depósito:", monto, "Saldo actual:", dineroDisponible);
    }
}


function verCatalogo() {
    let mensaje = "Catálogo de juegos disponibles:\n\n";

    for (let i = 0; i < catalogoJuegos.length; i++) {
        mensaje += catalogoJuegos[i] + "\n";
    }

    alert(mensaje);
    console.log("Catálogo mostrado:", catalogoJuegos);
}

function iniciarSistema() {
    if (validarPIN()) {
        let opcion = prompt(
            "Seleccione una opción:\n" +
            "1) Consultar precio de salida y saldo en cuenta\n" +
            "2) Realizar compra\n" +
            "3) Realizar deposito de dinero\n" +
            "4) Ver catalogo de juegos disponibles\n" +
            "5) Salir"
        );

        while (opcion != "5"){
            if (opcion == "1") {
                consultarPrecioEntrada();
            } 
            else if (opcion === "2") {
                realizarCompra();
            } 
            else if (opcion === "3") {
                realizarDeposito();
            } 
            else if (opcion === "4") {
                verCatalogo(); 
            } 
            else {
                alert("Opción inválida, intenta nuevamente.");
            }
            
            opcion = prompt(
                "Seleccione una opción:\n" +
                "1) Consultar precio de salida y saldo en cuenta\n" +
                "2) Realizar compra\n" +
                "3) Realizar deposito de dinero\n" +
                "4) Ver catalogo de juegos disponibles\n" +
                "5) Salir"
            );
        }
    } else{
        alert("Has superado los intentos permitidos. Comuníquese con el encargado del sistema.")

    }
}

iniciarSistema()