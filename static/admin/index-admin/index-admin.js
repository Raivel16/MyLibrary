

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
      const totalVisitados = document.getElementById("libros-calificados");
      totalVisitados.innerHTML = `${datos.length}`;
    } catch (error) {
      console.error("Error:", error.message);
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

const obtenerTotalUsuarios = async () => {
    try {
      const requestOptions = {
        method: "POST", // Especificamos que queremos usar el método POST
      };
      const response = await fetch("/obtenerTotalUsuarios", requestOptions);
  
      if (!response.ok) {
        throw new Error("Error al obtener los datos desde el servidor.");
      }
  
      let datos = await response.json();
      const totalUsuarios = document.getElementById("total-usuarios");
      totalUsuarios.innerHTML = `${datos[0]["total_usuarios"]}`;
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

const obtenerTotalAdmins = async () => {
    try {
      const requestOptions = {
        method: "POST", // Especificamos que queremos usar el método POST
      };
      const response = await fetch("/obtenerTotalAdmins", requestOptions);
  
      if (!response.ok) {
        throw new Error("Error al obtener los datos desde el servidor.");
      }
  
      let datos = await response.json();
      const totalUsuarios = document.getElementById("total-admins");
      totalUsuarios.innerHTML = `${datos[0]["total_admins"]}`;
    } catch (error) {
      console.error("Error:", error.message);
    }
  };



document.addEventListener("DOMContentLoaded", function () {
    const btnSeccionAdmin = document.getElementById('btn-inicio-admin');
    btnSeccionAdmin.classList.add('active');


    obtenerTotalLibros();
    obtenerTotalVisitados();
    obtenerTotalAutores();
    obtenerTotalGeneros();
    obtenerTotalUsuarios();
    obtenerTotalAdmins();
});