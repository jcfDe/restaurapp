
// ---------------------------------------------- FUNCIONES ADMIN -------------------------------------

function mostrarDatos() {
    let users = JSON.parse(localStorage.camarero);
    let rendimiento = document.getElementsByClassName("a_rendimiento")
    let username = users.map(element => element.nombre_camarero);
    let password = users.map(element => element.password);
    var placeholders_name = document.getElementsByClassName("userName");
    var placeholders_pass = document.getElementsByClassName("userPass");
    var mesas = JSON.parse(localStorage.mesa)

    var mesasAtendidas1 = []
    for (let i = 0; i < 10; i++) {
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero == 1) {
            mesasAtendidas1.push(mesas[i].numero)
        }
    }
    var mesasAtendidas2 = []
    for (let i = 0; i < 10; i++) {
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero == 2) {
            mesasAtendidas2.push(mesas[i].numero)
        }
    }
    var mesasAtendidas3 = []
    for (let i = 0; i < 10; i++) {
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero == 3) {
            mesasAtendidas3.push(mesas[i].numero)
        }
    }
    var mesasAtendidas4 = []
    for (let i = 0; i < 10; i++) {
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero == 4) {
            mesasAtendidas4.push(mesas[i].numero)
        }
    }

    for (let i = 0; i < placeholders_name.length; i++) {
        placeholders_name[i].value = username[i];
        placeholders_pass[i].value = password[i];

    }
    rendimiento[0].innerHTML = mesasAtendidas1;
    rendimiento[1].innerHTML = mesasAtendidas2;
    rendimiento[2].innerHTML = mesasAtendidas3;
    rendimiento[3].innerHTML = mesasAtendidas4;
}
function guardarCambios() {
    var placeholders_name = document.getElementsByClassName("userName");
    var placeholders_pass = document.getElementsByClassName("userPass");
    var names = [];
    var pass = [];
    let users = JSON.parse(localStorage.camarero);
    for (let i = 0; i < placeholders_name.length; i++) {
        names.push(placeholders_name[i].value);
        pass.push(placeholders_pass[i].value);
    };
    for (let k = 0; k < placeholders_name.length; k++) {
        users[k].nombre_camarero = names[k];
        users[k].password = pass[k];
    };
    localStorage.setItem("camarero", JSON.stringify(users))
}

function imprimirTicketModificacion() {
    let id_ticket = localStorage.ticketSeleccionado
    let ticketsLista = JSON.parse(localStorage.ticket);
    let ticket = ticketsLista.filter((element) => {
        if (element.id_ticket == id_ticket) {
            return element
        }
    });
    var comanda = ticket[0].comanda;
    var articulos = JSON.parse(localStorage.articulos)
    var ulBebidas = document.getElementById("m_dsp_bebidas");
    var ulComidas = document.getElementById("m_dsp_comidas");
    var ulPostres = document.getElementById("m_dsp_postres");
    //borro todos los li que habia en cada apartado para imprimir los nuevos valores
    while (ulBebidas.firstChild) {
        ulBebidas.removeChild(ulBebidas.lastChild);
    }
    while (ulComidas.firstChild) {
        ulComidas.removeChild(ulComidas.lastChild);
    }
    while (ulPostres.firstChild) {
        ulPostres.removeChild(ulPostres.lastChild);
    }
    for (let i = 0; i < comanda.length; i++) {
        if (comanda[i].cantidad > 0) {
            let li = document.createElement("li");
            let texto = document.createTextNode(articulos[i].nombre + ": " + comanda[i].cantidad);
            li.appendChild(texto);
            if (articulos[i].tipo == "bebida") {
                ulBebidas.appendChild(li)
            }
            if (articulos[i].tipo == "comida") {
                ulComidas.appendChild(li)
            }
            if (articulos[i].tipo == "postre") {
                ulPostres.appendChild(li)
            }
        }
    }
    var p_total = document.getElementById("t_total");
    p_total.innerText = `${ticket[0].total} €`;
    var p_camarero = document.getElementById("t_nombreCamarero");
    p_camarero.innerText = ticket[0].nombre_camarero;
    var p_id_ticket = document.getElementById("t_id_ticket");
    p_id_ticket.innerText = ticket[0].id_ticket;
    var p_fecha = document.getElementById("t_fecha");
    p_fecha.innerText = ticket[0].fecha;
    var p_id_mesa = document.getElementById("t_id_mesa");
    p_id_mesa.innerText = ticket[0].id_mesa + 1;
}

function modificarTicket() {
    let id_ticket = localStorage.ticketSeleccionado
    let ticketsLista = JSON.parse(localStorage.ticket);
    var index = ticketsLista.findIndex((item, i) => {
        return item.id_ticket == id_ticket
    });
    var displays = document.getElementsByClassName("m_display");
    var comanda = ticketsLista[index].comanda;
    for (let i = 0; i < displays.length; i++) {
        for (let j = 0; j < comanda.length; j++) {
            if (parseInt(displays[i].innerHTML) > 0 && comanda[j].id_articulo == displays[i].id) {
                comanda[j].cantidad = parseInt(comanda[j].cantidad) + parseInt(displays[i].innerHTML);
                displays[i].innerHTML = 0;
            }
            // Esta parte resta articulos a la comanda. Para corregir errores.
            if (parseInt(displays[i].innerHTML) < 0 && comanda[j].id_articulo == displays[i].id) {
                var confirmación = confirm("Estás a punto de realizar una modificación de la comanda guardada. ¿Deseas continuar?");
                if (confirmación) {
                    if (comanda[j].cantidad >= Math.abs(parseInt(displays[i].innerHTML))) {
                        comanda[j].cantidad = parseInt(comanda[j].cantidad) + parseInt(displays[i].innerHTML);
                        displays[i].innerHTML = 0;
                    } else { alert("No se pueden restar más articulos.") }
                }
            }
        }
    }
    ticketsLista[index].comanda = comanda;
    localStorage.setItem("ticket", JSON.stringify(ticketsLista));
    imprimirTicketModificacion();
}
function mostrarTickets(){
    let tickets = JSON.parse(localStorage.ticket);
    for (let i = 0; i < tickets.length; i++) {
            var idTicket = tickets[i].id_ticket
            var botonTicket = document.createElement('button');
            botonTicket.className = `c_ticket`;
            botonTicket.addEventListener('click', () => {
                consulta_ticket2(idTicket);
                window.location = "modificaTicket.html"
            })
            var id = document.createTextNode(`Fecha: ${tickets[i].fecha} | id: ${idTicket}`);
            botonTicket.appendChild(id);
            document.querySelector('#a_historial').appendChild(botonTicket);

        }
    }

function consulta_ticket2(id_ticket) {
    localStorage.setItem("ticketSeleccionado", id_ticket);
    window.location = "modificaTicket.html";
}






//---------------------------------------- GRAFICA RESULTADOS -------------------------------------------------------------------------------------
function cargarGraficos(num) {

    // DATOS -------------

    var tickets = JSON.parse(localStorage.ticket)
    var camareros = JSON.parse(localStorage.camarero)
    var total = [0]
    var total1 = [0]
    var total2 = [0]
    var total3 = [0]
    var total4 = [0]
    var mesas = 0, mesas1 = 0, mesas2 = 0, mesas3 = 0, mesas4 = 0;
    var sTotal = 0, sTotal1 = 0, sTotal2 = 0, sTotal3 = 0, sTotal4 = 0;
    if (tickets != null) {
        for (let i = 0; i < tickets.length; i++) {
            total.push(tickets[i].total)
            if (tickets[i].nombre_camarero == camareros[0].nombre_camarero) {
                total1.push(tickets[i].total)
            }
            if (tickets[i].nombre_camarero == camareros[1].nombre_camarero) {
                total2.push(tickets[i].total)
            }
            if (tickets[i].nombre_camarero == camareros[2].nombre_camarero) {
                total3.push(tickets[i].total)
            }
            if (tickets[i].nombre_camarero == camareros[3].nombre_camarero) {
                total4.push(tickets[i].total)
            }
        }
        mesas = total.length - 1
        mesas1 = total1.length - 1
        mesas2 = total2.length - 1
        mesas3 = total3.length - 1
        mesas4 = total4.length - 1
        sTotal = total.reduce(function (a, b) { return a + b });
        sTotal1 = total1.reduce(function (a, b) { return a + b });
        sTotal2 = total2.reduce(function (a, b) { return a + b });
        sTotal3 = total3.reduce(function (a, b) { return a + b });
        sTotal4 = total4.reduce(function (a, b) { return a + b });
    } else {
        document.getElementById('a_resultados').innerHTML = "No hay datos"
    }
    /*---- Config graficas ----*/
    const labels = [
        'total',
        camareros[0].nombre_camarero,
        camareros[1].nombre_camarero,
        camareros[2].nombre_camarero,
        camareros[3].nombre_camarero
    ];
    const DATA_COUNT = 4;
    const data = {
        labels: labels,
        datasets: [{
            label: 'Mesas servidas',
            backgroundColor: 'blcak',
            borderColor: 'blcak',
            data: [mesas, mesas1, mesas2, mesas3, mesas4]
        }]
    };

    const config = {
        type: 'bar',
        data: data, min: 0,
        options: {}
    };

    const labels1 = [
        'total',
        camareros[0].nombre_camarero,
        camareros[1].nombre_camarero,
        camareros[2].nombre_camarero,
        camareros[3].nombre_camarero
    ];
    const DATA_COUNT1 = 5;
    const data1 = {
        labels: labels1,
        datasets: [{
            label: 'Importe total',
            backgroundColor: 'black',
            borderColor: 'black',
            data: [sTotal, sTotal1, sTotal2, sTotal3, sTotal4]
        }]
    };

    const config1 = {
        type: 'bar',
        data: data1, min: 0,
        options: {}
    };

    switch (num) {
        case 0:
            document.getElementById('a_resultados').innerHTML = ""
            var canvas = document.createElement('canvas')
            canvas.setAttribute('id', 'myChart')
            document.getElementById('a_resultados').append(canvas)
            const myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            break;
        case 1:
            document.getElementById('a_resultados').innerHTML = ""
            var canvas = document.createElement('canvas')
            canvas.setAttribute('id', 'myChart1')
            document.getElementById('a_resultados').append(canvas)
            const myChart1 = new Chart(
                document.getElementById('myChart1'),
                config1
            );

    }

}