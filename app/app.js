const displayJugador = document.querySelector(".jugador-container");
const displayMensaje = document.querySelector(".mensaje-container");
const displayCajas = document.querySelector(".caja-container");
const modal = document.querySelector(".modal-container");
const teclado = document.querySelector(".teclado-container");
let jugador = {
  name: "",
  tablero: [],
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


const intentosFilas = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

const iniciarWordle = () => {
  displayCajas.innerHTML = "";

  intentosFilas.forEach((intentoFila, indexFila) => {
    const elementoFila = document.createElement("div");
    elementoFila.setAttribute("id", `intentoFila-${indexFila}`);
    displayCajas.appendChild(elementoFila);
    intentoFila.forEach((cajaLetra, indexCaja) => {
      const elementoCaja = document.createElement("div");
      elementoCaja.setAttribute(
        "id",
        `intentoFila-${indexFila}-posicion-${indexCaja}`
      );
      elementoCaja.classList.add("caja");
      elementoFila.appendChild(elementoCaja);
    });
  });
};

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
    const caja = document.getElementById(
      `intentoFila-${filaActual}-posicion-${cajaActual}`
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
    const caja = document.getElementById(
      `intentoFila-${filaActual}-posicion-${cajaActual}`
    );
    caja.innerText = "";
    caja.setAttribute("data", "");
    intentosFilas[filaActual][cajaActual] = "";
  }
};

const verificarFila = () => {
  if (cajaActual > 4) {
    const adivinaUsuario = intentosFilas[filaActual].join("");
    jugador.tablero.push(adivinaUsuario);
    console.log(jugador.tablero);
    resaltarCajas();
    if (adivinaUsuario === wordle) {
      mostrarMensaje("Excelente, has ganado! 🎉", true);
      clearInterval(contadorCall);
      juegoTerminado = true;
      return;
    } else {
      if (filaActual >= 5) {
        let contadorDisplay = document.getElementById("contador");
        mostrarMensaje("Que pena, perdiste! 😞", true);
        clearInterval(contadorCall);
        juegoTerminado = true;
        let respuesta = `<p>El wordle era ${wordle}</p>`;
        displayJugador.insertAdjacentHTML("beforeend", respuesta);
        return;
      }
      if (filaActual < 5) {
        filaActual++;
        cajaActual = 0;
      }
    }
  }
};


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


const resaltarCajas = () => {
  const cajasDeFila = document.getElementById(
    `intentoFila-${filaActual}`
  ).childNodes;

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
      verificarWordle = verificarWordle.replace(intento.letra, "");
    }
  });

  intentoAdivinar.forEach((intento, index) => {
    if (intento.letra === wordle[index]) {
      intento.color = "resaltado-verde";
      verificarWordle = verificarWordle.replace(intento.letra, "");
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

const contador = () => {
  const contadorDisplay = document.getElementById("contador");
  segundos++;

  if (segundos < 10) segundos = `0` + segundos;

  if (segundos > 59) {
    segundos = `00`;
    minutos++;

    if (minutos < 10) minutos = `0` + minutos;
  }

  if (minutos > 59) {
    minutos = `00`;
    horas++;

    if (horas < 10) horas = `0` + horas;
  }

  contadorDisplay.innerHTML = `${horas}:${minutos}:${segundos}`;
};

const btnJugar = document.querySelector(".titulo-container button");
btnJugar.addEventListener("click", () => {
  if (jugador.name == "") {
    modal.style.display = "flex";
  } else {
    clearInterval(contadorCall);
    horas = `00`;
    minutos = `00`;
    segundos = `00`;
    contadorCall = setInterval(contador, 1000);
    displayMensaje.innerHTML = "";
    if (displayJugador.childNodes.length == 3) {
      displayJugador.removeChild(displayJugador.lastChild());
    }
    iniciarWordle();
    generarTeclado(true);
  }
});

const btnEmpezarJuego = document.getElementById("empezar");
btnEmpezarJuego.addEventListener("click", () => {
  const nombre = document.querySelector(".registro input");
  jugador.name = nombre.value;

  if (jugador.name != "") {
    displayJugador.innerHTML = "";
    let contadorDisplay = document.getElementById("contador");
    clearInterval(contadorCall);

    horas = `00`;
    minutos = `00`;
    segundos = `00`;
    if (!contadorDisplay) {
      contadorDisplay = document.createElement("p");
      contadorDisplay.setAttribute("id", "contador");
    }
    displayJugador.insertAdjacentElement("afterbegin", contadorDisplay);

    contadorCall = setInterval(contador, 1000);

    displayJugador.insertAdjacentHTML(
      "afterbegin",
      `<p>¡Mucha suerte, ${jugador.name}!</p>`
    );

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
