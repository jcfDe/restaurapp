// ---------------------------------------PASARELA DE PAGO -----------------------------------

function cargarPago() {
    var ticketSeleccionado = localStorage.ticketSeleccionado;
    var tickets = JSON.parse(localStorage.ticket);
    var precio = tickets[ticketSeleccionado].total;
    var p_total = document.getElementById("p_total");
    p_total.innerText = precio + "€";
}

function checkPago() {
    var visa = document.getElementById("num_tarjeta").value;

    //expresion regular que comprueba el formato Visa y MasterCard
    var regexp = /^(?:4\d([\- ])?\d{6}\1\d{5}|(?:4\d{3}|5[1-5]\d{2}|6011)([\- ])?\d{4}\2\d{4}\2\d{4})$/;
    var validation = true;
    var validationCard = regexp.test(visa);
    var nombre = document.getElementById("nombre_tarjeta").value;
    var ticketSeleccionado = localStorage.ticketSeleccionado;
    var tikets = JSON.parse(localStorage.ticket);
    var pagado = tikets[ticketSeleccionado].pagado;
    if (pagado) {
        alert("Esta cuenta está pagada. muchas gracias");
        window.location = "index.html";
    }
    if (!nombre.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)) {
        alert("El nombre introducido no es válido.");
        validation = false;
    }
    var mes = document.getElementById("mes_tarjeta").value;
    var ano = document.getElementById("ano_tarjeta").value;
    if (mes.length != 2 && mes <= 12) {
        alert("El Mes debe estar escrito con dos cifras.");
        validation = false;
    }

    if (ano.length != 2 && ano >= 22) {
        alert("El Año debe estar escrito con dos cifras.");
        validation = false;
    }
    var cvv = document.getElementById("cvv").value
    if (cvv.length != 3) {
        alert("El CVV debe tener tres cifras");
        validation = false;
    }
    if (!validationCard) { alert("El número de tarjeta introducido no es Visa o Mastercard") }
    if (validation && validationCard) {
        alert("Operación finalizada con éxito.");
        window.location = "index.html";
        pagado = true;
    }
    tikets[ticketSeleccionado].pagado = pagado;
    localStorage.setItem("ticket", JSON.stringify(tikets));
}