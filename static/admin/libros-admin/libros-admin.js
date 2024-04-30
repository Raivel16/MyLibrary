let generosDB = [];
let currentPage = 1;
const itemsPerPage = 10;
let totalData = [];
let totalPages = 0;
let generosFiltrar = []; // guardar id para filtrar por género
let tipoBusqueda = 0;

const filtrarGeneroBuscador = async (generos, buscador, tipoBusqueda) => {
  try {
    const datosEnviar = {
      valor: buscador,
      tipoB: tipoBusqueda,
      generos: generos,
    };

    const response = await axios.post(
      "/busquedaLibrosAdmin",
      { data: datosEnviar },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let datos = response.data;
    if (datos.length === 0) {
      const contenedorLibros = document.getElementById("contenido-libros");
      contenedorLibros.innerHTML =
        '<span style="font-size:20px;">No se encontraron resultados.</span>';
    } else {
      totalData = datos;
      totalPages = Math.ceil(totalData.length / itemsPerPage);
      goToPage(1);
    }
  } catch (error) {
    console.log(error.response.data.error);
  }
};

const obtenerLibros = async () => {
  try {
    const requestOptions = {
      method: "POST", // Especificamos que queremos usar el método POST
    };
    const response = await fetch("/obtenerLibrosAdmin", requestOptions);

    if (!response.ok) {
      throw new Error("Error al obtener los datos desde el servidor.");
    }

    totalData = await response.json();
    setTimeout(() => {
      totalPages = Math.ceil(totalData.length / itemsPerPage);
      goToPage(1);
    }, 1200);

    // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
  } catch (error) {
    console.error("Error:", error.message);
  }
};


const obtenerTotalLibros = async () => {
  try {
    const requestOptions = {
      method: "POST", // Especificamos que queremos usar el método POST
    };
    const response = await fetch("/obtenerTotalLibrosAdmin", requestOptions);

    if (!response.ok) {
      throw new Error("Error al obtener los datos desde el servidor.");
    }

    let datos = await response.json();
    const totalLibros = document.getElementById("total-libros");
    totalLibros.innerHTML = `${datos[0]["total_libros"]}`;
  } catch (error) {
    console.error("Error:", error.message);
  }
};


const obtenerTotalVisitados = async () => {
  try {
    const requestOptions = {
      method: "POST", // Especificamos que queremos usar el método POST
    };
    const response = await fetch(
      "/obtenerTotalVisitadosAdmin",
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Error al obtener los datos desde el servidor.");
    }

    let datos = await response.json();
    const totalVisitados = document.getElementById("libros-visitados");
    totalVisitados.innerHTML = `${datos.length}`;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// JAVASCRIPT PAGINACION
//----------------------------------

function generatePageNumbers(currentPage, totalPages) {
  const pageNumbersContainer = document.getElementById("page-numbers");
  let pageNumbersHTML = "";

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
  prevPageButton.style.display = currentPage === 1 ? "none" : "block";
  nextPageButton.style.display = currentPage === totalPages ? "none" : "block";

  // Volver a generar los números de página para reflejar el cambio
  generatePageNumbers(currentPage, totalPages);

  // Mostrar los datos de la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  renderLibros(totalData.slice(startIndex, endIndex), generosDB);
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

function toggleOptions() {
  const options = document.querySelector(".options");
  const isOpen = options.style.opacity === "1";

  if (isOpen) {
    options.style.transform = "scaleY(0)";
    options.style.opacity = "0";
    setTimeout(() => (options.style.pointerEvents = "none"), 300);
  } else {
    options.style.pointerEvents = "auto";
    options.style.transform = "scaleY(1)";
    options.style.opacity = "1";
  }
}

function renderGeneros(datos) {
  const contenedorGeneros = document.getElementById("filtros-genero");
  let itemsGeneroHTML = "";

  datos.forEach((item) => {
    let id = item["ID"];
    let nombre = item["nombre"];
    let element = `
          <div class="cont-genero">
            <div class="item-genero" id="${id}">${nombre}</div>
            <div class="close-genero" id="${id}">
              <i class="fas fa-xmark"></i>
            </div>
          </div>`;
    itemsGeneroHTML += element;
  });
  contenedorGeneros.innerHTML = itemsGeneroHTML;
  document.querySelectorAll(".item-genero").forEach((genero) => {
    genero.addEventListener("click", () => {
      const inputBuscador = document.getElementById("search");
      const contGenero = genero.parentNode;
      const closeGenero = contGenero.querySelector(".close-genero");
      genero.classList.add("selected-genero");

      closeGenero.style.display = "block";
      if (!generosFiltrar.includes(genero.id)) {
        generosFiltrar.push(genero.id);
      }

      filtrarGeneroBuscador(
        generosFiltrar,
        inputBuscador.value.trim(),
        tipoBusqueda
      );

      closeGenero.addEventListener("click", () => {
        closeGenero.style.display = "none";
        genero.classList.remove("selected-genero");
        const indice = generosFiltrar.indexOf(genero.id);
        if (indice !== -1) {
          generosFiltrar.splice(indice, 1);
        }
        filtrarGeneroBuscador(
          generosFiltrar,
          inputBuscador.value.trim(),
          tipoBusqueda
        );
      });
    });
  });
}

async function filtrarGeneroUnico(id) {
  const inputBuscador = document.getElementById("search");
  inputBuscador.value = "";

  document.querySelectorAll(".item-genero").forEach((genero) => {
    const contGenero = genero.parentNode;
    const closeGenero = contGenero.querySelector(".close-genero");
    closeGenero.style.display = "none";
    genero.classList.remove("selected-genero");
    const indice = generosFiltrar.indexOf(genero.id);
    if (indice !== -1) {
      generosFiltrar.splice(indice, 1);
    }
  });
  try {
    const datosEnviar = {
      id: id,
    };
    const response = await axios.post(
      "/filtrarGeneroUnicoAdmin",
      { data: datosEnviar },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let datos = response.data;
    if (datos.length === 0) {
      const contenedorLibros = document.getElementById("contenido-libros");
      contenedorLibros.innerHTML = "No se encontraron resultados.";
    } else {
      totalData = datos;
      totalPages = Math.ceil(totalData.length / itemsPerPage);
      goToPage(1);
    }
  } catch (error) {
    console.log(error);
  }
}

async function filtrarAutor(id) {
  try {
    const datosEnviar = {
      id: id,
    };
    const response = await axios.post(
      "/filtrarAutorAdmin",
      { data: datosEnviar },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let datos = response.data;
    if (datos.length === 0) {
      const contenedorLibros = document.getElementById("contenido-libros");
      contenedorLibros.innerHTML = "No se encontraron resultados.";
    } else {
      totalData = datos;
      totalPages = Math.ceil(totalData.length / itemsPerPage);
      goToPage(1);
    }
  } catch (error) {
    console.log(error);
  }
}

async function abrirInfoAutor(idAutor) {
  try {
    const datosEnviar = {
      id: idAutor,
    };

    const response = await axios.post(
      "/abrirBiografiaAdmin",
      { data: datosEnviar },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let datos = response.data;
    mostrarInfoBiografia(datos);
  } catch (error) {
    console.log(error);
  }
}

async function eliminarLibro(LibroID) {
  try {
    const datosEnviar = {
      "LibroID": LibroID,
    };

    const response = await axios.post(
      "/eliminarLibro",
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
      obtenerLibros();
      obtenerTotalLibros();
      obtenerTotalVisitados();
      modalInfo("El libro fue eliminado con éxito", "#00DD00");
    }
  } catch (error) {
    console.log(error);
  }
}

function vinculosLibros() {
  setTimeout(() => {
    // Vinculos para filtrar autor
    document.querySelectorAll(".autor-libro").forEach((autor) => {
      autor.addEventListener("click", () => {
        const autorID = autor.id;
        filtrarAutor(autorID);
      });
    });

    // Vinculos para abrir reseña
    document.querySelectorAll(".resena-libro").forEach((libro) => {
      libro.addEventListener("click", () => {
        const libroID = libro.id;
        const mostrarResena = async () => {
          try {
            const datosEnviar = {
              id: libroID,
            };
            const response = await axios.post(
              "/obtenerResenaAdmin",
              { data: datosEnviar },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            let datos = response.data;
            contenido =
              `<h2 class="titulo-libro-resena">${datos["titulo"]}</h2>` +
              datos["resena"];
            modalInfo(contenido, "#07143B", "justify", "70%", "block");
          } catch (error) {
            console.log(error);
          }
        };
        mostrarResena();
      });
    });

    // Vinculo generos en libros
    document.querySelectorAll(".item-genero-en-libro").forEach((genero) => {
      genero.addEventListener("click", () => {
        const generoID = genero.id;
        filtrarGeneroUnico(generoID);
      });
    });

    // Vinculo abrir biografia
    document.querySelectorAll(".abrirBiografia").forEach((autor) => {
      autor.addEventListener("click", () => {
        const autorID = autor.id;
        abrirInfoAutor(autorID);
      });
    });

    // Vinculo eliminar libro
    document.querySelectorAll(".eliminar-libro").forEach((libro) => {
      libro.addEventListener("click", () => {
        const LibroID = libro.id;
        let formHTML = `
          <form class="form-confirm-eliminar-libro" id="form-confirm-eliminar-libro">
            <div>
              <label>¿Seguro que desea eliminar este libro?</label>
            </div>
            <div class="div-btns">
              <button type="submit" class="btn-si-eliminar-libro">Sí</button>
              <button type="button" class="btn-no-eliminar-libro" id="cerrar-modal">No</button>
            </div>
          </form>
        `;
        modalInfo(formHTML, "#07143B");

        const cerrarModal = document.getElementById("cerrar-modal");
        const formConfirmarEliminar = document.getElementById('form-confirm-eliminar-libro');

        cerrarModal.addEventListener("click", () => {
          const modal = document.getElementById("myModal");
          modal.style.display = "none";
        });

        formConfirmarEliminar.addEventListener('submit', (e)=>{
          e.preventDefault()
          const modal = document.getElementById("myModal");
          modal.style.display = "none";
          eliminarLibro(LibroID);
        });
      });
    });
  }, 1000);
}

function renderLibros(datos, generos) {
  const contenedorLibros = document.getElementById("contenido-libros");
  let itemsLibroHTML = "";
  contenedorLibros.innerHTML = "";
  datos.forEach((item) => {
    let idLibro = item["ID"];
    let titulo = item["titulo"];
    let generosString = item["generosID"].slice(1, -1);
    let generosIDLista = generosString.split("-");
    generosIDLista.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    let autorID = item["AutorID"];
    let nombresAutor = item["nombres"];
    let apellidosAutor = item["apellidos"];

    let generosHTML = "";
    generosIDLista.forEach((genero) => {
      generos.forEach((generoBD) => {
        if(generoBD["ID"] == genero){
          let idGenero = genero;
          let nombreGenero = generoBD["nombre"];
          let generoHTML = `<div class="item-genero-en-libro" id="${idGenero}">${nombreGenero}</div>`;
          generosHTML += generoHTML;
        }
      });
    });

    let nombre_completo_autor = apellidosAutor !== ''? apellidosAutor + ', ' + nombresAutor: nombresAutor;

    let elemento = `<div class="item-libro">
    <div class="left-elements-libros dropdown" id="${idLibro}">
      <a
        class="dropdown-toggle d-flex align-items-center hidden-arrow"
        id="navbarDropdownMenuAvatar"
        role="button"
        data-mdb-toggle="dropdown"
        aria-expanded="false"
        >
        <img src="/static/libros/portadas/${idLibro}.png" alt="Portada de ${titulo}"/>
      </a>
      <ul class="dropdown-menu submenu-imagen-libro" aria-labelledby="navbarDropdownMenuAvatar">
        <li>
          <a class="dropdown-item abrir-libro" target="_blank" href="/static/libros/pdf/${idLibro}.pdf" id="${idLibro}">Abrir libro <i class="fas fa-file-pdf"></i></a>
        </li>
        <li>
          <a href="/admin-libros-modificar?libroID=${idLibro}" class="dropdown-item modificar-libro" id='${idLibro}'>Modificar libro <i class="fas fa-file-pdf"></i></a></a>
        </li>
        <li>
          <a class="dropdown-item eliminar-libro" id='${idLibro}'>Eliminar libro <i class="fas fa-file-pdf"></i></a></a>
        </li>
        <li>
          <a class="dropdown-item btn-biografía-autor abrirBiografia" id="${autorID}"
          >Biografía del autor <i class="fas fa-feather-pointed"></i></a>
        </li>
      </ul>
    </div>
    <div class="right-elements-libros">
      <div class="div-titulo-libro">
        Título:
        <span class="titulo-libro" id=""
          >${titulo}</span
        >
      </div>
      <div class="div-autor-libro">
        Autor: <span class="autor-libro" id="${autorID}">${nombre_completo_autor}</span>
      </div>
      <div class="div-resena-libro">
        Reseña:
        <a class="resena-libro" id='${idLibro}')"
          ><i class="fas fa-square-plus"></i
        ></a>
      </div>
      <div class="div-generos-libro">
        <div class="text-div-generos-libros">Géneros:</div>
        <div class="generos-libros">
          ${generosHTML}
        </div>
      </div>
    </div>
  </div>`;

    itemsLibroHTML += elemento;
  });

  contenedorLibros.innerHTML = itemsLibroHTML;
  vinculosLibros();
}

function mostrarInfoBiografia(datos) {
  const infoModal = document.getElementById("info-modal-biografia");
  let HTMLbiografia = `
      <div class="cabecera-texto-biografia">
        <div class="imagen-texto-biografia">
          <img
            src="/static/autores/fotos/${datos["ID"]}.jpg"
            alt="Foto de ${datos["nombre"]}"
          />
        </div>
        <div class="nombre-texto-biografia">${datos["nombre"]}</div>
      </div>
      <div class="container texto-biografia">${datos["biografia"]}</div>`;

  infoModal.innerHTML = HTMLbiografia;
  const modalContent = document.getElementById("modal-content-autores");
  const btnModalClose = document.getElementById("btn-modal-close-biografia");

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

  const modal = document.getElementById("myModal-biografia");
  modal.style.display = "block";
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
  const btnSeccionAdmin = document.getElementById("btn-libros-admin");
  btnSeccionAdmin.classList.add("active");

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

  window.addEventListener("resize", function () {
    const modalContent = document.getElementById("modal-content-libros");
    const anchoPantalla = window.innerWidth;
    if (anchoPantalla < 900) {
      modalContent.style.width = "95%";
    } else {
      modalContent.style.width = "70%";
    }
  });

  const modalBiografia = document.getElementById("myModal-biografia");
  const closeModalBtnBiografia =
    document.getElementsByClassName("close-biografia")[0];
  const closeModalBtnCerrarBiografia = document.getElementById(
    "btn-modal-close-biografia"
  );

  closeModalBtnBiografia.addEventListener("click", () => {
    modalBiografia.style.display = "none";
  });

  closeModalBtnCerrarBiografia.addEventListener("click", () => {
    modalBiografia.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modalBiografia.style.display = "none";
    }
  });

  const options = document.getElementById("options");
  const btnBuscador = document.getElementById("btn-search");
  const inputBuscador = document.getElementById("search");
  const formBuscador = document.getElementById("buscador-form");

  let textOptions = [
    "Seleccionar tipo de búsqueda",
    "Título del libro",
    "Nombre del autor",
  ];

  let divOptions = "";
  for (const text in textOptions) {
    divOptions += `<div class='option' id='${text}'>${textOptions[text]}</div>`;
  }

  options.innerHTML = divOptions;

   // 1 -> por titulo ||  2 -> por autor
  document.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", () => {
      const customSelect = document.querySelector(".custom-select");
      const selectedOption = customSelect.querySelector(
        ".selected-option-content"
      );

      customSelect.style.backgroundColor = "#07143B";
      customSelect.style.color = "#E3E3E3";

      customSelect.id = option.id;
      selectedOption.textContent = option.textContent;

      tipoBusqueda = customSelect.id;

      toggleOptions();
    });
  });

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
  obtenerGeneros();



  obtenerLibros();
  obtenerTotalLibros();
  obtenerTotalVisitados();

  formBuscador.addEventListener("submit", (e) => {
    e.preventDefault();

    let valorInputBuscador = inputBuscador.value.trim();

    if (valorInputBuscador === "" && tipoBusqueda != 0) {
      modalInfo("Debe escribir en el buscador para poder buscar.", "red");
    } else if (tipoBusqueda == 0 && valorInputBuscador !== "") {
      modalInfo(
        "Debe seleccionar un tipo de busqueda para poder buscar.",
        "red"
      );
    } else {
      const busquedaLibros = async () => {
        try {
          const datosEnviar = {
            valor: valorInputBuscador,
            tipoB: tipoBusqueda,
            generos: generosFiltrar,
          };

          const response = await axios.post(
            "/busquedaLibrosAdmin",
            { data: datosEnviar },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          let datos = response.data;
          if (datos.length === 0) {
            const contenedorLibros =
              document.getElementById("contenido-libros");
            contenedorLibros.innerHTML =
              '<span style="font-size:20px;">No se encontraron resultados.</span>';
          } else {
            totalData = datos;
            totalPages = Math.ceil(totalData.length / itemsPerPage);
            goToPage(1);
          }
        } catch (error) {
          console.log(error.response.data.error);
        }
      };
      busquedaLibros();
    }
  });
});
