let generosDB = [];
let generosFiltrar = []; // guardar id para filtrar por género
let autorSeleccionado = 0;


// Editor texto
let sourceView = false;
let editorContent = "";
function execCommand(command) {
  document.execCommand(command, false, null);
  updateHtmlPreview();
}

function setFontSize() {
  var size = prompt("Tamaño de fuente (1-7):", "");
  if (size >= 1 && size <= 7) {
    document.execCommand("fontSize", false, size);
    updateHtmlPreview();
  } else {
    alert("Ingresa un valor válido entre 1 y 7.");
  }
}

function indentText() {
  document.execCommand("indent", false, null);
  updateHtmlPreview();
}

function outdentText() {
  document.execCommand("outdent", false, null);
  updateHtmlPreview();
}

function updateHtmlPreview() {
  var editor = document.getElementById("editor");
  if (!sourceView) {
    editorContent = editor.innerHTML;
  } else {
    editorContent = editor.textContent;
  }
}

function toggleSourceView() {
  sourceView = !sourceView;
  var editor = document.getElementById("editor");
  let btnSource = document.getElementById('btn-source');
  if (sourceView) {
    btnSource.classList.add("active");
    editor.textContent = editorContent;
  } else {
    btnSource.classList.remove("active");
    editor.innerHTML = editorContent;
  }
}
const init = () => {
  var editor = document.getElementById("editor");
  editor.textContent = editorContent;
};
init();
// Editor texto

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
      const contGenero = genero.parentNode;
      const closeGenero = contGenero.querySelector(".close-genero");
      genero.classList.add("selected-genero");

      closeGenero.style.display = "block";
      if(!generosFiltrar.includes(genero.id) ){
        generosFiltrar.push(genero.id)
      }

      closeGenero.addEventListener('click', ()=>{
        closeGenero.style.display = "none";
        genero.classList.remove("selected-genero");
        const indice = generosFiltrar.indexOf(genero.id);
        if (indice !== -1) {
          generosFiltrar.splice(indice, 1);
        }
      });
    });

});
}

async function validarLibro(titulo, AutorID) {
  try {
    const datosEnviar = {
      "titulo": titulo,
      "AutorID": AutorID
    };
    const response = await axios.post("/validarLibro", { data: datosEnviar }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    let datos = response.data;
    if (datos.length === 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
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


    const btnSeccionAdmin = document.getElementById('btn-libros-admin');
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

  const obtenerAutores = async () => {
      try {
        const requestOptions = {
          method: 'POST', // Especificamos que queremos usar el método POST
        };

        const response = await fetch("/obtenerAutoresAdmin", requestOptions);

        if (!response.ok) {
          throw new Error('Error al obtener los datos desde el servidor.');
        }

        let autoresOptions = await response.json();
        let divOptions = "";
        const options = document.getElementById('options');

        autoresOptions.forEach(autor => {
          divOptions += `<div class='option' id='${autor['ID']}'>${autor['apellidos']}, ${autor['nombres']}</div>`
        });
        options.innerHTML = divOptions;

        document.querySelectorAll(".option").forEach((option) => {
            option.addEventListener("click", () => {
              const customSelect = document.querySelector(".custom-select");
              const selectedOption = customSelect.querySelector(".selected-option-content");

              customSelect.style.backgroundColor = "#07143B";
              customSelect.style.color = '#E3E3E3';

              customSelect.id = option.id;
              selectedOption.textContent = option.textContent;

              try {
                if(isNaN(parseInt(customSelect.id))){
                  autorSeleccionado = 0;
                  throw "El ID del select no es un entero.";
                } else{
                  autorSeleccionado = parseInt(customSelect.id);
                }
              } catch (error) {
                console.log(error);
              }

              toggleOptions();
            });
        });

      } catch (error) {
        console.error('Error:', error.message);
      }
    };
    obtenerAutores();


    const obtenerGeneros = async () => {
      try {
        const requestOptions = {
          method: 'POST', // Especificamos que queremos usar el método POST
        };

        const response = await fetch("/generosAdmin", requestOptions);

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




    const formInsertarLibro = document.getElementById('form-insertar-libro');
    formInsertarLibro.addEventListener('submit', (e)=>{
        e.preventDefault();
        let errores = '';

        const inputTitulo = document.getElementById('titulo-libro-insertar');
        const inputResena = document.getElementById('editor');
        const archivoInputIMG = document.getElementById('imagen-insertar-libro');
        const archivoIMG = archivoInputIMG.files[0];

        const archivoInputPDF = document.getElementById('pdf-insertar-libro');
        const archivoPDF = archivoInputPDF.files[0];

        let titulo = inputTitulo.value.trim();
        let resena = inputResena.innerHTML;

        if(titulo == ''){
          errores += `<p>Debe escribirse un título.</p>`;
        }
        if(autorSeleccionado === 0){
          errores += `<p>Debe seleccionar un autor.</p>`;
        }
        if(resena == '' || inputResena.textContent == ''){
          errores += `<p>Debe escribirse una reseña del libro.</p>`;
        }
        if(generosFiltrar.length == 0){
          errores += `<p>Debe seleccionar al menos un genero.</p>`;
        }
        if ((!archivoIMG) || (!archivoPDF)) {
          errores += `<p>No se ha seleccionado todos los archivos.</p>`;
        }

        let generos = '-';
        generosFiltrar.forEach(genero => {
          generos += genero.toString() + '-';
        });

        let validacion = false;
        validarLibro(titulo, autorSeleccionado).then((returnedData) => {
          validacion = returnedData;
          if(validacion == false){
            errores += '<p>El libro ya existe.</p>';
          }
          if(errores == ''){
            const formData = new FormData();
            formData.append('imagen-insertar-libro', archivoIMG);
            formData.append('pdf-insertar-libro', archivoPDF);
            formData.append('AutorID', autorSeleccionado);
            formData.append('resena', resena);
            formData.append('titulo', titulo);
            formData.append("generosID", generos);

            const insertarLibro = async () => {
              try {
                const response = await fetch('/insertarLibro', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    modalInfo('El libro se ha insertado con éxito.', "#00DD00");
                    setTimeout(()=>{
                      window.location.href = '/admin-libros';
                    }, 3000);

                } else {
                    console.error('Error al enviar el archivo al backend.');
                }
              } catch (error) {
                  console.error('Error de conexión:', error);
              }
            };
            insertarLibro();
          } else{
            modalInfo(errores, "red");
          }
        });

      });

});
