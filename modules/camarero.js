//---------------------------------- camarero ----------------------------------------------

//Baja datos de las mesas y camarero logueado - llama a la función que carga la info
function camareroIn() {
    var camareros = JSON.parse(localStorage.camarero);
    var camareroActual = parseInt(localStorage.getItem('camareroActual'));
    var mesas = JSON.parse(localStorage.mesa);
    document.getElementById('c_nombre').innerText = camareros[(camareroActual - 1)].nombre_camarero
    cargarMesas(camareroActual, mesas);
}


function borraMesas() {
    var mesasA = document.querySelector('.c_cpntainer1');
    var mesasC = document.querySelector('.c_cpntainer2');
    var mesasR = document.querySelector('.c_cpntainer3');
    borrarChild(mesasA);
    borrarChild(mesasC);
    borrarChild(mesasR);
}
//CARGA LA INFO EN EL HTML CAMARERO: MESAS ABIERTAS/OCUPADAS Y LIBRES
function cargarMesas(camareroActual, mesas) {
    //BORRA MESAS ANTERIORES PARA ACTUALIZAR
    borraMesas();
    for (let i = 0; i<mesas.length; i++) {
        //FILTRA MESAS ABIERTAS DEL CAMARERO Y LAS PINTA
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero == camareroActual) {
            var divMesa = document.createElement('button');
            divMesa.className = `c_mesasA`;
            divMesa.addEventListener('click', () => { enviaMesa(i); })
            var numero = document.createTextNode((mesas[i].numero));
            divMesa.appendChild(numero);
            document.querySelector('.c_cpntainer1').appendChild(divMesa);
        }

        //FILTRA MESAS DISPONIBLES Y LAS PINTA
        if (mesas[i].estado == 'cerrada') {
            var divMesa = document.createElement('button');
            divMesa.className = `c_mesasC`;
            divMesa.addEventListener('click', () => { checkMesa(i, camareroActual); })
            var numero = document.createTextNode((mesas[i].numero));
            divMesa.appendChild(numero);
            document.querySelector('.c_cpntainer2').appendChild(divMesa);
        }

        //FILTRA MESAS ABIERTAS DE OTROS CAMAREROS Y LAS PINTA
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero != camareroActual) {
            var divMesa = document.createElement('button');
            divMesa.className = `c_mesasR`;
            var numero = document.createTextNode(mesas[i].numero);
            divMesa.appendChild(numero);
            document.getElementsByClassName("c_cpntainer3")[0].appendChild(divMesa);
        }
    }
    historial();
}

//ENVÍA LA MESA A MESA.HTML
function checkMesa(indice, camareroActual) {
    var mesasArriba = JSON.parse(localStorage.mesa);
    mesasArriba[indice].estado = 'abierta';
    mesasArriba[indice].id_camarero = camareroActual;
    localStorage.setItem('mesa', JSON.stringify(mesasArriba));
    camareroIn();
    enviaMesa(indice)
}


function enviaMesa(indice) {
    localStorage.setItem('mesaActual', indice);
    window.location = "mesa.html"
}

//Muestra los tickets que se han producido por el camarero que tiene la sesion iniciada.
function historial() {
    var tickets = JSON.parse(localStorage.ticket);
    var camareros = JSON.parse(localStorage.camarero);
    var camareroActual = parseInt(localStorage.getItem("camareroActual"))

    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].nombre_camarero == camareros[camareroActual - 1].nombre_camarero) {
            var idTicket = tickets[i].id_ticket
            var botonTicket = document.createElement('button');
            botonTicket.className = `c_ticket`;
            botonTicket.addEventListener('click', () => {
                consulta_ticket(idTicket);
                window.location = "ticket.html"
            })
            var id = document.createTextNode(`Fecha: ${tickets[i].fecha} | id: ${idTicket}`);
            botonTicket.appendChild(id);
            document.querySelector('#c_historial').appendChild(botonTicket);

        }
    }
}

function borrarChild(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
