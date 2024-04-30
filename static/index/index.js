
let generosDB = [];



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
      obtenerLibrosVisitas();
      obtenerLibrosAñadidos();
      obtenerAutoresIndex();
      obtenerLibrosCalificados();
      obtenerLibrosCofreIndex();
      // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

const obtenerLibrosVisitas = async () => {
    try {
      const requestOptions = {
        method: 'POST', // Especificamos que queremos usar el método POST
      };
      const response = await fetch("/obtenerLibrosVisitas", requestOptions);

      if (!response.ok) {
        throw new Error('Error al obtener los datos desde el servidor.');
      }

      let datos = await response.json();
      renderLibros(datos, generosDB, 'contenedor-libros-visitas');

      // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

const obtenerLibrosAñadidos = async () => {
    try {
      const requestOptions = {
        method: 'POST', // Especificamos que queremos usar el método POST
      };
      const response = await fetch("/obtenerLibrosAñadidos", requestOptions);

      if (!response.ok) {
        throw new Error('Error al obtener los datos desde el servidor.');
      }

      let datos = await response.json();
      renderLibros(datos, generosDB, 'contenedor-libros-añadidos');

      // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
    } catch (error) {
      console.error('Error:', error.message);
    }
};

const obtenerLibrosCalificados = async () => {
    try {
      const requestOptions = {
        method: 'POST', // Especificamos que queremos usar el método POST
      };
      const response = await fetch("/obtenerLibrosCalificados", requestOptions);

      if (!response.ok) {
        throw new Error('Error al obtener los datos desde el servidor.');
      }

      let datos = await response.json();
      renderLibros(datos, generosDB, 'contenedor-libros-calificados');

      // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
    } catch (error) {
      console.error('Error:', error.message);
    }
};

const obtenerLibrosCofreIndex = async () => {
    try {
      const requestOptions = {
        method: 'POST', // Especificamos que queremos usar el método POST
      };
      const response = await fetch("/obtenerLibrosCofreIndex", requestOptions);

      if (!response.ok) {
        throw new Error('Error al obtener los datos desde el servidor.');
      }

      let datos = await response.json();
      if(datos.length === 0){
        const contenedorLibros = document.getElementById('contenedor-libros-cofre');
        contenedorLibros.innerHTML = '<span style="font-size:20px;">Usted no cuenta aún con libros en su Cofre Literario.</span>';
      }
      else {
        renderLibros(datos, generosDB, 'contenedor-libros-cofre');
      }
      vinculosLibros();
      // Aquí puedes hacer algo más con los datos recibidos, como mostrarlos en la página o procesarlos.
    } catch (error) {
      console.error('Error:', error.message);
    }
};

const obtenerAutoresIndex = async () => {
    try {
      const requestOptions = {
        method: 'POST', // Especificamos que queremos usar el método POST
      };
      const response = await fetch("/obtenerAutoresIndex", requestOptions);

      if (!response.ok) {
        throw new Error('Error al obtener los datos desde el servidor.');
      }

      let datos = await response.json();
      renderAutores(datos);

    } catch (error) {
      console.error('Error:', error);
    }
  };

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

async function guardarLibroCofre(id_libro){
    try {
      const datosEnviar = {
        "id_libro": id_libro,
      };
      const response = await axios.post("/guardarLibroCofre", { data: datosEnviar }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      let datos = response.data;
      if (datos.length === 0) {
        modalInfo("El libro ya existe en su cofre literario.", "red")
      } else {
        modalInfo("El libro fue guardado con éxito en su cofre literario", "#00DD00")
        setTimeout(()=>{window.location.href = '/'}, 1500);
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


function renderLibros(datos, generos, contenedor){
    const contenedorLibros = document.getElementById(contenedor);
    let itemsLibroHTML = '';
    contenedorLibros.innerHTML = '';
    let ranking = 1;
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

      let nombre_completo_autor = apellidosAutor !== ''? apellidosAutor + ', ' + nombresAutor: nombresAutor;

      let elemento = `<div class="item-libro">
      <div class="left-elements-libros dropdown" id="${idLibro}">
        <div class="ranking-libro">${ranking}</div>
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
            <a class="dropdown-item guardar-libro-cofre" id='${idLibro}'>Guardar en <svg
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
    ranking++;
    });

    contenedorLibros.innerHTML = itemsLibroHTML;
}

function renderAutores(datos){
    const contenedorAutores = document.getElementById('contenedor-autores');
    let itemsAutoresHTML = '';
    contenedorAutores.innerHTML = '';
    let ranking = 1;
    datos.forEach(item => {
      let idAutor = item['ID'];
      let apellidos = item['apellidos'];
      let nombres = item['nombres'];

      let nombreCompleto = apellidos !== '' ? apellidos + ', ' + nombres: nombres;
      let elemento = `
          <div class="item-autor">
            <div class="ranking-autor">${ranking}</div>
              <div class="top-elements-autor">

                <img
                  src="/static/autores/fotos/${idAutor}.jpg"
                  alt="Foto de ${nombres} ${apellidos}"
                />
              </div>
              <div class="bottom-elements-autor">
                <div class="nombre-autor">${nombreCompleto}</div>
                <button class="btn-info-autor" type="button" id="${idAutor}">
                  Leer Biografía
                </button>
              </div>
          </div>`;

      itemsAutoresHTML += elemento;
      ranking++;
    });
    contenedorAutores.innerHTML = itemsAutoresHTML;
    vinculosAutores();
}

function vinculosLibros(){
    setTimeout(()=>{

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


      // Vinculo abrir libro
      document.querySelectorAll(".abrir-libro").forEach((libro) => {
        libro.addEventListener("click", () => {
          const libroID = libro.id;
          let validacion = false;
          validarCalificacion(libroID);

        });
      });

      // Vinculo guardar libro
      document.querySelectorAll(".guardar-libro-cofre").forEach((libroCofre) => {
        libroCofre.addEventListener("click", () => {
          const libroID = libroCofre.id;
          guardarLibroCofre(libroID);
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
    const btnPagina = document.getElementById('pagInicio');
    const navItemPagina = document.getElementById('nav-itemInicio');

    btnPagina.classList.add('active');
    navItemPagina.classList.add('navItem-active');

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
      if (event.target == modal) {
        modalBiografia.style.display = 'none';
      }
    });

    obtenerGeneros();

});