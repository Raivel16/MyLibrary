let currentPage = 1;
const itemsPerPage = 20;
let totalData = [];
let totalPages = 0;

const obtenerAutores = async () => {
  try {
    const requestOptions = {
      method: 'POST', // Especificamos que queremos usar el método POST
    };
    const response = await fetch("/obtenerAutoresAdmin", requestOptions);

    if (!response.ok) {
      throw new Error('Error al obtener los datos desde el servidor.');
    }

    totalData = await response.json();
    setTimeout(()=>{
      totalPages = Math.ceil(totalData.length / itemsPerPage);
      goToPage(1);
    }, 1200);
    
    // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const obtenerTotalAutores = async () => {
  try {
    const requestOptions = {
      method: "POST", // Especificamos que queremos usar el método POST
    };
    const response = await fetch("/obtenerTotalAutoresAdmin", requestOptions);

    if (!response.ok) {
      throw new Error("Error al obtener los datos desde el servidor.");
    }

    let datos = await response.json();
    const totalAutores = document.getElementById("total-autores");
    totalAutores.innerHTML = `${datos[0]["total_autores"]}`;
  } catch (error) {
    console.error("Error:", error.message);
  }
};


// JAVASCRIPT PAGINACION
//----------------------------------

function generatePageNumbers(currentPage, totalPages) {
  const pageNumbersContainer = document.getElementById("page-numbers");
  let pageNumbersHTML = '';

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(startPage + 2, totalPages);

  if (endPage - startPage < 2) {
    startPage = Math.max(1, endPage - 2);
  }


  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      pageNumbersHTML += `<li class="page-item active current-page" aria-current="page"><a class="page-link">${i}</a></li>`;
    } else {
      pageNumbersHTML += `<li class="page-item"><a class="page-link" onclick="goToPage(${i})">${i}</a></li>`;
    }
  }

  pageNumbersContainer.innerHTML = pageNumbersHTML;
}

// Función para ir a una página específica
function goToPage(pageNumber) {
  currentPage = pageNumber;

  const prevPageButton = document.getElementById("prev-page-btn");
  const nextPageButton = document.getElementById("next-page-btn");


  // Actualizar los botones de navegación
  prevPageButton.style.display = (currentPage === 1) ? "none": "block";
  nextPageButton.style.display = (currentPage === totalPages) ? "none": "block";

  // Volver a generar los números de página para reflejar el cambio
  generatePageNumbers(currentPage, totalPages);

  // Mostrar los datos de la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  renderAutores(totalData.slice(startIndex, endIndex));
}

// Función para ir a la página siguiente
function nextPage() {
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
}

// Función para ir a la página anterior
function prevPage() {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
}
// JAVASCRIPT PAGINACION
//----------------------------------


function renderAutores(datos){
  const contenedorAutores = document.getElementById('contenido-autores');
  let itemsAutoresHTML = '';
  contenedorAutores.innerHTML = '';
  datos.forEach(item => {
    let idAutor = item['ID'];
    let apellidos = item['apellidos'];
    let nombres = item['nombres'];

    let nombreCompleto = apellidos !== '' ? apellidos + ', ' + nombres: nombres;
    let elemento = `
        <div class="item-autor">
            <div class="top-elements-autor">
              <img
                src="/static/autores/fotos/${idAutor}.jpg"
                alt="Foto de ${nombres} ${apellidos}"
              />
            </div>
            <div class="bottom-elements-autor">
              <div class="nombre-autor">${nombreCompleto}</div>
              <div class="d-flex">
                <button class="btn-info-autor" type="button" id="${idAutor}">
                    Leer Biografía
                </button>
                <div class="dropdown">
                <a
                class="btn-options-autor dropdown-toggle d-flex align-items-center hidden-arrow"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
                >
                    <i class="fas fa-bars"></i>
                </a>
                <ul class="dropdown-menu submenu-autor" aria-labelledby="navbarDropdownMenuAvatar">
                    <li>
                    <a href="/admin-autor-modificar?AutorID=${idAutor}" class="dropdown-item modificar-autor" id="${idAutor}">Modificar autor <i class="fas fa-feather-pointed"></i></a>
                    </li>

                    <li>
                    <a class="dropdown-item eliminar-autor" id="${idAutor}">Eliminar autor <i class="fas fa-feather-pointed"></i></a>
                    </li>
                </ul>
                </div>
              </div>
            </div>
        </div>`;
    
    itemsAutoresHTML += elemento;
  });
  contenedorAutores.innerHTML = itemsAutoresHTML;
  vinculosAutores();
}

async function abrirInfoAutor(idAutor){
    try {
        const datosEnviar = {
          "id": idAutor,
        }

        const response = await axios.post("/abrirBiografiaAdmin", { data: datosEnviar }, {
            headers: {
            "Content-Type": "application/json",
            },
        });  
        let datos = response.data;
        mostrarInfoBiografia(datos);
    } catch (error) {
        console.log(error);
    }
}


async function eliminarAutor(AutorID) {
  try {
    const datosEnviar = {
      "AutorID": AutorID,
    };

    const response = await axios.post(
      "/eliminarAutor",
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
      obtenerAutores();
      obtenerTotalAutores();
      modalInfo("El autor fue eliminado con éxito", "#00DD00");
    }
  } catch (error) {
    console.log(error);
  }
}


function vinculosAutores(){
  setTimeout(()=>{
    // Vinculos para filtrar autor
    document.querySelectorAll(".btn-info-autor").forEach((btnAutor) => {
      btnAutor.addEventListener("click", () => {
        const autorID = btnAutor.id;
        abrirInfoAutor(autorID);
      });
    });

    // Vinculo eliminar autor
    document.querySelectorAll(".eliminar-autor").forEach((autor) => {
      autor.addEventListener("click", () => {
        const autorID = autor.id;
        let formHTML = `
          <form class="form-confirm-eliminar-autor" id="form-confirm-eliminar-autor">
            <div>
              <label>¿Seguro que desea eliminar este autor?</label>
            </div>
            <div class="div-btns">
              <button type="submit" class="btn-si-eliminar-autor">Sí</button>
              <button type="button" class="btn-no-eliminar-autor" id="cerrar-modal">No</button>
            </div>
          </form>
        `;
        modalInfo(formHTML, "#07143B");

        const cerrarModal = document.getElementById("cerrar-modal");
        const formConfirmarEliminar = document.getElementById('form-confirm-eliminar-autor');
        
        cerrarModal.addEventListener("click", () => {
          const modal = document.getElementById("myModal");
          modal.style.display = "none";
        });

        formConfirmarEliminar.addEventListener('submit', (e)=>{
          e.preventDefault()
          const modal = document.getElementById("myModal");
          modal.style.display = "none";
          eliminarAutor(autorID);
        });
      });
    });
  }, 800);
}

function mostrarInfoBiografia(datos){
  const infoModal = document.getElementById('info-modal-biografia');
  let HTMLbiografia = `
      <div class="cabecera-texto-biografia">
        <div class="imagen-texto-biografia">
          <img
            src="/static/autores/fotos/${datos['ID']}.jpg"
            alt="Foto de ${datos['nombre']}"
          />
        </div>
        <div class="nombre-texto-biografia">${datos['nombre']}</div>
      </div>
      <div class="container texto-biografia">${datos['biografia']}</div>`

  infoModal.innerHTML = HTMLbiografia;
  const modalContent = document.getElementById('modal-content-autores');
  const btnModalClose = document.getElementById('btn-modal-close-biografia');

  btnModalClose.style.display = "block";
  infoModal.style.marginTop = "10px";
  infoModal.style.fontSize = "20px";
  infoModal.style.marginBottom = "30px";
  infoModal.style.color = "#07143B";

  modalContent.style.backgroundColor = "#fff";
  modalContent.style.borderTop = "15px solid #07143B";
  modalContent.style.borderBottom = "5px solid #07143B";
  modalContent.style.borderRight = "2px solid #07143B";
  modalContent.style.borderLeft = "2px solid #07143B";


  const modal = document.getElementById('myModal-biografia');
  modal.style.display = 'block';
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
    const btnSeccionAdmin = document.getElementById('btn-autores-admin');
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

    const modalBiografia = document.getElementById('myModal-biografia');
    const closeModalBtnBiografia = document.getElementsByClassName('close-biografia')[0];
    const closeModalBtnCerrarBiografia = document.getElementById('btn-modal-close-biografia');
    
    closeModalBtnBiografia.addEventListener('click', () => {
      modalBiografia.style.display = 'none';
    });

    closeModalBtnCerrarBiografia.addEventListener('click', () => {
      modalBiografia.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target == modalBiografia) {
        modalBiografia.style.display = 'none';
      }
    });

    
    obtenerAutores();   
    obtenerTotalAutores();

    const btnBuscador = document.getElementById('btn-search');
    const inputBuscador = document.getElementById('search');
    const formBuscador = document.getElementById('buscador-form');

    formBuscador.addEventListener('submit', (e)=>{
        e.preventDefault();

        let valorInputBuscador = inputBuscador.value.trim();
    
          if(valorInputBuscador === ''){
            obtenerAutores();
          } else {
              const busquedaAutores = async () => {
              try {
                  const datosEnviar = {
                    "valor": valorInputBuscador,
                  }

                  const response = await axios.post("/busquedaAutoresAdmin", { data: datosEnviar }, {
                      headers: {
                      "Content-Type": "application/json",
                      },
                  });
                  let datos = response.data;
                  console.log(datos);
                  if (datos.length === 0){
                    const contenedorLibros = document.getElementById('contenido-autores');
                    contenedorLibros.innerHTML = 'No se encontraron resultados.';
                  }
                  else {
                    totalData = datos;
                    totalPages = Math.ceil(totalData.length / itemsPerPage);
                    goToPage(1);
                  }
                  
              } catch (error) {
                  console.log(error.response.data.error);
              }
            };
            busquedaAutores();
          }
    });

    inputBuscador.addEventListener("keyup", (e)=>{
        
          let valorInputBuscador = inputBuscador.value.trim();
    
          if(valorInputBuscador === ''){
            obtenerAutores();
          } else {
              const busquedaAutores = async () => {
              try {
                  const datosEnviar = {
                    "valor": valorInputBuscador,
                  }

                  const response = await axios.post("/busquedaAutoresAdmin", { data: datosEnviar }, {
                      headers: {
                      "Content-Type": "application/json",
                      },
                  });
                  let datos = response.data;
                  console.log(datos);
                  if (datos.length === 0){
                    const contenedorLibros = document.getElementById('contenido-autores');
                    contenedorLibros.innerHTML = 'No se encontraron resultados.';
                  }
                  else {
                    totalData = datos;
                    totalPages = Math.ceil(totalData.length / itemsPerPage);
                    goToPage(1);
                  }
                  
              } catch (error) {
                  console.log(error.response.data.error);
              }
            };
            busquedaAutores();
          }
    })
});