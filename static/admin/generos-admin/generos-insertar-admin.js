


async function validarGenero(nombre) {
  try {
    const datosEnviar = {
      "nombre": nombre
    };
    const response = await axios.post("/validarGenero", { data: datosEnviar }, {
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
    
    const btnSeccionAdmin = document.getElementById('btn-generos-admin');
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

    const formInsertarGenero = document.getElementById('form-insertar-genero');
    formInsertarGenero.addEventListener('submit', (e)=>{
        e.preventDefault();
        let errores = '';

        const inputNombres = document.getElementById('nombre-genero-insertar');
        
        let nombre = inputNombres.value.trim();

        if(nombre == ''){
          errores += `<p>Debe escribirse el nombre del genero.</p>`;
        }

        let validacion = false;
        validarGenero(nombre).then((returnedData) => {
          validacion = returnedData;
          if(validacion == false){
            errores += '<p>El genero ya existe.</p>';
          }
          if(errores == ''){
            const formData = new FormData();
            formData.append('nombre', nombre);

            const insertarGenero = async () => {
              try {
                const response = await fetch('/insertarGenero', {
                    method: 'POST',
                    body: formData,
                });
    
                if (response.ok) {
                    modalInfo('El genero se ha insertado con éxito.', "#00DD00");
                    setTimeout(()=>{
                      window.location.href = '/admin-generos';
                    }, 3000);
                    
                } else {
                    console.error('Error al enviar el archivo al backend.');
                }
              } catch (error) {
                  console.error('Error de conexión:', error);
              }
            };
            insertarGenero();
          } else{
            modalInfo(errores, "red");
          }
        });
               
      });

});
