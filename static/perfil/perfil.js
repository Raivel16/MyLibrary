
const obtenerTotalLibrosCalificados = async () => {
  try {
    const requestOptions = {
      method: "POST", // Especificamos que queremos usar el método POST
    };
    const response = await fetch("/obtenerTotalLibrosCalificados", requestOptions);

    if (!response.ok) {
      throw new Error("Error al obtener los datos desde el servidor.");
    }

    let datos = await response.json();
    const totalLibros = document.getElementById("total-libros");
    totalLibros.innerHTML = `${datos[0]["libros_calificados"]}`;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const obtenerTotalLibrosCofre = async () => {
  try {
    const requestOptions = {
      method: "POST", // Especificamos que queremos usar el método POST
    };
    const response = await fetch("/obtenerTotalLibrosCofre", requestOptions);

    if (!response.ok) {
      throw new Error("Error al obtener los datos desde el servidor.");
    }

    let datos = await response.json();
    const totalLibros = document.getElementById("libros-cofre");
    totalLibros.innerHTML = `${datos[0]["libros_cofre"]}`;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const obtenerTotalAutoresLeidos = async () => {
  try {
    const requestOptions = {
      method: "POST", // Especificamos que queremos usar el método POST
    };
    const response = await fetch("/obtenerTotalAutoresLeidos", requestOptions);

    if (!response.ok) {
      throw new Error("Error al obtener los datos desde el servidor.");
    }

    let datos = await response.json();
    const totalAutores = document.getElementById("total-autores");
    totalAutores.innerHTML = `${datos.length}`;
  } catch (error) {
    console.error("Error:", error.message);
  }
};


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
    const btnPagina = document.getElementById('pagPerfil');
    const navItemPagina = document.getElementById('navbarDropdownMenuAvatar');

    btnPagina.classList.add('perfil-icon-active');
    navItemPagina.classList.add('navItem-icon-active')

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

    obtenerTotalLibrosCalificados();
    obtenerTotalLibrosCofre();
    obtenerTotalAutoresLeidos();

    const formInsertarUsuario = document.getElementById('form-insertar-usuario');
    formInsertarUsuario.addEventListener('submit', (e)=>{
        e.preventDefault();
        let errores = '';

        const inputNombres = document.getElementById('nombre-usuario-insertar');
        const inputContraseña = document.getElementById('contraseña-usuario-insertar');
        const inputRepetirContraseña = document.getElementById('repetir-usuario-insertar');
        const inputActualContraseña = document.getElementById('actual-usuario-insertar');
        const inputIDUsuario = document.getElementById('id_usuario');

        let nombre = inputNombres.value.trim();
        let actualContraseña = inputActualContraseña.value.trim();
        let contraseña = inputContraseña.value.trim();
        let repContraseña = inputRepetirContraseña.value.trim();
        let UsuarioID = inputIDUsuario.value;
        
        let actualizarContraseña = false; 

        if(nombre == ''){
          errores += `<p>Debe escribirse el nombre de usuario.</p>`;
        }
        if(contraseña !== '' || actualContraseña != '' || repContraseña != ''){
          actualizarContraseña = true;
          if(actualContraseña == ''){
            errores += `<p>Debe escribirse la contraseña actual.</p>`;
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
        } 
        let data = {};
        if(actualizarContraseña){
          data = {
            "user": nombre,
            "UsuarioID":UsuarioID,
            "actualPass":actualContraseña,
            "pass": contraseña,
            "confirm": repContraseña,
          };
        } else {
          data = {
            "user": nombre,
            "UsuarioID":UsuarioID
          };
        }

        if(errores === ''){
          const register = async () => {
                try {
                    const response = await axios.post("/modificarUsuarioUsuario", { data: data }, {
                        headers: {
                        "Content-Type": "application/json",
                        },
                    });
                    modalInfo('El usuario se ha modificado con éxito.', "#00DD00");
                    setTimeout(()=>{
                      window.location.href = '/perfil';
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