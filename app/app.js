const displayMensaje = document.querySelector(".mensaje-container");
const displayCajas = document.querySelector(".caja-container");
const teclado = document.querySelector(".teclado-container");
const listaPalabras = [];
let wordle = "";

fetch("../data/5.json")
  .then((response) => response.json())
  .then((palabras) => {
    const sinAcentos = palabras.filter((palabra) => {
      const acentos = ["á", "é", "í", "ó", "ú"];

      for (const letra of palabra.split("")) {
        for (const vocal of acentos) {
          if (letra === vocal) return false;
        }
      }
      return true;
    });
    listaPalabras = sinAcentos;
    wordle = palabraAleatoria(listaPalabras).toUpperCase();
    console.log(wordle);
  })
  .catch((error) => {
    console.log(error);
  });

function palabraAleatoria(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

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

const intentosFilas = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let filaActual = 0;
let cajaActual = 0;
let juegoTerminado = false;

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

teclas.forEach((tecla) => {
  const botonTecla = document.createElement("button");
  botonTecla.textContent = tecla;
  botonTecla.setAttribute("id", tecla);
  botonTecla.addEventListener("click", () => {
    console.log("Clickie", tecla);
    if (tecla === "←") {
      quitarLetra();
      return;
    }
    if (tecla === "ENTER") {
      verificarFila();
      return;
    }
    ponerLetra(tecla);
  });
  teclado.append(botonTecla);
});

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
    resaltarCajas();
    if (adivinaUsuario === wordle) {
      mostrarMensaje("Excelente, has ganado!");
      juegoTerminado = true;
      return;
    } else {
      if (filaActual >= 5) {
        juegoTerminado = false;
        return;
      }
      if (filaActual < 5) {
        filaActual++;
        cajaActual = 0;
      }
    }
  }
};

const mostrarMensaje = (mensaje) => {
  const elementoMensaje = document.createElement("p");
  elementoMensaje.innerText = mensaje;
  displayMensaje.append(elementoMensaje);
  setTimeout(() => {
    displayMensaje.removeChild(elementoMensaje);
  }, 2000);
};

const resaltarCajas = () => {
  const cajasDeFila = document.getElementById(
    `intentoFila-${filaActual}`
  ).childNodes;

  let verificarWordle = wordle;
  const intentos = [];

  cajasDeFila.forEach((caja, index) => {
    const dataLetra = caja.getAttribute("data");

    setTimeout(() => {
      caja.classList.add("girar");
      if (dataLetra == wordle[index]) {
        caja.classList.add("resaltado-verde");
        document.getElementById(dataLetra).classList.add("resaltado-verde");
      } else if (wordle.split("").includes(dataLetra)) {
        caja.classList.add("resaltado-amarillo");
        document.getElementById(dataLetra).classList.add("resaltado-amarillo");
      } else {
        caja.classList.add("resaltado-gris");
        document.getElementById(dataLetra).classList.add("resaltado-gris");
      }
    }, 500 * index);
  });
};
