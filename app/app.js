//#region variables
const displayJugador = document.querySelector(".jugador-container");
const displayMensaje = document.querySelector(".mensaje-container");
const displayCajas = document.querySelector(".caja-container");
const modal = document.querySelector(".modal-container");
const teclado = document.querySelector(".teclado-container");
let jugador = {
  nombre: "",
  tablero: [],
  wordle: "",
  fecha: new Date().getTime(),
  tiempo: "",
};
let listaPalabras = [];
let wordle = "";
let filaActual = 0;
let cajaActual = 0;
let juegoTerminado = false;

let contadorCall;
let horas = `00`;
let minutos = `00`;
let segundos = `00`;

const teclas = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Ñ",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "←",
];
//#endregion
//#region funcion obtener palabra
function obtenerPalabra() {
  fetch("../data/20.json")
    .then((response) => response.json())
    .then((palabras) => {
      wordle = palabraAleatoria(palabras).toUpperCase();
      return wordle;
    })
    .catch((error) => {
      console.log(error);
    });
}

function palabraAleatoria(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

//#endregion
//#region tablero
const intentosFilas = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];
//#endregion
//#region iniciador de wordle
const iniciarWordle = () => {
  displayCajas.innerHTML = "";

  intentosFilas.forEach((intentoFila, indexFila) => {
    const elementoFila = document.createElement("div");
    elementoFila.setAttribute("id", `intentoFila-${indexFila}`);
    displayCajas.appendChild(elementoFila);

    intentoFila.forEach((cajaLetra, indexCaja) => {
      const elementoCaja = document.createElement("div");
      elementoCaja.setAttribute("id", `intentoFila-${indexFila}-posicion-${indexCaja}`);
      elementoCaja.classList.add("caja");
      elementoFila.appendChild(elementoCaja);
    });
  });
};
//#endregion
//#region funciones del teclado
const generarTeclado = (habilitado = false) => {
  teclado.innerHTML = "";

  teclas.forEach((tecla) => {
    const botonTecla = document.createElement("button");
    botonTecla.textContent = tecla;
    botonTecla.setAttribute("id", tecla);
    if (!habilitado) {
      botonTecla.setAttribute("disabled", "");
    }
    botonTecla.addEventListener("click", () => {
      if (tecla === "←") {
        quitarLetra();
        return;
      }
      if (tecla === "ENTER") {
        if (cajaActual < 5) {
          mostrarMensaje("¡Rellena las letras que faltan!");
          return;
        }
        verificarFila();
        return;
      }
      ponerLetra(tecla);
    });
    teclado.append(botonTecla);
  });
};

const ponerLetra = (letra) => {
  if (filaActual < 6 && cajaActual < 5) {
    const caja = document.getElementById(`intentoFila-${filaActual}-posicion-${cajaActual}`
    );
    caja.innerText = letra;
    caja.setAttribute("data", letra);
    intentosFilas[filaActual][cajaActual] = letra;
    cajaActual++;
  }
};

const quitarLetra = () => {
  if (cajaActual > 0) {
    cajaActual--;
    const caja = document.getElementById(`intentoFila-${filaActual}-posicion-${cajaActual}`);
    caja.innerText = "";
    caja.setAttribute("data", "");
    intentosFilas[filaActual][cajaActual] = "";
  }
};
//#endregion
//#region verificacion de la palabra guardada
const verificarFila = () => {
  if (cajaActual > 4) {
    const adivinaUsuario = intentosFilas[filaActual].join("");
    jugador.tablero.push(adivinaUsuario);
    resaltarCajas(filaActual);
    if (adivinaUsuario === wordle) {
      mostrarMensaje("Excelente, has ganado! 🎉", true);
      eliminarJuegoGuardado(jugador.fecha);
      clearInterval(contadorCall);
      juegoTerminado = true;
      return;
    } else {
      if (filaActual >= 5) {
        mostrarMensaje("Que pena, perdiste! 😞", true);
        clearInterval(contadorCall);
        let respuesta = `<p>El wordle era ${wordle}</p>`;
        displayJugador.insertAdjacentHTML("beforeend", respuesta);
        juegoTerminado = true;
        return;
      }
      if (filaActual < 5) {
        filaActual++;
        cajaActual = 0;
      }
    }
  }
};
//#endregion
//#region mensajes
const mostrarMensaje = (mensaje, permanente = false) => {
  displayMensaje.innerHTML = "";
  const elementoMensaje = document.createElement("p");
  elementoMensaje.innerText = mensaje;
  displayMensaje.append(elementoMensaje);

  if (!permanente) {
    setTimeout(() => {
      displayMensaje.removeChild(elementoMensaje);
    }, 2500);
  }
};

//#endregion
//#region colores segun el nivel de acierto
const resaltarCajas = (filaActual) => {
  const cajasDeFila = document.getElementById(`intentoFila-${filaActual}`).childNodes;

  let verificarWordle = wordle;
  const intentoAdivinar = [];

  cajasDeFila.forEach((caja) => {
    intentoAdivinar.push({
      letra: caja.getAttribute("data"),
      color: "resaltado-gris",
    });
  });

  intentoAdivinar.forEach((intento) => {
    if (verificarWordle.includes(intento.letra)) {
      intento.color = "resaltado-amarillo";
      verificarWordle = verificarWordle.replace(intento.letra);
    }
  });

  intentoAdivinar.forEach((intento, index) => {
    if (intento.letra === wordle[index]) {
      intento.color = "resaltado-verde";
      verificarWordle = verificarWordle.replace(intento.letra);
    }
  });

  cajasDeFila.forEach((caja, index) => {
    const dataLetra = caja.getAttribute("data");
    setTimeout(() => {
      caja.classList.add(intentoAdivinar[index].color);
      document
        .getElementById(dataLetra)
        .classList.add(intentoAdivinar[index].color);
    }, 250 * index);
  });
};
//#endregion
//#region contador
const contador = () => {
  const contadorDisplay = document.getElementById("contador");
  segundos++;
//segundos
  if (segundos < 10) {
    segundos = `0` + segundos;
  }
//minutos
  if (segundos > 59) {
    segundos = `00`;
    minutos++;

    if (minutos < 10) {
      minutos = `0` + minutos;
    }
  }
//horas
  if (minutos > 59) {
    minutos = `00`;
    horas++;

    if (horas < 10) {
      horas = `0` + horas;
    }
  }

  contadorDisplay.innerHTML = `${horas}:${minutos}:${segundos}`;
};

const iniciarContador = (h = `00`, m = `00`, s = `00`) => {
  let contadorDisplay = document.getElementById("contador");
  horas = h;
  minutos = m;
  segundos = s;
  if (!contadorDisplay) {
    contadorDisplay = document.createElement("p");
    contadorDisplay.setAttribute("id", "contador");
  }
  displayJugador.insertAdjacentElement("beforeend", contadorDisplay);

  contadorCall = setInterval(contador, 1000);
};
//#endregion
//#region boton jugar
const btnJugar = document.querySelector("#jugar");
btnJugar.addEventListener("click", (e) => {
  e.preventDefault();
  if (!jugador.nombre) {
    modal.style.display = "flex";
  } else {
    filaActual = 0;
    cajaActual = 0;
    jugador.tablero = [];
    wordle = obtenerPalabra();
    iniciarWordle();
    generarTeclado(true);
    displayJugador.innerHTML = `<p>¡Mucha suerte, ${jugador.nombre}!</p>`;
    clearInterval(contadorCall);
    juegoTerminado = false;
    iniciarContador();
    displayMensaje.innerHTML = "";
    console.log(displayJugador.childNodes.length);
    if (displayJugador.childNodes.length > 2) {
      displayJugador.removeChild(displayJugador.lastChild());
    }
  }
});
//#endregion
//#region empieza el juego
const btnEmpezarJuego = document.getElementById("empezar");
btnEmpezarJuego.addEventListener("click", () => {
  const nombre = document.querySelector(".registro input");
  jugador.nombre = nombre.value;

  if (jugador.nombre) {
    displayJugador.innerHTML = "";
    clearInterval(contadorCall);

    iniciarContador();

    displayJugador.insertAdjacentHTML(
      "afterbegin",
      `<p>¡Mucha suerte, ${jugador.nombre}!</p>`
    );

    iniciarWordle();
    generarTeclado(true);
    modal.style.display = "none";
    nombre.value = "";
  }
});

window.addEventListener("DOMContentLoaded",() => {
  wordle = obtenerPalabra();
  iniciarWordle();
  generarTeclado();
});
//#endregion
//#region boton guardar 
const guardarJuego = (jugador) => {
  let juegosGuardados
  if (localStorage.getItem("juegosGuardados")) {
    juegosGuardados = JSON.parse(localStorage.getItem("juegosGuardados"))
  } else{
    juegosGuardados = []
  }
  console.log(juegosGuardados);
  if (juegoTerminado) {
    mostrarMensaje("Este juego no se puede guardar porque ya ha terminado.");
  } else {
    jugador.wordle = btoa(wordle);
    clearInterval(contadorCall);
    jugador.tiempo = `${horas}:${minutos}:${segundos}`;
    juegosGuardados.push(jugador);
    localStorage.setItem("juegosGuardados", JSON.stringify(juegosGuardados));
    iniciarWordle();
    generarTeclado();
    mostrarMensaje("Juego guardado correctamente.");
  }
};
//#endregion
//#region cargar
const cargarJuego = () => {
  const juegosGuardados = JSON.parse(localStorage.getItem("juegosGuardados"));
  if (!juegosGuardados || juegosGuardados.length == 0) {
    mostrarMensaje("No hay ningún juego guardado");
  } else {
    console.log(juegosGuardados);
    clearInterval(contadorCall);
    generarTeclado(true);

    renderJuegosGuardados(juegosGuardados);
  }
};
//#endregion
//#region validaciones
const guardar = document.getElementById("guardar");
guardar.addEventListener("click", (e) => {
  e.preventDefault();
  if (!jugador.nombre) {
    mostrarMensaje("No hay ningún jugador");
  } else {
    guardarJuego(jugador);
  }
});

const cargar = document.getElementById("cargar");
cargar.addEventListener("click", (e) => {
  e.preventDefault();
  cargarJuego();
});

//#endregion
//#region lista de juegos guardados
function renderJuegosGuardados(juegosGuardados) {
  const listaContainer = document.querySelector(".lista-container");
  if (listaContainer) {
    listaContainer.remove();
  }
  const guardadosContainer = document.createElement("div");
  guardadosContainer.classList.add("lista-container");

  const listaGuardados = document.createElement("div");
  listaGuardados.classList.add("lista-juegos");

  const h2 = `<h2>Juegos guardados</h2>`;
  guardadosContainer.insertAdjacentHTML("afterbegin", h2);

  juegosGuardados.forEach((juego) => {
    const p = document.createElement("p");
    p.classList.add("juego-guardado");
    p.innerHTML = `${juego.nombre} - ${new Date(juego.fecha).toLocaleDateString(
      "es",
      { year: "numeric", month: "short", day: "numeric" }
    )}<br /><span>${juego.tablero}</span>`;

    p.addEventListener("click", () => {
      jugador = juego;
      clearInterval(contadorCall);
      iniciarWordle();
      wordle = atob(juego.wordle);
      horas = juego.tiempo.split(":")[0];
      minutos = juego.tiempo.split(":")[1];
      segundos = juego.tiempo.split(":")[2];
      for (let i = 0; i < juego.tablero.length; i++) {
        filaActual = i;
        const palabra = juego.tablero[i];
        const letras = palabra.split("");
        for (let j = 0; j < letras.length; j++) {
          cajaActual = j;
          ponerLetra(letras[j]);
        }
        resaltarCajas(filaActual);
      }
      jugador.tablero = [];
      verificarFila();

      guardadosContainer.style.display = "none";
      displayJugador.innerHTML = "";
      displayJugador.innerHTML = `<p>¡Mucha suerte, ${juego.nombre}!</p>`;
      iniciarContador(horas, minutos, segundos);
    });

    listaGuardados.insertAdjacentElement("beforeend", p);
  });
  modal.insertAdjacentElement("afterend", guardadosContainer);
  guardadosContainer.insertAdjacentElement("beforeend", listaGuardados);
  guardadosContainer.style.display = "flex";
}
//#endregion
//#region elimina la lista de los juegos guardados

function eliminarJuegoGuardado(fecha) {
  let juegosGuardados = JSON.parse(localStorage.getItem("juegosGuardados"));
  if (juegosGuardados) {
    const juegos = juegosGuardados.filter((juego) => fecha !== juego.fecha);
    localStorage.setItem("juegosGuardados", JSON.stringify(juegos));
  }
}
//#endregion
