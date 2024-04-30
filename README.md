# MyLibrary
## Video Demo:  https://youtu.be/n8UlnL1xYts
## Description:

Este es mi proyecto final para el curso CS50. Se trata de una aplicación web que ofrece una colección de libros para descargar. Cada libro viene con detalles como su género, una breve reseña y la biografía del autor. El proyecto utiliza HTML, CSS y JavaScript en el frontend, mientras que el backend está desarrollado en Python con Flask. La base de datos utilizada es SQLite. Además, la aplicación incluye una interfaz de administración para subir libros de manera rápida y dinámica.

## Funcionamiento

A continuación, se presenta una guía detallada sobre cómo navegar y utilizar las diferentes páginas de la aplicación web de descarga de libros.

### Vista **Usuario**

#### Página _Iniciar Sesión_

Al intentar visitar cualquier ruta URL que tenga relacion con la aplicación se validará si el usuario ya ha iniciado sesión, de lo contrario se le redirigirá a la página de iniciar sesión.

Este proceso de validación se encuentra contemplado en el archivo [app.py](app.py), el cual comprueba antes de acceder a cualquier ruta de la aplicación si ya existe una sesión creada. Esto se logra mediante el uso de un decorador de función el cual se encuentra definido en el archivo [funciones.py](funciones.py) y es importado desde el archivo [app.py](app.py).

##### Iniciar Sesión

El proceso de inicio de sesión es sencillo solo se pide un nombre de usuario y contraseña que ya esté registrado en la base de datos. Si aun no posee una cuenta puede registrar una haciendo click en donde dice **Registrate aquí** y se intercambiará el formulario de **Iniciar Sesión** por el de **Crear cuenta**.

##### Registrarse

El formulario de **Crear cuenta** es igual de sencillo. Solo se le pide un nombre de usuario, que se validará si no existe uno igual, y una contraseña la cual debe repetir. La contraseña se valida y debe contar con Precencia de Mayusculas, Minúsculas, números y caracteres especiales. Además debe de ser de 8 caracteres como mínimo.

##### Estilos y lógica

La página de login utiliza el template [login.html](templates/login.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/login** mediante el método **GET**. Los estilos que dan un aspecto agradable a esta página se encuentran en el archivo [login.css](static/login/login.css). Esta página también utiliza el archivo [login.js](static/login/login.js) para validar la información de los formularios de inicio de sesión y de crear cuenta para posteriormente enviar los datos al backend mediante el método **POST** a las rutas **/login** y **/register** las cuales tienen funciones encargadas de recibir esos datos y validarlos nuevamente para crear una sesion o una cuenta junto con una nueva sesion en dependencia de cual sea la ruta.

#### Página _Inicio_

La página de inicio nos muestra un menú superior con botones para acceder a las diferentes secciones que nos brinda la aplicación web (Inicio, Libros, Autores, Mi cofre literario, Perfil).

Esta página solo tiene el fin de brindar información relevante que puede ayudar al usuario a decidirse a leer un libro u otro o un autor determinado.

La página nos muestra 5 secciones.

##### Libros con más visitas

En esta sección nos muestra los diez libros que más visitas han recibido hasta el momento por diferentes usuario, empezando por el más visitado. Esto lo determinamos comprobando todas las visitas de los usuarios a libros y sumando las mismas.

##### Top 10 autores más leidos

Como su nombre indica en esta sección se muestran los diez autores presentes en la aplicación que más están siendo leidos por los usuarios. Esto lo determinamos comprobando todas las visitas de los usuarios a libros escritos por estos autores y realizando una suma de las mismas.

##### Últimos libros añadidos

En esta sección se muestran los últimos 10 libros añadidos a la aplicación.

##### Libros mejor calificados

En esta sección se muestran los 10 libros mejor calificados por los usuarios al momento de abrirlos por primera vez. Esto se logra calculando un promedio de calificacion por cada libro y ordenandolos despúes empezando por el que tiene mayor promedio.

##### Mi Cofre Literario

En esta sección se muestran los libros que el usuario tiene actualmente guardado en su Cofre Literario. De no tener ninguno se muestra una información de que el usuario aún no posee libros en su cofre.

##### Libros y autores que se muestran

Todos los libros mostrados en está página nos brindan la opcion de abrirlos, calificarlos, acceder a la biografia de su autor, acceder a la reseña del libro y de añadirlos a el cofre literario individual de cada usuario. También los autores que se muestran en esta página nos brindan la posibilidad de acceder a sus biografías.

Para poder abrir los libros, acceder a la biografia de su autor o añadirlos a el cofre literario, se debe presionar sobre la imagen de la portada del libro para que se despliegue un menu con estas opciones.

##### Estilos y lógica

La página de inicio utiliza el template [index.html](templates/index.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/**. Este template utiliza también el template [layout.html](templates/layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [index.css](static/index/index.css) y [styles.css](static/styles.css). Esta página también utiliza los archivos [index.js](static/index/index.js), [layout.js](static/layout.js) y [main.js](static/navbar/main.js) para darle dinamismo a la página. En el archivo **index.js** se hacen peticiones asíncronas para obtener los libros y autores que se van a mostrar de forma dinámica en cada sección de la página de inicio.


#### Página _Libros_

La página de libros nos muestra el mismo menú que podemos observar en la página de inicio.

En está pagina se muestran todos los libros disponibles en la aplicación web. Se muestran de 10 en 10 mediante unos botones en la parte inferior los cuales nos muestran los números de las cantidad de páginas que hay con libros.

Todos los libros mostrados en está página nos brindan la opcion de abrirlos, calificarlos, acceder a la biografia de su autor, acceder a la reseña del libro y de añadirlos a el cofre literario individual de cada usuario. Además nos muestran los géneros a los que pertenece el libro.

Para poder abrir los libros, acceder a la biografia de su autor o añadirlos a el cofre literario, se debe presionar sobre la imagen de la portada del libro para que se despliegue un menu con estas opciones.

##### Búsquedas y filtros

La página cuenta con un buscador para hacer dos tipos de búsqueda: por el título del libro y por el nombre del autor. Además cuenta con todos los géneros presentes en la aplicación con los que se han clasificados los libros para también filtrar a estos por uno o varios géneros. Tambíen en cada libro donde aparece el autor podemos hacer click para filtrar por ese autor. Además podemos filtrar por un solo género haciendo click en el género que aparece en un libro en particular.

##### Estilos y lógica

La página de libros utiliza el template [libros.html](templates/libros.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/libros**. Este template utiliza también el template [layout.html](templates/layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [libros.css](static/libros/libros.css) y [styles.css](static/styles.css). Esta página también utiliza los archivos [libros.js](static/libros/libros.js), [layout.js](static/layout.js) y [main.js](static/navbar/main.js) para darle dinamismo a la página. En el archivo **libros.js** se hacen peticiones asíncronas al servidor para obtener la información de los libros de la base de datos ya sea al entrar por primera vez a la página, o al hacer una búsqueda. También se hacen peticiones cuando se realizan las acciones mencionadas anteriormente en cada libro.


#### Página _Autores_

La página de autores nos muestra el mismo menú que podemos observar en las páginas anteriores.

En está pagina se muestran todos los autores disponibles en la aplicación web. Se muestran de 10 en 10 mediante unos botones en la parte inferior los cuales nos muestran los números de las cantidad de páginas que hay con autores.

Todos los autores mostrados en está página nos brindan la opcion de acceder a su biografía al presionar en el botón de **Leer Biografía**.

##### Búsqueda

La página cuenta con un buscador para hacer una búsqueda escribiendo el nombre del autor del cual desea obtener la biografía.

##### Estilos y lógica

La página de autores utiliza el template [autores.html](templates/autores.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/autores**. Este template utiliza también el template [layout.html](templates/layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [autores.css](static/autores/autores.css) y [styles.css](static/styles.css). Esta página también utiliza los archivos [libros.js](static/autores/autores.js), [layout.js](static/layout.js) y [main.js](static/navbar/main.js) para darle dinamismo a la página. En el archivo **autores.js** se hacen peticiones asíncronas al servidor para obtener la información de los autores de la base de datos ya sea al entrar por primera vez a la página, o al hacer una búsqueda. También se hacen peticiones para obtener la información de su biografía.

#### Página _Mi Cofre Literario_

La página de autores nos muestra el mismo menú que podemos observar en las páginas anteriores.

Está página nos muestra los libros que los usuarios han marcado para guardar en su cofre.

Todos los libros mostrados en está página nos brindan la opcion de abrirlos, calificarlos, acceder a la biografia de su autor, acceder a la reseña del libro, de eliminarlos del cofre literario individual de cada usuario y acceder a notas escritas por el usuario para cada libro individual. Además nos muestran los géneros a los que pertenece el libro.

Para poder abrir los libros, acceder a la biografia de su autor, eliminarlos del cofre literario o leer/escribir las notas, se debe presionar sobre la imagen de la portada del libro para que se despliegue un menu con estas opciones.

##### Busquedas y filtros

La página cuenta con un buscador el cual funciona igual que en la página de libros, con la diferencia de que las busquedas solo serán realizadas en base a los libros que posea en su cofre.

##### Estilos y lógica

La página de mi cofre literario utiliza el template [cofre.html](templates/cofre.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/cofre**. Este template utiliza también el template [layout.html](templates/layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [cofre.css](static/cofre/cofre.css) y [styles.css](static/styles.css). Esta página también utiliza los archivos [cofre.js](static/cofre/cofre.js), [layout.js](static/layout.js) y [main.js](static/navbar/main.js) para darle dinamismo a la página. En el archivo **cofre.js** se hacen peticiones asíncronas al servidor para obtener la información de los libros de la base de datos ya sea al entrar por primera vez a la página, o al hacer una búsqueda. También se hacen peticiones cuando se realizan las acciones mencionadas anteriormente en cada libro.

#### Página _Perfil_

La página de perfil nos muestra el mismo menú que podemos observar en las páginas anteriores.

En esta página se muestran datos estadísticos sobre la actividad del usuario en la aplicación web. Estos datos son el Total de libros calificados por el usuario, el Total de libros en su Cofre actualmente, y Total de autores leidos por el usuario hasta el momento.

También se muestra la opción de desplegar un formulario para modificar la cuenta del usuario ya sea cambiando el nombre de usuario, su contraseña o ambos.

##### Estilos y lógica

La página de perfil utiliza el template [perfil.html](templates/perfil.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/perfil**. Este template utiliza también el template [layout.html](templates/layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [perfil.css](static/perfil/perfil.css) y [styles.css](static/styles.css). Esta página también utiliza los archivos [perfil.js](static/perfil/perfil.js), [layout.js](static/layout.js) y [main.js](static/navbar/main.js) para darle dinamismo a la página. En el archivo **perfil.js** se hacen peticiones asíncronas al servidor para obtener la información de la cuenta del usuario y los datos estadísticos de su actividad en la aplicación web. También se valida la información del formulario cuando se desea modificar el nombre de usuario o la contraseña.


### Vista **Admin**

#### Página _Iniciar Sesión_

Al intentar visitar cualquier ruta URL que tenga relacion con la aplicación se validará si el usuario ya ha iniciado sesión (en admin), de lo contrario se le redirigirá a la página de iniciar sesión (admin).

Este proceso de validación se encuentra contemplado en el archivo [app.py](app.py), el cual comprueba antes de acceder a cualquier ruta de la aplicación si ya existe una sesión creada. Esto se logra mediante el uso de un decorador de función el cual se encuentra definido en el archivo [funciones.py](funciones.py) y es importado desde el archivo [app.py](app.py).

##### Iniciar Sesión

El proceso de inicio de sesión es sencillo solo se pide un nombre de usuario y contraseña que ya esté registrado en la base de datos. Esta cuentas solos son creadas por los admins que ya tengan acceso. Solo los admins pueden acceder a la parte de administración de la aplicación.

##### Estilos y lógica

La página de login utiliza el template [login-admin.html](templates/admin/login-admin.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/login-admin** mediante el método **GET**. Los estilos que dan un aspecto agradable a esta página se encuentran en el archivo [login-admin.css](static/admin/login-admin/login-admin.css). Esta página también utiliza el archivo [login-admin.js](static/admin/login-admin/login-admin.js) para validar la información del formulario de inicio de sesión para posteriormente enviar los datos al backend mediante el método **POST** a la ruta **/login-admin** las cual tiene una funcion encargada de recibir esos datos y validarlos nuevamente para crear una sesion.

#### Página _Inicio_

La página de inicio nos muestra un menú en la parte izquierda con botones para acceder a las diferentes secciones que nos brinda la administración de la aplicación web (Inicio, Libros, Autores, Generos, Usuarios e Historial).

En la página de inicio se muestran datos estadísticos sobre la aplicación. Estos datos son:
- Total de libros insertados en la aplicación web.
- Total de Libros calificados en la aplicación web.
- Total de autores insertados en la aplicación web.
- Total de géneros insertados en la aplicación web.
- Total de usuarios registrados en la aplicación web.
- Total de admins que actualmente puede insertar, modificar o eliminar registros de la aplicación web.

##### Estilos y lógica

La página de inicio utiliza el template [admin-index.html](templates/admin/admin-index.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [index-admin.css](static/admin/index-admin/index-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [index-admin.js](static/admin/index-admin/index-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **index-admin.js** se hacen peticiones asíncronas al servidor para obtener la información de los datos estadísticos de la aplicación web mencionados anteriormente.


#### Página _Libros_

La página de libros nos muestra el mismo menú que podemos observar en la página de inicio.

En la página se muestran datos estadísticos sobre los libros presentes en la aplicación web. Estos datos son:
- Total de libros insertados en la aplicación web.
- Total de Libros calificados en la aplicación web.

También se muestra un botón para poder insertar un nuevo libro.

Además se muestran todos los libros disponibles en la aplicación web. Se muestran de 10 en 10 mediante unos botones en la parte inferior los cuales nos muestran los números de las cantidad de páginas que hay con libros.

Todos los libros mostrados en está página nos brindan la opcion de abrirlos, modificarlos, eliminarlos, acceder a la biografia de su autor y acceder a la reseña del libro. Además nos muestran los géneros a los que pertenece el libro.

Para poder abrir los libros, acceder a la biografia de su autor, modificarlos o eliminarlos, se debe presionar sobre la imagen de la portada del libro para que se despliegue un menu con estas opciones.

##### Búsquedas y filtros

La página cuenta con un buscador para hacer dos tipos de búsqueda: por el título del libro y por el nombre del autor. Además cuenta con todos los géneros presentes en la aplicación con los que se han clasificados los libros para también filtrar a estos por uno o varios géneros. Tambíen en cada libro donde aparece el autor podemos hacer click para filtrar por ese autor. Además podemos filtrar por un solo género haciendo click en el género que aparece en un libro en particular.

##### Estilos y lógica

La página de libros utiliza el template [admin-libros.html](templates/admin/admin-libros.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-libros**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [libros-admin.css](static/admin/libros-admin/libros-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [libros-admin.js](static/admin/libros-admin/libros-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **libros-admin.js** se hacen peticiones asíncronas al servidor para obtener la información de los libros de la base de datos ya sea al entrar por primera vez a la página, o al hacer una búsqueda. También se hacen peticiones cuando se realizan las acciones mencionadas anteriormente en cada libro.

#### Página _Insertar Libros_

En esta página aparece un formulario a rellenar para poder insertar un nuevo libro. Los campos a completar son:
- Título del libro
- Seleccionar el autor (debe estar previamente insertado)
- Escribir una reseña del libro
- Seleccionar los géneros (deben estar previamente insertados)
- Seleccionar la imagen de la portada del libro en formato png con un tamaño preferiblemente de 97x120 píxeles.
- Seleccionar el archivo pdf que contiene el contenido del libro.

Todos los campos anteriores se validan antes de enviar los datos al servidor. Esto se hace mediante el archivo javascript encargado de la lógica de esta página. El par título-autor no debe cohincidir con un registro que ya se encuentre insertado porque significaría que el libro ya existe. De ser así se indica lo anterior. Debe escribirse una reseña, seleccionar al menos un género y seleccionar la imagen de portada y el archivo pdf.

##### Estilos y lógica

La página de Insertar Libros utiliza el template [admin-libros-insertar.html](templates/admin/admin-libros-insertar.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-libros-insertar**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [libros-insertar-admin.css](static/admin/libros-admin/libros-insertar-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [libros-insertar-admin.js](static/admin/libros-admin/libros-insertar-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **libros-insertar-admin.js** se valida la información rellenada en el formulario para insertar un nuevo libro y se hacen peticiones asíncronas al servidor para enviar dicha información, registrarla en la base de datos de la aplicación y copiar los archivos subidos a sus carpetas respectivas.

#### Página _Modificar Libros_

En esta página aparece el mismo formulario de la página **Insertar Libro** relleno con los datos del libro que seleccionó para modificar. Los campos rellenos son:
- Título del libro
- Autor del libro
- Reseña del libro
- Géneros seleccionados
- Seleccionar la imagen de la portada del libro en formato png con un tamaño preferiblemente de 97x120 píxeles.
- Seleccionar el archivo pdf que contiene el contenido del libro.

Todos los campos anteriores se validan antes de enviar los datos al servidor. Esto se hace mediante el archivo javascript encargado de la lógica de esta página. El par título-autor no debe cohincidir con un registro que ya se encuentre insertado porque significaría que el libro ya existe. De ser así se indica lo anterior. Debe escribirse siempre el campo reseña, debe seleccionarse al menos un género en caso se modifique. No es necesario seleccionar la imagen de portada y el archivo pdf a menos que se quieran actualizar por otro.

##### Estilos y lógica

La página de modificar Libros utiliza el template [admin-libros-modificar.html](templates/admin/admin-libros-modificar.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-libros-modificar**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [libros-insertar-admin.css](static/admin/libros-admin/libros-insertar-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [libros-modificar-admin.js](static/admin/libros-admin/libros-modificar-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **libros-modificar-admin.js** se valida la información rellenada en el formulario para modificar el libro y se hacen peticiones asíncronas al servidor para enviar dicha información, actualizarla en la base de datos de la aplicación y copiar los archivos subidos a sus carpetas respectivas en caso se hallan actualizado.

#### Página _Autores_

La página de autores nos muestra el mismo menú que podemos observar en las páginas anteriores.

En la página se muestra la cantidad de autores disponibles en la aplicación web.

En está pagina se muestran todos los autores disponibles en la aplicación web. Se muestran de 10 en 10 mediante unos botones en la parte inferior los cuales nos muestran los números de las cantidad de páginas que hay con autores.

Todos los autores mostrados en está página nos brindan la opcion de acceder a su biografía al presionar en el botón de **Leer Biografía**.

Al presionar el boton **≡** se despliega un menu que brinda las opciones de modificar y eliminar el autor.

##### Búsqueda

La página cuenta con un buscador para hacer una búsqueda escribiendo el nombre del autor del cual desea obtener la biografía.

##### Estilos y lógica

La página de modificar Libros utiliza el template [admin-autores.html](templates/admin/admin-autores.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-autores**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [autores-admin.css](static/admin/autores-admin/autores-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [autores-admin.js](static/admin/autores-admin/autores-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **autores-admin.js** se hacen peticiones asíncronas al servidor para obtener la información de los autores de la base de datos ya sea al entrar por primera vez a la página, o al hacer una búsqueda. También se hacen peticiones para obtener la información de su biografía.

#### Página _Insertar Autores_

En esta página aparece un formulario a rellenar para poder insertar un nuevo autor. Los campos a completar son:
- Nombres del autor
- Apellidos del autor
- Escribir la biografía
- Seleccionar la imagen del autor en formato jpg con un tamaño preferiblemente de 423x510 píxeles.

Todos los campos anteriores se validan antes de enviar los datos al servidor. Esto se hace mediante el archivo javascript encargado de la lógica de esta página. El par nombres-apellidos no debe cohincidir con un registro que ya se encuentre insertado porque significaría que el autor ya existe. De ser así se indica lo anterior.

##### Estilos y lógica

La página de Insertar Autor utiliza el template [admin-autor-insertar.html](templates/admin/admin-autor-insertar.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-autor-insertar**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [autores-insertar-admin.css](static/admin/autores-admin/autores-insertar-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [autores-insertar-admin.js](static/admin/autores-admin/autores-insertar-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **autores-insertar-admin.js** se valida la información rellenada en el formulario para insertar un nuevo autor y se hacen peticiones asíncronas al servidor para enviar dicha información, registrarla en la base de datos de la aplicación y copiar los archivos subidos a sus carpetas respectivas.

#### Página _Modificar Autores_

En esta página aparece el mismo formulario de la página **Insertar Autores** relleno con los datos del autor que seleccionó para modificar. Los campos rellenos son:
- Nombres del autor
- Apellidos del autor
- Escribir la biografía
- Seleccionar la imagen del autor en formato jpg con un tamaño preferiblemente de 423x510 píxeles.

Todos los campos anteriores se validan antes de enviar los datos al servidor. Esto se hace mediante el archivo javascript encargado de la lógica de esta página. El par nombres-apellidos no debe cohincidir con un registro que ya se encuentre insertado porque significaría que el autor ya existe. De ser así se indica lo anterior. No es necesario seleccionar la imagen del autor a menos que se desee actualizar.

##### Estilos y lógica

La página de modificar Autores utiliza el template [admin-autor-modificar.html](templates/admin/admin-autor-modificar.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-autor-modificar**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [autores-insertar-admin.css](static/admin/autores-admin/autores-insertar-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [autores-modificar-admin.js](static/admin/autores-admin/autores-modificar-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **autores-modificar-admin.js** se valida la información rellenada en el formulario para modificar el autor y se hacen peticiones asíncronas al servidor para enviar dicha información, actualizarla en la base de datos de la aplicación y copiar los archivos subidos a sus carpetas respectivas en caso se hallan actualizado.

#### Página _Géneros_

La página de géneros nos muestra el mismo menú que podemos observar en las páginas anteriores.

En la página se muestra la cantidad de generos insertados en la aplicación web.

En está pagina se muestran todos los autores insertados en la aplicación web.

Todos los autores mostrados en está página al presionar sobre ellos se despliega un menu que brinda las opciones de modificar y eliminar el género.

##### Búsqueda

La página cuenta con un buscador para hacer una búsqueda escribiendo el nombre del género.

##### Estilos y lógica

La página de Géneros utiliza el template [admin-generos.html](templates/admin/admin-generos.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-generos**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [generos-admin.css](static/admin/generos-admin/generos-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [generos-admin.js](static/admin/generos-admin/generos-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **generos-admin.js** se hacen peticiones asíncronas al servidor para obtener la información de los generos de la base de datos ya sea al entrar por primera vez a la página, o al hacer una búsqueda.

#### Página _Insertar Géneros_

En esta página aparece un formulario a rellenar para poder insertar un nuevo genero. Este formulario tiene un único campo a rellenar que es el Nombre del género. Este se valida antes de enviar los datos al servidor. Esto se hace mediante el archivo javascript encargado de la lógica de esta página. El nombre no debe cohincidir con un registro que ya se encuentre insertado porque significaría que el genero ya existe. De ser así se indica lo anterior.

##### Estilos y lógica

La página de Insertar Genero utiliza el template [admin-autor-insertar.html](templates/admin/admin-genero-insertar.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-genero-insertar**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [autores-insertar-admin.css](static/admin/autores-admin/autores-insertar-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [generos-insertar-admin.js](static/admin/generos-admin/generos-insertar-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **generos-insertar-admin.js** se valida la información rellenada en el formulario para insertar un nuevo genero y se hacen peticiones asíncronas al servidor para enviar dicha información, registrarla en la base de datos de la aplicación.

#### Página _Modificar Géneros_

En esta página aparece el mismo formulario de la página **Insertar Géneros** relleno con el nombre del género que seleccionó para modificar.

El campo del nombre se valida antes de enviar los datos al servidor. Esto se hace mediante el archivo javascript encargado de la lógica de esta página. El nombre no debe cohincidir con un registro que ya se encuentre insertado porque significaría que el genero ya existe. De ser así se indica lo anterior.

##### Estilos y lógica

La página de modificar generos utiliza el template [admin-genero-modificar.html](templates/admin/admin-genero-modificar.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-genero-modificar**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [generos-insertar-admin.css](static/admin/generos-admin/generos-insertar-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [generos-modificar-admin.js](static/admin/generos-admin/generos-modificar-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **generos-modificar-admin.js** se valida la información rellenada en el formulario para modificar el género y se hacen peticiones asíncronas al servidor para enviar dicha información, actualizarla en la base de datos de la aplicación.

#### Página _Usuarios_

La página de usuarios nos muestra el mismo menú que podemos observar en las páginas anteriores.

En la página se muestra la cantidad de usuarios y admins registrados en la aplicación web.

En está pagina se muestran todos usuarios y admins registrados en la aplicación web.

Todos los usuarios y admins mostrados en está página al presionar sobre ellos se despliega un menu que brinda las opciones de modificar y eliminar la cuenta.

##### Búsqueda

La página cuenta con un buscador para hacer una búsqueda escribiendo el nombre de la cuenta. El buscador filtrara tanto para cuentas de admin como cuentas de usuario.

##### Estilos y lógica

La página de Géneros utiliza el template [admin-usuarios.html](templates/admin/admin-usuarios.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-usuarios**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [usuarios-admin.css](static/admin/usuarios-admin/usuarios-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [usuarios-admin.js](static/admin/usuarios-admin/usuarios-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **usuarios-admin.js** se hacen peticiones asíncronas al servidor para obtener la información de los usuarios y admins de la base de datos ya sea al entrar por primera vez a la página, o al hacer una búsqueda.

#### Página _Insertar Usuarios_ y _Insertar Admins_

En ambas páginas aparece un formulario a rellenar para poder insertar un nuevo usuario o admin.
Este formulario tiene tres campos a rellenar que son:
- Nombre del usuario o admin
- Contraseña
- Repetir Contraseña

Estos se validan antes de enviar los datos al servidor. Esto se hace mediante el archivo javascript encargado de la lógica de esta página. El nombre de usuario o admin no debe cohincidir con un registro que ya se encuentre insertado porque significaría que el usuario o admin ya existe. De ser así se indica lo anterior.

##### Estilos y lógica

La página de Insertar Usuario utiliza el template [admin-usuario-insertar.html](templates/admin/admin-usuario-insertar.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-usuario-insertar**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [usuarios-insertar-admin.css](static/admin/usuarios-admin/usuarios-insertar-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [usuarios-insertar-admin.js](static/admin/usuarios-admin/usuarios-insertar-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **usuarios-insertar-admin.js** se valida la información rellenada en el formulario para insertar un nuevo usuario y se hacen peticiones asíncronas al servidor para enviar dicha información y registrarla en la base de datos de la aplicación.

La página de Insertar Admin utiliza el template [admin-admin-insertar.html](templates/admin/admin-admin-insertar.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-admin-insertar**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [usuarios-insertar-admin.css](static/admin/usuarios-admin/usuarios-insertar-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [admin-insertar-admin.js](static/admin/usuarios-admin/admin-insertar-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **admin-insertar-admin.js** se valida la información rellenada en el formulario para insertar un nuevo usuario y se hacen peticiones asíncronas al servidor para enviar dicha información y registrarla en la base de datos de la aplicación.

#### Página _Modificar Usuario_ y _Modificar Admin_

En ambas páginas aparece el mismo formulario de la páginas **Insertar Usuario** y **Insertar Admin** relleno con el nombre del usuario o admin que seleccionó para modificar.

Tambien se muestran los campos vacíos de:
- Actual contraseña
- Nueva Contraseña
- Repetir Contraseña

El campo del nombre se valida antes de enviar los datos al servidor. Esto se hace mediante el archivo javascript encargado de la lógica de esta página. El nombre no debe cohincidir con un registro que ya se encuentre insertado porque significaría que el usurio o admin ya existe. De ser así se indica lo anterior. Los campos de contraseña no son necesarios de rellenar para modificar el nombre de usuario a menos que se requiera actualizar la contraseña. En este ultimo caso se debe rellenar todo.

##### Estilos y lógica

La página de modificar usuario utiliza el template [admin-usuario-modificar.html](templates/admin/admin-usuario-modificar.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-usuario-modificar**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [usuarios-insertar-admin.css](static/admin/usuarios-admin/usuarios-insertar-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [usuarios-modificar-admin.js](static/admin/usuarios-admin/usuarios-modificar-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **usuarios-modificar-admin.js** se valida la información rellenada en el formulario para modificar el usuario y se hacen peticiones asíncronas al servidor para enviar dicha información, actualizarla en la base de datos de la aplicación.

La página de modificar admin utiliza el template [admin-admin-modificar.html](templates/admin/admin-admin-modificar.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-admin-modificar**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [usuarios-insertar-admin.css](static/admin/usuarios-admin/usuarios-insertar-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [admin-modificar-admin.js](static/admin/usuarios-admin/admin-modificar-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **admin-modificar-admin.js** se valida la información rellenada en el formulario para modificar el usuario y se hacen peticiones asíncronas al servidor para enviar dicha información, actualizarla en la base de datos de la aplicación.

#### Página _Historial_

La página de historial nos muestra el mismo menú que podemos observar en la página de inicio.

En la página se muestra una tabla con información sobre las operaciones realizadas en la administración de la aplicación web. Estos datos son de solo lectura.

Los datos brindados por operación son:
- ID Operación
- AdminID
- Tipo de Operación (MODIFICAR, INSERTAR, ELIMINAR)
- Tabla modificada (Libros, Usuarios, Autores, Generos, Usuarios, Admins)
- ID registro
- Fecha

Se muestran todos los registros de operaciones realizadas en la administración de la aplicación web. Se muestran de 20 en 20 mediante unos botones en la parte inferior los cuales nos muestran los números de la cantidad de páginas que hay con registros.

##### Estilos y lógica

La página de historial utiliza el template [admin-historial.html](templates/admin/admin-historial.html) el cuál es renderizado desde el servidor web cuando se accede a la ruta **/admin-historial**. Este template utiliza también el template [admin-layout.html](templates/admin/admin-layout.html).

Los estilos que dan un aspecto agradable a esta página se encuentran en los archivos [historial-admin.css](static/admin/historial-admin/historial-admin.css) y [styles-admin.css](static/admin/styles-admin.css). Esta página también utiliza los archivos [historial-admin.js](static/admin/historial-admin/historial-admin.js) y [admin-layout.js](static/admin/admin-layout.js) para darle dinamismo a la página. En el archivo **libros-admin.js** se hacen peticiones asíncronas al servidor para obtener la información de los registros de la base de datos sobre la actividad en la administración de la aplicación web.

## Tecnologías

- Frontend: HTML, CSS, JavaScript.
- Backend: Python con Flask.
- Base de datos: SQLite

## Instalación

1. Clona este repositorio
2. Asegúrate de tener Python y Flask instalados.
3. Navega a la carpeta del proyecto: `cd project`
4. Ejecuta la aplicación: `python app.py`
5. Abre tu navegador y ve a `http://localhost:5000` para usar la aplicación.

## Uso
*Para probar la app*:
 - _Cuenta de Usuario_:
    - **Nombre de usuario**: User_Cs50_2023
    - **Contraseña**: User_Cs50_2023*
 - _Cuenta de Admin_:
    - **Nombre de usuario**: Admin_Cs50
    - **Contraseña**: Admin_Cs50*

## Créditos

- Autor: Raivel Lorenzo Valiente
- Recursos de terceros:
  - Librería de diseño: [MDBootstrap](https://mdbootstrap.com/)

## Contacto

Si tienes alguna pregunta o comentario sobre este proyecto, no dudes en ponerte en contacto conmigo:

- Correo electrónico: raivellorenzo.valiente@gmail.com

## Agradecimientos

¡Gracias por visitar mi proyecto! Espero que disfrutes utilizando mi aplicación web de descarga de libros. Si tienes alguna pregunta, no dudes en contactarme.
