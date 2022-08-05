//Validacion del formulario
const formulario = document.querySelector(".formulario form");
formulario.addEventListener("submit", (e) => {
  const mensaje = document.getElementById("mensaje");
  const bloqueMensaje = document.querySelector(".form-block textarea");

  if (mensaje.value.length < 5) {
    e.preventDefault();
    const mensajeError = `<p>El mensaje debe tener mas de 5 caracteres.</p>`;
    bloqueMensaje.insertAdjacentHTML("afterend", mensajeError);
  }
});

