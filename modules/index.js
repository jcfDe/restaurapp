
//---------------------------------------- FUNCIONES INDEX ---------------------------------
//Funcion logIn de camareros y admin

function iniciarSesion() {
    let loginUser = document.getElementById("a_nombre").value;
    let loginPass = document.getElementById("password").value;
    let users = JSON.parse(localStorage.camarero);
    let username = users.map(element => element.nombre_camarero);
    let password = users.map(element => element.password);
    let id_camarero = users.map(element => element.id_camarero);
    if (loginUser == "admin" && loginPass == "nimda") {
        window.location = "admin.html"
    }
    else {
        loginok = false
        for (let i = 0; i < username.length; i++) {
            if (loginUser == username[i] && loginPass == password[i]) {
                localStorage.setItem("camareroActual", id_camarero[i]);
                loginok = true;
                window.location = "camarero.html";
            }
        }
        if (!loginok) {
            alert("Usuario y/o contraseña incorrecta")
        } 
    }
}


// Funcion para que el cliente pueda ver el ticket de su consumicion y pagarlo.

function imprimirTicket(id_ticket_entrada) {
    let tabla = document.getElementById("t_tabla");
    let ticketsLista = JSON.parse(localStorage.ticket);
    let ticket = ticketsLista.filter((element) => {
        if (element.id_ticket == id_ticket_entrada) {
            return element
        }
    })
    var comanda = ticket[0].comanda;
    var totalCuenta = ticket[0].total;
    
    //imprime cada uno de los artículos de la comanda que ha consumido, si la cantidad es 0 no se imprime el articulo.
    for (let i = 0; i < comanda.length; i++) {
        if (comanda[i].cantidad > 0) {
            var fila = document.createElement("tr");
            var articulo = document.createElement("td");
            var precio = document.createElement("td");
            var cant = document.createElement("td");
            var total = document.createElement("td");
            articulo.innerHTML = comanda[i].nombre_articulo;
            articulo.setAttribute("class", "t_articulos")
            precio.innerHTML = comanda[i].precio;
            cant.innerHTML = comanda[i].cantidad;
            total.innerHTML = comanda[i].cantidad * comanda[i].precio;
            fila.appendChild(articulo);
            fila.appendChild(cant);
            fila.appendChild(precio);
            fila.appendChild(total);
            tabla.appendChild(fila);
        }
    }
    var p_total = document.getElementById("t_total");
    p_total.innerText = `${totalCuenta} €`;
    var p_camarero = document.getElementById("t_nombreCamarero");
    p_camarero.innerText = ticket[0].nombre_camarero;
    var p_id_ticket = document.getElementById("t_id_ticket");
    p_id_ticket.innerText = ticket[0].id_ticket;
    var p_fecha = document.getElementById("t_fecha");
    p_fecha.innerText = ticket[0].fecha;
    var p_id_mesa = document.getElementById("t_id_mesa");
    p_id_mesa.innerText = parseInt(ticket[0].id_mesa) + 1;
}

//comprueba si el ticket está pagado y si no está pagado lo guarda en localStorage para usar ese parametro en las funciones de imprimir ticket en las otras paginas.
function consulta_ticket(id_ticket) {
    var tickets = JSON.parse(localStorage.ticket)
    var pagado = tickets[id_ticket].pagado;
    if (pagado) {
        alert("Esta cuenta está pagada. muchas gracias");
        window.location = "index.html"
    } else {
        localStorage.setItem("ticketSeleccionado", id_ticket);
        window.location = "ticket.html";
    }
}
