class Comanda {
    constructor(id_articulo, nombre_articulo, cantidad, precio) {
        this.id_articulo = id_articulo;
        this.nombre_articulo = nombre_articulo;
        this.cantidad = cantidad;
        this.precio = precio;
    }
}
class Mesa {
    constructor(numero, estado, id_camarero, comanda) {
        this.numero = numero;
        this.estado = estado;
        this.id_camarero = id_camarero;
        this.comanda = comanda;
    }
}
class Articulo {
    constructor(id_articulo, tipo, nombre, precio) {
        this.id_articulo = id_articulo;
        this.tipo = tipo;
        this.nombre = nombre;
        this.precio = precio;
    }
}

//Inicializamos datos basicos para el restaurante: menu, mesa y camareros

function iniciar() {
    if (localStorage.length == 0) {
        var listaCamareros = [];
        for (let i = 1; i < 5; i++) {
            var camarero = {
                id_camarero: `${i}`,
                nombre_camarero: `camarero${i}`,
                password: "1234",
                mesasActuales: {},
                mesasAtendidas: 0
            }
            listaCamareros.push(camarero);
        }
        localStorage.setItem("camarero", JSON.stringify(listaCamareros));
        var articulos = [];

        var menu = {
            "id_articulo": ["a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19", "a20"],
            "tipo": ["bebida", "bebida", "bebida", "bebida", "bebida", "bebida", "bebida", "comida", "comida", "comida", "comida", "comida", "comida", "comida", "comida", "comida", "postre", "postre", "postre", "postre", "postre"],
            'nombre': ['Vino tinto', 'Vino blanco', 'Cerveza', 'Refresco', 'Zumo', 'Café', 'Café especial', 'Gazpacho', 'Ensalada mixta', 'Ensaladilla', 'Lasaña', 'Puré de verduras', 'Secreto ibérico', 'Escalope de pollo', 'Bacalao a la riojana', 'Hamburguesa', 'Tarta de queso', 'Fruta del tiempo', 'Flan de la casa', 'Tarta de la abuela', 'Varios'],
            'precio': [3, 3, 2.5, 2.5, 2.5, 1.5, 2, 4, 3.5, 3.5, 5, 3, 12, 8.5, 14, 9.5, 2, 3, 4, 5, 1]
        }

        //creacion de la lista de articulos
        for (let i = 0; i < menu.id_articulo.length; i++) {
            var articulo = new Articulo(menu.id_articulo[i], menu.tipo[i], menu.nombre[i], menu.precio[i]);
            articulos.push(articulo)
        }
        localStorage.setItem("articulos", JSON.stringify(articulos))

        //inicio una comanda inicial con todos los articulos en cada mesa para actualizarlos despues
        var comandaInit = [];
        for (let i = 0; i < articulos.length; i++) {
            comandaInit.push(new Comanda(articulos[i].id_articulo, articulos[i].nombre, 0, articulos[i].precio))
        }

        //creacion de la lista de 10 mesas
        var listaMesas = [];
        for (let i = 1; i < 11; i++) {
            var mesa = new Mesa(i, "cerrada", 0, comandaInit)
            listaMesas.push(mesa);
        }
        localStorage.setItem("mesa", JSON.stringify(listaMesas));
    }
}

//Funcion que busca en los articulos para despues modificarlo
function buscarArticulo() {
    var articulos = JSON.parse(localStorage.articulos);
    var nombre_articulo = document.getElementById("m_buscarArticulo").value
    for (let i = 0; i < articulos.length; i++) {
        if (nombre_articulo == articulos[i].nombre) {
            //creo los elementos html para mostrar los articulos que se han buscado
            var div = document.getElementById("muestra_articulos")
            var row = document.createElement("div")
            var p = document.createElement("p")
            var nombre_dsp = document.createElement("input")
            var precio_dsp = document.createElement("input")
            var tipo = document.createElement("select")
            var typebebida = document.createElement("option");
            var typecomida = document.createElement("option");
            var typepostre = document.createElement("option");
            var boton = document.createElement("button");

            //paso la id a la funcion para cambiar solo un articulo aunque haya mas con el mismo nombre.
            boton.setAttribute("onclick", `modificarArticulo("${articulos[i].id_articulo}")`);
            boton.innerHTML = "Modificar artículo";
            p.innerHTML = `Id Artículo: ${articulos[i].id_articulo}`;
            typebebida.value = "bebida";
            typebebida.innerText = "Bebida";
            typecomida.value = "comida";
            typecomida.innerText = "Comida";
            typepostre.value = "postre";
            typepostre.innerText = "Postre";
            tipo.appendChild(typebebida);
            tipo.appendChild(typecomida);
            tipo.appendChild(typepostre);
            tipo.value = articulos[i].tipo;
            nombre_dsp.setAttribute("type", "text");
            precio_dsp.setAttribute("type", "number");
            nombre_dsp.value = articulos[i].nombre;
            precio_dsp.value = articulos[i].precio;

            //guardo las ids de los inputs y los select para guardar solo un artículo en caso de que haya dos con el mismo nombre
            precio_dsp.id = nombre_dsp.id = `precio_${articulos[i].id_articulo}`
            nombre_dsp.id = `nombre_${articulos[i].id_articulo}`
            tipo.id = `tipo_${articulos[i].id_articulo}`
            var nombre = document.createElement("p");
            var precio = document.createElement("p");
            var ptipo = document.createElement("p");
            nombre.innerText = "Nombre:"
            ptipo.innerText = "Tipo:"
            precio.innerText = "Precio:"
            row.appendChild(p);
            row.appendChild(nombre);
            row.appendChild(nombre_dsp);
            row.appendChild(ptipo);
            row.appendChild(tipo);
            row.appendChild(precio);
            row.appendChild(precio_dsp);
            row.appendChild(boton);
            div.appendChild(row);
        }
    }
}

function modificarArticulo(id) {
    var nombre = document.getElementById(`nombre_${id}`).value;
    var tipo = document.getElementById(`tipo_${id}`).value;
    var precio = document.getElementById(`precio_${id}`).value;
    var articulos = JSON.parse(localStorage.articulos);
    var index_art = 0;
    //este bucle extrae el indice en el que se encuentra el articulo que quiero cambiar.
    for (let i = 0; i < articulos.length; i++) {
        if (articulos[i].id_articulo == id) {
            index_art = i;
        }
    }
    articulos[index_art].nombre = nombre;
    articulos[index_art].tipo = tipo;
    articulos[index_art].precio = precio;
    //comprobacion de mesas abiertas para que se no se modifiquen las comandas en el caso de cambiar nombres y precios los tickets no serian correctos:
    var mesas = JSON.parse(localStorage.mesa);
    var mesaAbierta = false;
    for (let i = 0; i < mesas.length; i++) {
        if (mesas[i].estado == "abierta") {
            mesaAbierta = true;
        }
    }
    if (!mesaAbierta) {
        var confirmacion = confirm("¿Está seguro que desea modificar el artículo?");
        if (confirmacion) {
            var comandaInit = [];
            localStorage.setItem("articulos", JSON.stringify(articulos));

            //actualizacion de comanda:
            for (let i = 0; i < articulos.length; i++) {
                comandaInit.push(new Comanda(articulos[i].id_articulo, articulos[i].nombre, 0, articulos[i].precio))
            }
            //actualizacion de mesas:
            for (let k = 0; k < mesas.length; k++) {
                mesas[k].comanda = comandaInit;
            }
            localStorage.setItem("mesa", JSON.stringify(mesas))
            location.reload();
        }
    } else {
        alert("Hay una mesas abiertas, deben cerrarse para aplicar los cambios en el menú.")
    }
}

function nuevoArticulo() {
    var articulos = JSON.parse(localStorage.articulos);
    var mesas = JSON.parse(localStorage.mesa);
    var nuevoNombre = document.getElementById("nuevoNombre").value;
    var nuevoPrecio = document.getElementById("nuevoPrecio").value;
    var nuevoTipo = document.getElementById("select").value;
    var ultimaId = articulos[articulos.length - 1].id_articulo;
    var n_ultima_Id = parseInt(ultimaId.substr(1, 2));
    var nuevaId = `a${n_ultima_Id + 1}`
    var articulo = new Articulo(nuevaId, nuevoTipo, nuevoNombre, nuevoPrecio);
    articulos.push(articulo);
    localStorage.setItem("articulos", JSON.stringify(articulos))
    //Actualizar comandas en cada una de las mesas.
    for (let i = 0; i < mesas.length; i++) {
        var oldcomanda = mesas[i].comanda;
        oldcomanda.push(articulo);
        mesas[i].comanda = oldcomanda;
    }
    localStorage.setItem("mesa", JSON.stringify(mesas))
    alert("Articulo añadido con éxito");
    location.reload();
}
function mostrarNmesas() {
    var mesas = JSON.parse(localStorage.mesa);
    var nMesas = mesas.length;
    var pNmesas = document.getElementById("numeroMesas");
    pNmesas.innerText = nMesas;
}
//añade una nueva mesa a la lista de mesas del restaurante.
function nuevaMesa() {
    var articulos = JSON.parse(localStorage.articulos);
    var mesas = JSON.parse(localStorage.mesa);
    var comandaInit = [];
    for (let i = 0; i < articulos.length; i++) {
        comandaInit.push(new Comanda(articulos[i].id_articulo, articulos[i].nombre, 0, articulos[i].precio))
    }
    var id_mesa = parseInt(mesas[mesas.length - 1].numero) + 1;
    var nuevaMesa = new Mesa(id_mesa, "cerrada", 0, comandaInit);
    mesas.push(nuevaMesa);
    localStorage.setItem("mesa", JSON.stringify(mesas))
    mostrarNmesas();
}
//borra la ultima mesa de la lista del restaurante
function borrarMesa() {
    var mesas = JSON.parse(localStorage.mesa);

    //compruebo que la ultima mesa no está abierta.
    if (mesas[mesas.length - 1].estado == "cerrada") {
        if (confirm("¿Estás seguro que desea borrar una mesa?")) {
            mesas.pop();
            localStorage.setItem("mesa", JSON.stringify(mesas));
        }
        mostrarNmesas();
    } else { alert("No se puede borrar la mesa porque su estado es abierta."); }
}
