
const obtenerUsuarios = async () => {
    try {
      const requestOptions = {
        method: "POST", // Especificamos que queremos usar el método POST
      };

      const response = await fetch("/obtenerUsuarios", requestOptions);

      if (!response.ok) {
        throw new Error("Error al obtener los datos desde el servidor.");
      }

      let datos = await response.json();
      renderUsuarios(datos);

      // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
    } catch (error) {
      console.error("Error:", error.message);
    }
};
  
const obtenerAdmins = async () => {
    try {
      const requestOptions = {
        method: "POST", // Especificamos que queremos usar el método POST
      };

      const response = await fetch("/obtenerAdmins", requestOptions);

      if (!response.ok) {
        throw new Error("Error al obtener los datos desde el servidor.");
      }

      let datos = await response.json();
      renderAdmins(datos);

      // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
    } catch (error) {
      console.error("Error:", error.message);
    }
};


const obtenerTotalUsuarios = async () => {
    try {
      const requestOptions = {
        method: "POST", // Especificamos que queremos usar el método POST
      };
      const response = await fetch("/obtenerTotalUsuarios", requestOptions);
  
      if (!response.ok) {
        throw new Error("Error al obtener los datos desde el servidor.");
      }
  
      let datos = await response.json();
      const totalUsuarios = document.getElementById("total-usuarios");
      totalUsuarios.innerHTML = `${datos[0]["total_usuarios"]}`;
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

const obtenerTotalAdmins = async () => {
    try {
      const requestOptions = {
        method: "POST", // Especificamos que queremos usar el método POST
      };
      const response = await fetch("/obtenerTotalAdmins", requestOptions);
  
      if (!response.ok) {
        throw new Error("Error al obtener los datos desde el servidor.");
      }
  
      let datos = await response.json();
      const totalUsuarios = document.getElementById("total-admins");
      totalUsuarios.innerHTML = `${datos[0]["total_admins"]}`;
    } catch (error) {
      console.error("Error:", error.message);
    }
  };



async function eliminarUsuario(UsuarioID) {
    try {
      const datosEnviar = {
        "UsuarioID": UsuarioID,
      };
  
      const response = await axios.post(
        "/eliminarUsuario",
        { data: datosEnviar },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let datos = response.data;
      if(datos.length == 0){
        modalInfo("Ha ocurrido un error al eliminar", "red");
      }else{
        obtenerUsuarios();
        obtenerTotalUsuarios();
        modalInfo("El usuario fue eliminado con éxito", "#00DD00");
      }
    } catch (error) {
      console.log(error);
    }
}  

async function eliminarAdmins(AdminID) {
    try {
      const datosEnviar = {
        "AdminID": AdminID,
      };
  
      const response = await axios.post(
        "/eliminarAdmins",
        { data: datosEnviar },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let datos = response.data;
      if(datos.length == 0){
        modalInfo("Ha ocurrido un error al eliminar", "red");
      }else{
        obtenerAdmins();
        obtenerTotalAdmins();
        modalInfo("El admin fue eliminado con éxito", "#00DD00");
      }
    } catch (error) {
      console.log(error);
    }
}

function vinculosAdmin(){
    setTimeout(()=>{
      // Vinculo eliminar usuarios
      document.querySelectorAll(".eliminar-admin").forEach((admin) => {
        admin.addEventListener("click", () => {
          const adminID = admin.id;
          let formHTML = `
            <form class="form-confirm-eliminar-usuarios" id="form-confirm-eliminar-admin">
              <div>
                <label>¿Seguro que desea eliminar este admin?</label>
              </div>
              <div class="div-btns">
                <button type="submit" class="btn-si-eliminar-usuarios">Sí</button>
                <button type="button" class="btn-no-eliminar-usuarios" id="cerrar-modal-admin">No</button>
              </div>
            </form>
          `;
          modalInfo(formHTML, "#07143B");
  
          const cerrarModal = document.getElementById("cerrar-modal-admin");
          const formConfirmarEliminar = document.getElementById('form-confirm-eliminar-admin');
          
          cerrarModal.addEventListener("click", () => {
            const modal = document.getElementById("myModal");
            modal.style.display = "none";
          });
  
          formConfirmarEliminar.addEventListener('submit', (e)=>{
            e.preventDefault()
            const modal = document.getElementById("myModal");
            modal.style.display = "none";
            eliminarAdmins(adminID);
          });
        });
      });
    }, 800);
}


function vinculosUsuarios(){
    setTimeout(()=>{
      // Vinculo eliminar usuarios
      document.querySelectorAll(".eliminar-usuarios").forEach((usuario) => {
        usuario.addEventListener("click", () => {
          const usuarioID = usuario.id;
          let formHTML = `
            <form class="form-confirm-eliminar-usuarios" id="form-confirm-eliminar-usuarios">
              <div>
                <label>¿Seguro que desea eliminar este usuario?</label>
              </div>
              <div class="div-btns">
                <button type="submit" class="btn-si-eliminar-usuarios">Sí</button>
                <button type="button" class="btn-no-eliminar-usuarios" id="cerrar-modal">No</button>
              </div>
            </form>
          `;
          modalInfo(formHTML, "#07143B");
  
          const cerrarModal = document.getElementById("cerrar-modal");
          const formConfirmarEliminar = document.getElementById('form-confirm-eliminar-usuarios');
          
          cerrarModal.addEventListener("click", () => {
            const modal = document.getElementById("myModal");
            modal.style.display = "none";
          });
  
          formConfirmarEliminar.addEventListener('submit', (e)=>{
            e.preventDefault()
            const modal = document.getElementById("myModal");
            modal.style.display = "none";
            eliminarUsuario(usuarioID);
          });
        });
      });
    }, 800);
}

function renderUsuarios(datos) {
    const contenedorUsuarios = document.getElementById("filtros-usuarios");
    let itemsUsuariosHTML = "";
  
    datos.forEach((item) => {
      let id = item["ID"];
      let nombre = item["nombre"];
      let element = `
            <div class="cont-usuarios dropdown">
            <a
                class="dropdown-toggle d-flex align-items-center hidden-arrow"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
                >
              <div class="item-usuarios" id="${id}">${nombre}</div>
            </a>
            <ul class="dropdown-menu submenu-usuarios" aria-labelledby="navbarDropdownMenuAvatar">
                <li>
                <a href="/admin-usuario-modificar?UsuarioID=${id}" class="dropdown-item modificar-usuarios" id="${id}">Modificar Usuario</a>
                </li>
                <li>
                <a class="dropdown-item eliminar-usuarios" id='${id}'>Eliminar Usuario</a>
                </li>
            </ul>            
            </div>`;
      itemsUsuariosHTML += element;
    });
    contenedorUsuarios.innerHTML = itemsUsuariosHTML;
    vinculosUsuarios();
}

function renderAdmins(datos) {
    const contenedorAdmins = document.getElementById("filtros-admins");
    let itemsUsuariosHTML = "";
  
    datos.forEach((item) => {
      let id = item["ID"];
      let nombre = item["nombre"];
      let element = `
            <div class="cont-usuarios dropdown">
            <a
                class="dropdown-toggle d-flex align-items-center hidden-arrow"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
                >
              <div class="item-usuarios" id="${id}">${nombre} - ${id}</div>
            </a>
            <ul class="dropdown-menu submenu-usuarios" aria-labelledby="navbarDropdownMenuAvatar">
                <li>
                <a href="/admin-admin-modificar?AdminID=${id}" class="dropdown-item modificar-admin" id="${id}">Modificar Admin</a>
                </li>
                <li>
                <a class="dropdown-item eliminar-admin" id='${id}'>Eliminar Admin</a>
                </li>
            </ul>            
            </div>`;
      itemsUsuariosHTML += element;
    });
    contenedorAdmins.innerHTML = itemsUsuariosHTML;
    vinculosAdmin();
}
  
  

function modalInfo(
    info,
    color = "#000",
    alineacion = "center",
    tamano = "600px",
    boton = "none"
  ) {
    const infoModal = document.getElementById("info-modal");
    infoModal.innerHTML = info;
    const btnModalClose = document.getElementById("btn-modal-close");
    const modalContent = document.getElementById("modal-content-libros");
  
    const anchoPantalla = window.innerWidth;
    if (anchoPantalla < 900) {
      tamano = "95%";
    }
  
    btnModalClose.style.display = boton;
    infoModal.style.textAlign = alineacion;
    modalContent.style.width = tamano;
    modalContent.style.color = color;
    modalContent.style.border = "4px solid " + color;
    modalContent.style.borderTop = "15px solid " + color;
  
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
  }
  

document.addEventListener("DOMContentLoaded", function () {
    const btnSeccionAdmin = document.getElementById('btn-usuarios-admin');
    btnSeccionAdmin.classList.add('active');


    const modal = document.getElementById("myModal");
    const closeModalBtn = document.getElementsByClassName("close")[0];
    const closeModalBtnCerrar = document.getElementById("btn-modal-close");
  
    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    closeModalBtnCerrar.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });

    obtenerUsuarios();
    obtenerTotalUsuarios();

    obtenerAdmins();
    obtenerTotalAdmins();
    

    const inputBuscador = document.getElementById("search");
    const formBuscador = document.getElementById("buscador-form");
    

    formBuscador.addEventListener('submit', (e)=>{
        e.preventDefault();
        let valorInputBuscador = inputBuscador.value.trim();
    
          if(valorInputBuscador === ''){
            obtenerUsuarios();
            obtenerAdmins();
          } else {
              const busquedaUsuarios = async () => {
              try {
                  const datosEnviar = {
                    "valor": valorInputBuscador,
                  }

                  const response = await axios.post("/busquedaUsuarios", { data: datosEnviar }, {
                      headers: {
                      "Content-Type": "application/json",
                      },
                  });
                  let datos = response.data;
                  let datosUsuarios = datos['resultadosUsuarios'];
                  let datosAdmins = datos['resultadosAdmins'];
                  console.log(datosAdmins);
                  if (datosUsuarios.length === 0){
                    const contenedorUsuarios = document.getElementById("filtros-usuarios");
                    contenedorUsuarios.innerHTML = 'No se encontraron resultados.';
                  }
                  else {
                    renderUsuarios(datosUsuarios);
                  }
                  if(datosAdmins.length === 0){
                    const contenedorAdmins = document.getElementById("filtros-admins");
                    contenedorAdmins.innerHTML = 'No se encontraron resultados.';
                  } else {
                    renderAdmins(datosAdmins);
                  }
                  
              } catch (error) {
                  console.log(error.response.data.error);
              }
            };
            busquedaUsuarios();
          }
    });

    inputBuscador.addEventListener('keyup', (e)=>{

      let valorInputBuscador = inputBuscador.value.trim();
  
        if(valorInputBuscador === ''){
          obtenerUsuarios();
          obtenerAdmins();
        } else {
            const busquedaUsuarios = async () => {
            try {
                const datosEnviar = {
                  "valor": valorInputBuscador,
                }

                const response = await axios.post("/busquedaUsuarios", { data: datosEnviar }, {
                    headers: {
                    "Content-Type": "application/json",
                    },
                });
                let datos = response.data;
                let datosUsuarios = datos['resultadosUsuarios'];
                let datosAdmins = datos['resultadosAdmins'];
                if (datosUsuarios.length === 0){
                  const contenedorUsuarios = document.getElementById("filtros-usuarios");
                  contenedorUsuarios.innerHTML = 'No se encontraron resultados.';
                }
                else {
                  renderUsuarios(datosUsuarios);
                }
                if(datosAdmins.length === 0){
                  const contenedorAdmins = document.getElementById("filtros-admins");
                  contenedorAdmins.innerHTML = 'No se encontraron resultados.';
                } else {
                  renderAdmins(datosAdmins);
                }
                
            } catch (error) {
                console.log(error.response.data.error);
            }
          };
          busquedaUsuarios();
        }
  });
});