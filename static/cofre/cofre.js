let generosDB = [];
let currentPage = 1;
const itemsPerPage = 10;
let totalData = [];
let totalPages = 0;
let generosFiltrar = []; // guardar id para filtrar por género
let tipoBusqueda = 0;

const filtrarGeneroBuscadorCofre = async (generos, buscador, tipoBusqueda) => {
  try {
      const datosEnviar = {
        "valor": buscador,
        "tipoB": tipoBusqueda,
        "generos": generos
      }

      const response = await axios.post("/busquedaLibrosCofre", { data: datosEnviar }, {
          headers: {
          "Content-Type": "application/json",
          },
      });
      let datos = response.data;
      if (datos.length === 0){
        const contenedorLibros = document.getElementById('contenido-libros');
            contenedorLibros.innerHTML = '<span style="font-size:20px;">No se encontraron resultados.</span>';
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

const obtenerLibrosCofre = async () => {
  try {
    const requestOptions = {
      method: 'POST', // Especificamos que queremos usar el método POST
    };
    const response = await fetch("/obtenerLibrosCofre", requestOptions);

    if (!response.ok) {
      throw new Error('Error al obtener los datos desde el servidor.');
    }

    totalData = await response.json();
    if (totalData.length != 0){
        setTimeout(()=>{
        totalPages = Math.ceil(totalData.length / itemsPerPage);
        goToPage(1);
        }, 1200);
    } else {
        const contenedorLibros = document.getElementById('contenido-libros');
        contenedorLibros.innerHTML = '<span style="font-size:20px;">Usted no cuenta aún con libros en su Cofre Literario.</span>';
    }

    // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
  } catch (error) {
    console.error('Error:', error.message);
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

function renderGeneros(datos){
  const contenedorGeneros = document.getElementById('filtros-genero');
  let itemsGeneroHTML = '';

  datos.forEach(item => {
    let id = item['ID'];
    let nombre = item['nombre'];
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
      const inputBuscador = document.getElementById('search');
      const contGenero = genero.parentNode;
      const closeGenero = contGenero.querySelector(".close-genero");
      genero.classList.add("selected-genero");

      closeGenero.style.display = "block";
      if(!generosFiltrar.includes(genero.id) ){
        generosFiltrar.push(genero.id)
      }

      filtrarGeneroBuscadorCofre(generosFiltrar, inputBuscador.value.trim(), tipoBusqueda);

      closeGenero.addEventListener('click', ()=>{
        closeGenero.style.display = "none";
        genero.classList.remove("selected-genero");
        const indice = generosFiltrar.indexOf(genero.id);
        if (indice !== -1) {
          generosFiltrar.splice(indice, 1);
        }
        filtrarGeneroBuscadorCofre(generosFiltrar, inputBuscador.value.trim(), tipoBusqueda);
      });
    });

});
}

async function filtrarGeneroUnicoCofre(id){
    const inputBuscador = document.getElementById('search');
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
      "id": id,
    };
    const response = await axios.post("/filtrarGeneroUnicoCofre", { data: datosEnviar }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    let datos = response.data;
    if (datos.length === 0) {
      const contenedorLibros = document.getElementById('contenido-libros');
      contenedorLibros.innerHTML = 'No se encontraron resultados.';
    } else {
      totalData = datos;
      totalPages = Math.ceil(totalData.length / itemsPerPage);
      goToPage(1);
    }
  } catch (error) {
    console.log(error);
  }
}

async function filtrarAutorCofre(id) {
  try {
    const datosEnviar = {
      "id": id,
    };
    const response = await axios.post("/filtrarAutorCofre", { data: datosEnviar }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    let datos = response.data;
    if (datos.length === 0) {
      const contenedorLibros = document.getElementById('contenido-libros');
      contenedorLibros.innerHTML = 'No se encontraron resultados.';
    } else {
      totalData = datos;
      totalPages = Math.ceil(totalData.length / itemsPerPage);
      goToPage(1);
    }
  } catch (error) {
    console.log(error);
  }
}

async function validarCalificacion(id){
  try {
    const datosEnviar = {
      "id": id,
    };
    const response = await axios.post("/validarCalificacion", { data: datosEnviar }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    let datos = response.data;
    if (datos.length === 0) {
      contenidoCalificacion = `
      <h2>Califique al libro</h2>
      <div class="d-flex justify-content-center stars">
      <form id="form-calificacion-libro">
        <input class="star star-5" id="star-5" type="radio" name="star" value="5"/>
        <label class="star star-5" for="star-5"></label>

        <input class="star star-4" id="star-4" type="radio" name="star" value="4"/>
        <label class="star star-4" for="star-4"></label>

        <input class="star star-3" id="star-3" type="radio" name="star" value="3"/>
        <label class="star star-3" for="star-3"></label>

        <input class="star star-2" id="star-2" type="radio" name="star" value="2"/>
        <label class="star star-2" for="star-2"></label>

        <input class="star star-1" id="star-1" type="radio" name="star" value="1"/>
        <label class="star star-1" for="star-1"></label>
        <button class="btn-modal-calificar" id="btn-modal-calificar" type="submit">Enviar</button>
      </form>
    </div>`;
      modalInfo(contenidoCalificacion, "#07143B", "center", "400px");
      const formCalificacionLibro = document.getElementById('form-calificacion-libro');
        formCalificacionLibro.addEventListener('submit', (e)=>{
          e.preventDefault()
          let calificacion = formCalificacionLibro.querySelector('input[name="star"]:checked');
          if (calificacion) {
            let calificacionValor = calificacion.value;
            guardarCalificacion(calificacionValor, id);
          }
        });
    }
  } catch (error) {
    console.log(error);
  }
}


async function guardarCalificacion(calificacion, id_libro){
  try {
    const datosEnviar = {
      "id_libro": id_libro,
      "calificacion": calificacion
    };
    const response = await axios.post("/guardarCalificacion", { data: datosEnviar }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';

  } catch (error) {
    console.log(error);
  }
}

async function eliminarLibroCofre(id_libro){
  try {
    const datosEnviar = {
      "id_libro": id_libro,
    };
    const response = await axios.post("/eliminarLibroCofre", { data: datosEnviar }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    let datos = response.data;
    if (datos.length === 0) {
      modalInfo("Ha ocurrido un error al eliminar", "red")
    } else {
      obtenerLibrosCofre();
      modalInfo("El libro fue eliminado con éxito de su cofre literario", "#00DD00")
    }

  } catch (error) {
    console.log(error);
  }
}


async function abrirInfoAutor(idAutor){
  try {
      const datosEnviar = {
        "id": idAutor,
      }

      const response = await axios.post("/abrirBiografia", { data: datosEnviar }, {
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

async function actualizarNotas(textoNotas, idLibro){
  try {
      const datosEnviar = {
        "id_Libro": idLibro,
        "textoNotas": textoNotas
      }

      const response = await axios.post("/actualizarNotas", { data: datosEnviar }, {
          headers: {
          "Content-Type": "application/json",
          },
      });
      const modal = document.getElementById('myModal');
      modal.style.display = 'none';
  } catch (error) {
      console.log(error);
  }
}


function vinculosLibrosCofre(){
  setTimeout(()=>{
    // Vinculos para filtrar autor
    document.querySelectorAll(".autor-libro").forEach((autor) => {
      autor.addEventListener("click", () => {
        const autorID = autor.id;
        filtrarAutorCofre(autorID);
      });
    });

    // Vinculos para abrir reseña
    document.querySelectorAll(".resena-libro").forEach((libro) =>{
      libro.addEventListener("click", () => {
        const libroID = libro.id;
        const mostrarResena = async ()=>{
          try {
            const datosEnviar = {
              "id": libroID,
            };
            const response = await axios.post("/obtenerResena", { data: datosEnviar }, {
              headers: {
                "Content-Type": "application/json",
              },
            });

            let datos = response.data;
            contenido = `<h2 class="titulo-libro-resena">${datos['titulo']}</h2>` + datos['resena'];
            modalInfo(contenido, "#07143B", "justify", "70%", "block");
          } catch (error) {
            console.log(error);
          }
        }
        mostrarResena();
      });
    });

    // Vinculo generos en libros
    document.querySelectorAll(".item-genero-en-libro").forEach((genero) => {
      genero.addEventListener("click", () => {
        const generoID = genero.id;
        filtrarGeneroUnicoCofre(generoID);
      });
    });

    // Vinculo abrir libro
    document.querySelectorAll(".abrir-libro").forEach((libro) => {
      libro.addEventListener("click", () => {
        const libroID = libro.id;
        let validacion = false;
        validarCalificacion(libroID);
      });
    });

    // Vinculo guardar libro
    document.querySelectorAll(".eliminar-libro-cofre").forEach((libroCofre) => {
      libroCofre.addEventListener("click", () => {
        const libroID = libroCofre.id;
        eliminarLibroCofre(libroID);
      })
    });

    // Vinculo abrir biografia
    document.querySelectorAll(".abrirBiografia").forEach((autor) => {
      autor.addEventListener("click", () => {
        const autorID = autor.id;
        abrirInfoAutor(autorID);
      })
    });
  }, 1000);

  //POR AQUI
  // Vinculos para notas libro cofre
  document.querySelectorAll(".notas-libro-cofre").forEach((libro) =>{
    libro.addEventListener("click", () => {
      const libroID = libro.id;
      const mostrarNotas = async ()=>{
        try {
          const datosEnviar = {
            "id": libroID,
          };
          const response = await axios.post("/obtenerNotasLibroCofre", { data: datosEnviar }, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          let datos = response.data;
          let notas = (datos['Notas'] == null) || (datos['Notas'] == '')?"Sin notas aún.":datos['Notas'];
          contenidoNotas = `
          <h2>Notas</h2>
          <h5>Ultima visita: ${datos['ultimaVisita']}</h5>
          <div class="d-flex justify-content-center div-notas-cofre">

            <form class="form-notas-libro" id="form-notas-libro">
              <input type="hidden" id="id-libro" name="" value="${datos['LibroID']}">
              <textarea class="textarea-notas" id="textarea-notas" name="notas">${notas}</textarea>
              <button class="btn-modal-notas" id="btn-modal-notas" type="submit">Guardar</button>
            </form>
          </div>`;
          modalInfo(contenidoNotas, "#07143B", "justify", "70%");

          const formNotasLibro = document.getElementById('form-notas-libro');
          formNotasLibro.addEventListener('submit', (e)=>{
            e.preventDefault();
            const textareaNotas = document.getElementById('textarea-notas');
            const inputHidden = document.getElementById('id-libro');
            const idLibro = inputHidden.value;
            const textoNotas = textareaNotas.value;
            actualizarNotas(textoNotas,idLibro);
          });
        } catch (error) {
          console.log(error);
        }
      }
      mostrarNotas();
    });
  });

}


function renderLibros(datos, generos){
  const contenedorLibros = document.getElementById('contenido-libros');
  let itemsLibroHTML = '';
  contenedorLibros.innerHTML = '';
  datos.forEach(item => {
    let idLibro = item['ID'];
    let titulo = item['titulo'];
    let generosString = item['generosID'].slice(1,-1);
    let generosIDLista = generosString.split('-');
    generosIDLista.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    let autorID = item['AutorID'];
    let nombresAutor = item['nombres'];
    let apellidosAutor = item['apellidos'];

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
          <a class="dropdown-item notas-libro-cofre" id="${idLibro}"
          >Notas <i class="fas fa-note-sticky"></i></a>
        </li>
        <li>
          <a class="dropdown-item eliminar-libro-cofre" id='${idLibro}'>Eliminar de <svg
            xmlns="http://www.w3.org/2000/svg"
            id="pagCofre"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            width="512"
            height="512"
            class="icono-cofre-libro"
          >
            <path
              d="M6,.072c.327-.047,.661-.072,1-.072h10c.339,0,.673,.025,1,.072V9h-3c0-1.654-1.346-3-3-3s-3,1.346-3,3h-3V.072Zm14,8.928h4v-2c0-2.787-1.637-5.198-4-6.324V9Zm-5,2v1c0,1.654-1.346,3-3,3s-3-1.346-3-3v-1H0v8c0,2.414,1.721,4.435,4,4.899V14c0-.552,.447-1,1-1s1,.448,1,1v10h12V14c0-.552,.447-1,1-1s1,.448,1,1v9.899c2.279-.465,4-2.485,4-4.899V11H15Zm-11-2V.676C1.637,1.802,0,4.213,0,7v2H4Zm8,4c.552,0,1-.449,1-1v-3c0-.551-.448-1-1-1s-1,.449-1,1v3c0,.551,.448,1,1,1Z"
            />
          </svg></a>
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
        Autor: <span class="autor-libro" id="${autorID}">${apellidosAutor}, ${nombresAutor}</span>
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
  vinculosLibrosCofre();
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
    const btnPagina = document.getElementById('pagCofre');
    const navItemPagina = document.getElementById('nav-itemCofre');

    btnPagina.classList.add('icono-cofre-active');
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

    window.addEventListener('resize', function() {
      const modalContent = document.getElementById('modal-content-libros');
      const anchoPantalla = window.innerWidth;
      if(anchoPantalla < 900){
        modalContent.style.width = "95%"
      } else {
        modalContent.style.width = "70%"
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

    const options = document.getElementById('options');
    const btnBuscador = document.getElementById('btn-search');
    const inputBuscador = document.getElementById('search');
    const formBuscador = document.getElementById('buscador-form');


    let textOptions = ["Seleccionar tipo de búsqueda", "Título del libro","Nombre del autor"];

    let divOptions = ""
    for (const text in textOptions) {
        divOptions += `<div class='option' id='${text}'>${textOptions[text]}</div>`
    }

    options.innerHTML = divOptions;


     // 1 -> por titulo ||  2 -> por autor
    document.querySelectorAll(".option").forEach((option) => {
        option.addEventListener("click", () => {
          const customSelect = document.querySelector(".custom-select");
          const selectedOption = customSelect.querySelector(".selected-option-content");

          customSelect.style.backgroundColor = "#07143B";
          customSelect.style.color = '#E3E3E3';

          customSelect.id = option.id;
          selectedOption.textContent = option.textContent;

          tipoBusqueda = customSelect.id;

          toggleOptions();
        });
    });


    const obtenerGeneros = async () => {
      try {
        const requestOptions = {
          method: 'POST', // Especificamos que queremos usar el método POST
        };

        const response = await fetch("/generos", requestOptions);

        if (!response.ok) {
          throw new Error('Error al obtener los datos desde el servidor.');
        }

        generosDB = await response.json();
        renderGeneros(generosDB);

        // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
    obtenerGeneros();


    obtenerLibrosCofre();

    formBuscador.addEventListener('submit', (e)=>{
      e.preventDefault();

      let valorInputBuscador = inputBuscador.value.trim();

      if(valorInputBuscador === '' && tipoBusqueda != 0){
        modalInfo("Debe escribir en el buscador para poder buscar.", "red");
      } else if(tipoBusqueda == 0 && valorInputBuscador !== ''){
        modalInfo("Debe seleccionar un tipo de busqueda para poder buscar.", "red");
      } else {
        const busquedaLibrosCofre = async () => {
          try {
              const datosEnviar = {
                "valor": valorInputBuscador,
                "tipoB": tipoBusqueda,
                "generos": generosFiltrar
              }

              const response = await axios.post("/busquedaLibrosCofre", { data: datosEnviar }, {
                  headers: {
                  "Content-Type": "application/json",
                  },
              });
              let datos = response.data;
              if (datos.length === 0){
                const contenedorLibros = document.getElementById('contenido-libros');
                contenedorLibros.innerHTML = '<span style="font-size:20px;">No se encontraron resultados.</span>';

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
        busquedaLibrosCofre();
      }
    });

});