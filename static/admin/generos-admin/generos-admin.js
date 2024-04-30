let generosDB = [];

const obtenerGeneros = async () => {
    try {
      const requestOptions = {
        method: "POST", // Especificamos que queremos usar el método POST
      };

      const response = await fetch("/generosAdmin", requestOptions);

      if (!response.ok) {
        throw new Error("Error al obtener los datos desde el servidor.");
      }

      generosDB = await response.json();
      renderGeneros(generosDB);

      // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
    } catch (error) {
      console.error("Error:", error.message);
    }
};
  

const obtenerTotalGeneros = async () => {
    try {
      const requestOptions = {
        method: "POST", // Especificamos que queremos usar el método POST
      };
      const response = await fetch("/obtenerTotalGenerosAdmin", requestOptions);
  
      if (!response.ok) {
        throw new Error("Error al obtener los datos desde el servidor.");
      }
  
      let datos = await response.json();
      const totalGeneros = document.getElementById("total-generos");
      totalGeneros.innerHTML = `${datos[0]["total_generos"]}`;
    } catch (error) {
      console.error("Error:", error.message);
    }
  };


async function eliminarGenero(GeneroID) {
    try {
      const datosEnviar = {
        "GeneroID": GeneroID,
      };
  
      const response = await axios.post(
        "/eliminarGenero",
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
        obtenerGeneros();
        obtenerTotalGeneros();
        modalInfo("El autor fue eliminado con éxito", "#00DD00");
      }
    } catch (error) {
      console.log(error);
    }
}  


function vinculosGeneros(){
    setTimeout(()=>{
      // Vinculo eliminar genero
      document.querySelectorAll(".eliminar-genero").forEach((genero) => {
        genero.addEventListener("click", () => {
          const generoID = genero.id;
          let formHTML = `
            <form class="form-confirm-eliminar-genero" id="form-confirm-eliminar-genero">
              <div>
                <label>¿Seguro que desea eliminar este genero?</label>
              </div>
              <div class="div-btns">
                <button type="submit" class="btn-si-eliminar-genero">Sí</button>
                <button type="button" class="btn-no-eliminar-genero" id="cerrar-modal">No</button>
              </div>
            </form>
          `;
          modalInfo(formHTML, "#07143B");
  
          const cerrarModal = document.getElementById("cerrar-modal");
          const formConfirmarEliminar = document.getElementById('form-confirm-eliminar-genero');
          
          cerrarModal.addEventListener("click", () => {
            const modal = document.getElementById("myModal");
            modal.style.display = "none";
          });
  
          formConfirmarEliminar.addEventListener('submit', (e)=>{
            e.preventDefault()
            const modal = document.getElementById("myModal");
            modal.style.display = "none";
            eliminarGenero(generoID);
          });
        });
      });
    }, 800);
}

function renderGeneros(datos) {
    const contenedorGeneros = document.getElementById("filtros-genero");
    let itemsGeneroHTML = "";
  
    datos.forEach((item) => {
      let id = item["ID"];
      let nombre = item["nombre"];
      let element = `
            <div class="cont-genero dropdown">
            <a
                class="dropdown-toggle d-flex align-items-center hidden-arrow"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
                >
              <div class="item-genero" id="${id}">${nombre}</div>
            </a>
            <ul class="dropdown-menu submenu-genero" aria-labelledby="navbarDropdownMenuAvatar">
                <li>
                <a href="/admin-genero-modificar?GeneroID=${id}" class="dropdown-item modificar-genero" id="${id}">Modificar Genero</a>
                </li>
                <li>
                <a class="dropdown-item eliminar-genero" id='${id}'>Eliminar Genero</a>
                </li>
            </ul>            
            </div>`;
      itemsGeneroHTML += element;
    });
    contenedorGeneros.innerHTML = itemsGeneroHTML;
    vinculosGeneros();
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
    const btnSeccionAdmin = document.getElementById('btn-generos-admin');
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

    obtenerGeneros();
    obtenerTotalGeneros();
    

    const inputBuscador = document.getElementById("search");
    const formBuscador = document.getElementById("buscador-form");
    

    formBuscador.addEventListener('submit', (e)=>{
        e.preventDefault();

        let valorInputBuscador = inputBuscador.value.trim();
    
          if(valorInputBuscador === ''){
            obtenerGeneros();
          } else {
              const busquedaGeneros = async () => {
              try {
                  const datosEnviar = {
                    "valor": valorInputBuscador,
                  }

                  const response = await axios.post("/busquedaGenerosAdmin", { data: datosEnviar }, {
                      headers: {
                      "Content-Type": "application/json",
                      },
                  });
                  let datos = response.data;
                  if (datos.length === 0){
                    const contenedorGeneros = document.getElementById("filtros-genero");
                    contenedorGeneros.innerHTML = 'No se encontraron resultados.';
                  }
                  else {
                    renderGeneros(datos);
                  }
                  
              } catch (error) {
                  console.log(error.response.data.error);
              }
            };
            busquedaGeneros();
          }
    });

    inputBuscador.addEventListener("keyup", (e)=>{
        let valorInputBuscador = inputBuscador.value.trim();
    
        if(valorInputBuscador === ''){
          obtenerGeneros();
        } else {
              const busquedaGeneros = async () => {
              try {
                  const datosEnviar = {
                    "valor": valorInputBuscador,
                  }

                  const response = await axios.post("/busquedaGenerosAdmin", { data: datosEnviar }, {
                      headers: {
                      "Content-Type": "application/json",
                      },
                  });
                  let datos = response.data;
                  if (datos.length === 0){
                    const contenedorGeneros = document.getElementById("filtros-genero");
                    contenedorGeneros.innerHTML = 'No se encontraron resultados.';
                  }
                  else {
                    renderGeneros(datos);
                  }
                  
              } catch (error) {
                  console.log(error.response.data.error);
              }
            };
            busquedaGeneros();
          }
    })
});