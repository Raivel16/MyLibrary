let currentPage = 1;
const itemsPerPage = 20;
let totalData = [];
let totalPages = 0;


const obtenerHistorial = async () => {
    try {
      const requestOptions = {
        method: "POST", // Especificamos que queremos usar el método POST
      };
      const response = await fetch("/obtenerHistorial", requestOptions);
  
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
    renderFilas(totalData.slice(startIndex, endIndex));
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


function renderFilas(datos){
    const divFilasContenido = document.getElementById('filas-contenido');
    let itemsHistorialHTML = "";
    divFilasContenido.innerHTML = "";
    
    datos.forEach(fila => {
        let id = fila['ID'];
        let AdminID = fila['AdminID'];
        let operacion = fila['Operacion'];
        let tabla = fila['Tabla'];
        let IDregistro= fila['IDregistro'];
        let fecha = fila['Fecha'];

        let elemento = `
        <div class="fila">
            <div class="columna">${id}</div>
            <div class="columna">${AdminID}</div>
            <div class="columna">${operacion}</div>
            <div class="columna">${tabla}</div>
            <div class="columna">${IDregistro}</div>
            <div class="columna">${fecha}</div>
        </div>`;
        itemsHistorialHTML += elemento;
    });

    divFilasContenido.innerHTML = itemsHistorialHTML;
}

document.addEventListener("DOMContentLoaded", function () {
    const btnSeccionAdmin = document.getElementById("btn-historial-admin");
    btnSeccionAdmin.classList.add("active");

    obtenerHistorial();
});