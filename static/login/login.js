
function botonRegistrar(){
    animacionCol();
    setTimeout(()=>{
        const divIniciarSesion = document.getElementById('divIniciarSesion');
        const divRegistrar = document.getElementById('divRegistrar');
        divIniciarSesion.style.display = 'none';
        divRegistrar.style.display = 'block';
    }, 2000);
    setTimeout(animacionCol,1000);
}

function botonIniciarSesion(){
    animacionCol();
    setTimeout(()=>{
        const divIniciarSesion = document.getElementById('divIniciarSesion');
        const divRegistrar = document.getElementById('divRegistrar');
        divRegistrar.style.display = 'none';
        divIniciarSesion.style.display = 'block';
    }, 2000);
    setTimeout(animacionCol,1000);
}

function moverScroll(scrollPosition = 0){
    // Utilizar scrollTo para desplazarte verticalmente
    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth", // Opcional: agrega 'smooth' para realizar una animación suave
    });
}

function botonRegistrarMovil(){
    moverScroll();

    setTimeout(()=>{
        const divIniciarSesion = document.getElementById('divIniciarSesion');
        const divRegistrar = document.getElementById('divRegistrar');
        divIniciarSesion.style.display = 'none';
        divRegistrar.style.display = 'block';
    }, 1000);

    setTimeout(()=>{
        const viewportHeight = window.innerHeight;
        moverScroll(viewportHeight)
    }, 1000);
}

function botonIniciarSesionMovil(){
    moverScroll();

    setTimeout(()=>{
        const divIniciarSesion = document.getElementById('divIniciarSesion');
        const divRegistrar = document.getElementById('divRegistrar');
        divRegistrar.style.display = 'none';
        divIniciarSesion.style.display = 'block';
    }, 1000);

    setTimeout(()=>{
        const viewportHeight = window.innerHeight;
        moverScroll(viewportHeight)
    }, 1000);
}

function animacionCol(){
    const contLogin = document.getElementById("contenedorLogin");
    setTimeout(function () {
      contLogin.classList.toggle("col-lg-12");
      contLogin.classList.toggle("col-lg-7");
    }, 600);
}

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



function verificarAnchoPantalla() {
    const anchoPantalla = window.innerWidth;
    const btnIniciarSesion = document.getElementById('enlaceIniciarSesion');
    const btnRegistrar = document.getElementById('enlaceRegistrar');

    if (anchoPantalla < 991){
        btnIniciarSesion.onclick = botonIniciarSesionMovil;
        btnRegistrar.onclick = botonRegistrarMovil;
    } else {
        btnIniciarSesion.onclick = botonIniciarSesion;
        btnRegistrar.onclick = botonRegistrar;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    
    animacionCol();
    verificarAnchoPantalla();
    window.addEventListener('resize', verificarAnchoPantalla);

    const arrowLogin = document.getElementById("arrow-login");
    arrowLogin.addEventListener("click", () => {
        // Obtener la altura de la ventana (viewport)
        const viewportHeight = window.innerHeight;
        moverScroll(viewportHeight);
    });

    const formIniciarSesion = document.getElementById('formulario-iniciarSesion');
    formIniciarSesion.addEventListener('submit', (e)=>{
        e.preventDefault();

        const divErrores = document.getElementById('resp-errores');
        const inputUser = document.getElementById("username");
        const inputPass = document.getElementById("password");

        let username = inputUser.value;
        let password = inputPass.value;
        let errores = '';

        // Eliminar los espacios en blanco en toda la cadena
        username = username.replace(/\s+/g, '');
        password = password.replace(/\s+/g, '');

        if (username === ''){
            errores += "<p>Debe rellenar el campo de usuario.</p>"
        }
        if (password === ''){
            errores += "<p>Debe rellenar el campo de contraseña.</p>"
        }

        if (errores){
            divErrores.innerHTML = errores;
            divErrores.style.display = "block";
        }
        else {
             data = {
            "user": username,
            "pass": password
            }
            const login = async () => {
                try {
                    const response = await axios.post("/login", { data: data }, {
                        headers: {
                        "Content-Type": "application/json",
                        },
                    });
                    window.location.href = '/';
                } catch (error) {
                    let textoError = error.response.data.error;
                    errores += textoError
                    divErrores.innerHTML = errores;
                    divErrores.style.display = "block";
                }
            };
            login();
        }
        
    });

    const formCrearCuenta = document.getElementById('formulario-crearCuenta');
    formCrearCuenta.addEventListener('submit', (e)=>{
        e.preventDefault();

        const divErrores = document.getElementById('resp-erroresRegister');
        const inputUser = document.getElementById("usernameRegister");
        const inputPass = document.getElementById("passwordRegister");
        const inputPassConfirm = document.getElementById("confirmacion");

        let username = inputUser.value;
        let password = inputPass.value;
        let confirmPass = inputPassConfirm.value;
        let errores = '';

        // Eliminar los espacios en blanco en toda la cadena
        username = username.replace(/\s+/g, '');
        password = password.replace(/\s+/g, '');
        confirmPass = confirmPass.replace(/\s+/g, '');

        if (username === ''){
            errores += "<p>Debe rellenar el campo de usuario.</p>"
        }
        if (password === ''){
            errores += "<p>Debe rellenar el campo de contraseña.</p>"
        }
        if (confirmPass === ''){
            errores += "<p>Debe rellenar el campo de repetir contraseña.</p>"
        }

        if(password.length < 8){
            errores += "<p>La contraseña debe ser de 8 caracteres como mínimo.</p>"
        } else if(!validarContrasena(password)){
            errores += "<p>La contraseña debe contar con la presencia de mayúsculas, minúsculas, números y caracteres especiales.</p>"
        } else if (password != confirmPass){
            errores += "<p>Las contraseñas no cohinciden.</p>"
        }        

        if (errores){
            divErrores.innerHTML = errores;
            divErrores.style.display = "block";
        }
        else {
             data = {
            "user": username,
            "pass": password,
            "confirm": confirmPass,
            }
            const register = async () => {
                try {
                    const response = await axios.post("/register", { data: data }, {
                        headers: {
                        "Content-Type": "application/json",
                        },
                    });
                    window.location.href = '/';
                } catch (error) {
                    let textoError = error.response.data.error;
                    errores += textoError
                    divErrores.innerHTML = errores;
                    divErrores.style.display = "block";
                }
            };
            register();
        }
        
    });
    


  });