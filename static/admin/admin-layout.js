// Función para mover al top de la página
function moverAlTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Desplazamiento suave con animación
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const btnMoverAlTop = document.getElementById('btnMoverAlTop');
    
    // Mostrar u ocultar el botón cuando se hace scroll en la página
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btnMoverAlTop.classList.add('mostrar-btnTop');
      } else {
        btnMoverAlTop.classList.remove('mostrar-btnTop');
      }
    });

    btnMoverAlTop.addEventListener('click',moverAlTop);

});