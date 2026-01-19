let claveAcceso = "123";
let precioSalida = 330800;

let intentos = 3;
let dineroDisponible = 35000;


let catalogoJuegos = ["Elden Ring","God of War Ragnarök - Aventura", "FIFA 26", "GTA VI"];


const pinInput = document.getElementById('pinInput')
const btnIngresar = document.getElementById('btnIngresar')
const login = document.getElementById("login");
const ingresarPin = document.getElementById('ingresarPin')
const menu = document.getElementById("menu");
const deposito = document.getElementById("deposito");
const resultado = document.getElementById("resultado");
const btnPrecio = document.getElementById("btnPrecio");
const btnComprar = document.getElementById("btnComprar");
const btnDeposito = document.getElementById("btnDeposito");
const montoDeposito = document.getElementById("montoDeposito");
const btnConfirmarDeposito = document.getElementById("btnConfirmarDeposito");
const btnCatalogo = document.getElementById("btnCatalogo");


btnIngresar.addEventListener('click', () => {
    if(pinInput.value == claveAcceso){
        resultado.innerHTML = 'Pin correcto';
        login.style.display = 'none';
        menu.style.display = 'block';
    } else {
        intentos--;
        resultado.innerHTML = 'Pin incorrecto, intentelo nuevamente. Intentos restantes:' + intentos;

        if (intentos == 0) {
            ingresarPin.innerHTML = 'Acceso bloqueado';
            pinInput.style.display = 'none';
            resultado.style.display = 'none';
            btnIngresar.style.display = 'none';
        }
    }
})



btnPrecio.addEventListener('click', () => {
    resultado.innerHTML = 'Precio de salida: $' + precioSalida +
    '<br>Saldo disponible: $' + dineroDisponible; 

})


btnComprar.addEventListener('click', () => {
    if (dineroDisponible < precioSalida) {
        resultado.innerHTML = 'No tienes saldo suficiente';
    } else {
        dineroDisponible -= precioSalida;
        resultado.innerHTML = 'Reserva realizada <br>Nuevo saldo: $' + dineroDisponible;
    }
})


btnDeposito.addEventListener('click', () => {
    deposito.style.display = 'block';
});


btnConfirmarDeposito.addEventListener('click', () => {
    let monto = Number(montoDeposito.value);

    if (monto > 0) {
        dineroDisponible += monto;
        resultado.innerHTML =
            'Deposito exitoso.<br>Saldo actual: $' + dineroDisponible;
        montoDeposito.value = '';
        deposito.style.display = 'none';
    } else {
        resultado.innerHTML = 'Monto inválido';
    }
});

btnCatalogo.addEventListener('click', () => {
    let html = '<h4>Catalogo disponible:</h4><ul>';

    for (let i = 0; i < catalogoJuegos.length; i++) {
        html += '<li>' + catalogoJuegos[i] + '</li>';
    }

    html += '</ul>';
    resultado.innerHTML = html;
});