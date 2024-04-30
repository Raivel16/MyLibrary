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
  editorContent = document.getElementById('biografia-txt').value;
  editor.innerHTML = editorContent;
};

// Editor texto

async function validarAutor(nombres, apellidos) {
  try {
    const datosEnviar = {
      "nombres": nombres,
      "apellidos": apellidos
    };
    const response = await axios.post("/validarAutor", { data: datosEnviar }, {
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
    
    init();
    const btnSeccionAdmin = document.getElementById('btn-autores-admin');
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

    const inputNombresORIGINAL = document.getElementById('nombres-autor-insertar');
    const inputApellidosORIGINAL = document.getElementById('apellidos-autor-insertar');

    let nombresOriginal = inputNombresORIGINAL.value.trim();
    let apellidosOriginal = inputApellidosORIGINAL.value.trim();

    const formInsertarAutor = document.getElementById('form-insertar-autor');
    formInsertarAutor.addEventListener('submit', (e)=>{
        e.preventDefault();
        let errores = '';

        const inputIDAutor = document.getElementById('id_autor');
        const inputNombres = document.getElementById('nombres-autor-insertar');
        const inputApellidos = document.getElementById('apellidos-autor-insertar');
        const inputBiografia = document.getElementById('editor');
        const archivoInputIMG = document.getElementById('imagen-insertar-autor');
        const archivoIMG = archivoInputIMG.files[0];
        
        let nombres = inputNombres.value.trim();
        let apellidos = inputApellidos.value.trim();
        let biografia = inputBiografia.innerHTML;
        let AutorID = inputIDAutor.value;

        if(nombres == ''){
          errores += `<p>Debe escribirse al menos un nombre.</p>`;
        }
        if(biografia == '' || inputBiografia.textContent == ''){
          errores += `<p>Debe escribirse una biografía del autor.</p>`;
        }
        let validacion = false;
        validarAutor(nombres, apellidos).then((returnedData) => {
          validacion = returnedData;
          if(nombresOriginal.toLowerCase() !== nombres.toLowerCase()
            || apellidosOriginal.toLowerCase() !== apellidos.toLowerCase()){
            if(validacion == false){
              errores += '<p>El autor ya existe.</p>';
            }
          }
          if(errores == ''){
            const formData = new FormData();
            if (archivoIMG){
              formData.append('imagen-insertar-autor', archivoIMG);
            }
            formData.append('AutorID', AutorID);
            formData.append('biografia', biografia);
            formData.append('biografia', biografia);
            formData.append('nombres', nombres);
            formData.append("apellidos", apellidos);

            const modificarAutor = async () => {
              try {
                const response = await fetch('/modificarAutor', {
                    method: 'POST',
                    body: formData,
                });
    
                if (response.ok) {
                    modalInfo('El autor se ha modificado con éxito.', "#00DD00");
                    setTimeout(()=>{
                      window.location.href = '/admin-autores';
                    }, 3000);
                    
                } else {
                    console.error('Error al enviar el archivo al backend.');
                }
              } catch (error) {
                  console.error('Error de conexión:', error);
              }
            };
            modificarAutor();
          } else{
            modalInfo(errores, "red");
          }
        });
       
               
      });

});
