

function validarContrasena(contrasena) {
  // Expresiones regulares para verificar los criterios
  const contieneMayuscula = /[A-Z]/.test(contrasena);
  const contieneMinuscula = /[a-z]/.test(contrasena);
  const contieneNumero = /\d/.test(contrasena);
  const contieneCaracterEspecial = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-|=]/.test(contrasena);

  // Verificar si cumple con todos los criterios
  const cumpleCriterios = contieneMayuscula && contieneMinuscula && contieneNumero && contieneCaracterEspecial;

  return cumpleCriterios;
}


function modalInfo(info, color = "#000", alineacion = "center", tamano = "600px", boton = "none"){
  const infoModal = document.getElementById('info-modal');
  infoModal.innerHTML = info;
  const btnModalClose = document.getElementById('btn-modal-close');
  const modalContent = document.getElementById('modal-content-libros');

  const anchoPantalla = window.innerWidth;
  if(anchoPantalla < 900){
    tamano = "95%"
  }

  btnModalClose.style.display = boton;
  infoModal.style.textAlign = alineacion;
  modalContent.style.width = tamano;
  modalContent.style.color = color;
  modalContent.style.border = "4px solid " + color;
  modalContent.style.borderTop = "15px solid " + color;


  const modal = document.getElementById('myModal');
  modal.style.display = 'block';

}

document.addEventListener("DOMContentLoaded", function () {
    
    const btnSeccionAdmin = document.getElementById('btn-usuarios-admin');
    btnSeccionAdmin.classList.add('active');

    const modal = document.getElementById('myModal');
    const closeModalBtn = document.getElementsByClassName('close')[0];
    const closeModalBtnCerrar = document.getElementById('btn-modal-close');
    
    closeModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    closeModalBtnCerrar.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });

    const formInsertarAdmin = document.getElementById('form-insertar-usuario');
    formInsertarAdmin.addEventListener('submit', (e)=>{
        e.preventDefault();
        let errores = '';

        const inputNombres = document.getElementById('nombre-usuario-insertar');
        const inputContraseña = document.getElementById('contraseña-usuario-insertar');
        const inputRepetirContraseña = document.getElementById('repetir-usuario-insertar');
        
        let nombre = inputNombres.value.trim();
        let contraseña = inputContraseña.value.trim();
        let repContraseña = inputRepetirContraseña.value.trim();

        if(nombre == ''){
          errores += `<p>Debe escribirse el nombre de Admin.</p>`;
        }
        if(contraseña == ''){
          errores += `<p>Debe escribirse una contraseña.</p>`;
        } 
        if(repContraseña == ''){
          errores += `<p>Debe repetir la contraseña.</p>`;
        } 

        if(contraseña.length < 8){
          errores += "<p>La contraseña debe ser de 8 caracteres como mínimo.</p>"
        } else if(!validarContrasena(contraseña)){
            errores += "<p>La contraseña debe contar con la presencia de mayúsculas, minúsculas, números y caracteres especiales.</p>"
        } else if (contraseña != repContraseña){
            errores += "<p>Las contraseñas no cohinciden.</p>"
        } 

        if(errores === ''){
          const register = async () => {
                try {
                    data = {
                      "user": nombre,
                      "pass": contraseña,
                      "confirm": repContraseña,
                    }
                    const response = await axios.post("/registerAdminAdmin", { data: data }, {
                        headers: {
                        "Content-Type": "application/json",
                        },
                    });
                    modalInfo('El admin se ha insertado con éxito.', "#00DD00");
                    setTimeout(()=>{
                      window.location.href = '/admin-usuarios';
                    }, 3000);
                } catch (error) {
                    let textoError = error.response.data.error;
                    errores += textoError
                    modalInfo(errores, "red");
                }
            };
            register();
          } else {
            modalInfo(errores, "red");
          }
               
      });

});
