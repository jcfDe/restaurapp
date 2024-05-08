
class Ticket {
    constructor(id_ticket, fecha, id_mesa, nombre_camarero, comanda, total, pagado) {
        this.id_ticket = id_ticket;
        this.fecha = fecha;
        this.id_mesa = id_mesa;
        this.nombre_camarero = nombre_camarero;
        this.comanda = comanda;
        this.total = total;
        this.pagado = pagado;
    }
}


function mostrarComanda() {
    var mesaActual = localStorage.mesaActual;
    var mesas = JSON.parse(localStorage.mesa);
    var comanda = mesas[mesaActual].comanda;
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

    //creo nuevos li para mostrar los valores actuales:
    for (let i = 0; i < comanda.length; i++) {
        if (comanda[i].cantidad > 0) {
            let li = document.createElement("li");
            let texto = document.createTextNode(articulos[i].nombre + ": " + comanda[i].cantidad);
            li.appendChild(texto);
            if (articulos[i].tipo == "bebida") {
                ulBebidas.appendChild(li);
            }
            if (articulos[i].tipo == "comida") {
                ulComidas.appendChild(li);
            }
            if (articulos[i].tipo == "postre") {
                ulPostres.appendChild(li);
            }
        }
    }
}

//Poner número en el titulo de mesa
function cambiarTitulo() {
    var titulo = document.getElementById("m_titulo");
    var mesaActual = localStorage.mesaActual;
    titulo.innerText = `Mesa ${parseInt(mesaActual) + 1}`;
}

function mostrarArticulos() {
    //Aqui pongo los articulos en el menú desplegable
    var articulos = JSON.parse(localStorage.articulos)
    var div_bebidas = document.getElementById("m_bebidas");
    var div_comidas = document.getElementById("m_comidas");
    var div_postres = document.getElementById("m_postres");
    for (let i = 0; i < articulos.length; i++) {
        //creo una fila con los elementos que quiero mostrar
        var row = document.createElement("div");
        var texto = document.createElement("p");
        var menos = document.createElement("button");
        menos.innerHTML = "-";
        menos.setAttribute("onclick", `restar("${articulos[i].id_articulo}")`);
        menos.style.backgroundColor = "#e4685d";
        var display = document.createElement("p");
        display.setAttribute("class", "m_display");
        //Asigno al elemento P que muestra la cantidad de articulos la misma id que el articulo que imprime.
        display.setAttribute("id", `${articulos[i].id_articulo}`);
        display.innerHTML = 0;
        var mas = document.createElement("button");
        mas.setAttribute("onclick", `sumar("${articulos[i].id_articulo}")`);
        mas.innerHTML = "+";
        mas.style.backgroundColor = "#77b55a";
        var contenido = document.createTextNode(`${articulos[i].nombre}`);
        texto.appendChild(contenido);
        row.setAttribute("class", "m_filaDesplegable");
        row.appendChild(texto);
        row.appendChild(menos);
        row.appendChild(display);
        row.appendChild(mas);
        //Dependiendo del tipo de articulo se muestra en una u otra columna
        if (articulos[i].tipo == "bebida") {
            div_bebidas.appendChild(row);
        }
        if (articulos[i].tipo == "comida") {
            div_comidas.appendChild(row);
        }
        if (articulos[i].tipo == "postre") {
            div_postres.appendChild(row);

        }
    }
}

function sumar(id) {
    var displays = document.getElementsByClassName("m_display");
    let i = 0;
    while (id != displays[i].id) {
        i++;
    }
    var display = displays[i];
    var valorAnterior = parseInt(display.innerHTML)
    display.innerHTML = valorAnterior + 1;
}

function restar(id) {
    var displays = document.getElementsByClassName("m_display");
    let i = 0;
    while (id != displays[i].id) {
        i++;
    }
    var display = displays[i];
    var valorAnterior = parseInt(display.innerHTML);
    display.innerHTML = valorAnterior - 1;
}

//---------------------------- guardar comanda -----------------------

function guardarComanda() {
    var mesaActual = localStorage.mesaActual;
    var mesas = JSON.parse(localStorage.mesa);
    var displays = document.getElementsByClassName("m_display");
    var comanda = mesas[mesaActual].comanda;
    for (let i = 0; i < displays.length; i++) {
        for (let j = 0; j < comanda.length; j++) {
            if (parseInt(displays[i].innerHTML) > 0 && comanda[j].id_articulo == displays[i].id) {
                comanda[j].cantidad = parseInt(comanda[j].cantidad) + parseInt(displays[i].innerHTML);
                displays[i].innerHTML = 0;
            }

            // Esta parte resta articulos a la comanda. Para corregir en caso de haber tomado mal la comanda.
            if (parseInt(displays[i].innerHTML) < 0 && comanda[j].id_articulo == displays[i].id) {
                var confirmación = confirm("Estás a punto de realizar una modificación de la comanda guardada. ¿Deseas continuar?");
                if (confirmación) {
                    //compruebo que la cantidad que se va a restar es menor o igual a la que hay en la comanda
                    if (comanda[j].cantidad >= Math.abs(parseInt(displays[i].innerHTML))) {
                        comanda[j].cantidad = parseInt(comanda[j].cantidad) + parseInt(displays[i].innerHTML);
                        displays[i].innerHTML = 0;
                    } else { alert("No se pueden restar más articulos."); }
                }
            }
        }
    }
    mesas[mesaActual].comanda = comanda;
    localStorage.setItem("mesa", JSON.stringify(mesas));
    mostrarComanda();
}


//Cerrar Mesa
function cerrarMesa() {
    var fecha = new Date;
    console.log(fecha)
    var fechaticket = "";
    if (parseInt(fecha.getMinutes()) < 10) {
        fechaticket = `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}  ${fecha.getHours()}:0${fecha.getMinutes()}`;
    } else {
        fechaticket = `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}  ${fecha.getHours()}:${fecha.getMinutes()}`;
    }

    let users = JSON.parse(localStorage.camarero);
    let username = users.map(element => element.nombre_camarero);
    var camareroActual = localStorage.getItem("camareroActual");
    var camareroActualN = "";
    for (let i = 0; i < users.length; i++) {
        if (camareroActual == users[i].id_camarero){
            camareroActualN = username[i];
        }
    }
    var mesaActual = localStorage.mesaActual;
    var mesa = JSON.parse(localStorage.mesa);
    var ticketsLista = JSON.parse(localStorage.getItem("ticket"));
    var comanda = mesa[mesaActual].comanda;
    var total = 0;
    for (let i = 0; i < comanda.length; i++) {
        total += comanda[i].cantidad * comanda[i].precio;
    }
    var pagado = false;
    var inicioTicket = [];
    //crea un nuevo ticket en caso de que no haya en la lista de tickets. si hay tickets lo añade con .push()
    if (!ticketsLista) {
        var newTicket = new Ticket(0, fechaticket, mesaActual, camareroActualN, comanda, total, pagado);
        inicioTicket.push(newTicket);
        localStorage.setItem("ticket", JSON.stringify(inicioTicket));
    } else {
        var id_anterior = ticketsLista[ticketsLista.length - 1].id_ticket + 1;
        var newTicket = new Ticket(id_anterior, fechaticket, mesaActual, camareroActualN, comanda, total, pagado);
        ticketsLista.push(newTicket);
        localStorage.setItem("ticket", JSON.stringify(ticketsLista));
    }
    mesa[mesaActual].estado = 'cerrada';

    var comandaInit = [];
    var articulos = JSON.parse(localStorage.articulos)
    for (let i = 0; i < articulos.length; i++) {
        comandaInit.push(new Comanda(articulos[i].id_articulo, articulos[i].nombre, 0, articulos[i].precio))
    }
    mesa[mesaActual].comanda = comandaInit;
    localStorage.setItem('mesa', JSON.stringify(mesa));

// vuelve a la página de camarero y coloca la mesa como cerrada y las vuelve a guardar.
    window.location = 'camarero.html';
    let mesasAtendidas = JSON.parse(localStorage.camarero)[localStorage.camareroActual].mesasAtendidas;
    users[localStorage.camareroActual - 1].mesasAtendidas = mesasAtendidas + 1;
    localStorage.setItem("camarero", JSON.stringify(users));
}

