function moverScroll(scrollPosition = 0){
    // Utilizar scrollTo para desplazarte verticalmente
    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth", // Opcional: agrega 'smooth' para realizar una animación suave
    });
}

function animacionCol(){
    const contLogin = document.getElementById("contenedorLogin");
    setTimeout(function () {
      contLogin.classList.toggle("col-lg-12");
      contLogin.classList.toggle("col-lg-7");
    }, 600);
}


document.addEventListener("DOMContentLoaded", function () {
    
    animacionCol();

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
                    const response = await axios.post("/login-admin", { data: data }, {
                        headers: {
                        "Content-Type": "application/json",
                        },
                    });
                    window.location.href = '/admin';
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
  });