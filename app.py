import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
import datetime

from funciones import login_required_users, login_required_users_admin

app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configurar la biblioteca CS50 para usar la base de datos SQLite
db = SQL("sqlite:///PaP.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        data = request.json.get('data')
        user = data['user']
        password = data['pass']

        # Query database for username
        rows = db.execute("SELECT * FROM usuarios WHERE nombre = ?", user)

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["contrasena"], password):
            return jsonify(error='<p>Usuario o contraseña incorrectos.</p>'), 400

        # Remember which user has logged in
        session["user_id"] = rows[0]["ID"]

        # Redirect user to home page
        return jsonify(message="Redirigiendo"), 200

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")

@app.route("/register", methods=["POST"])
def register():
    session.clear()

    if request.method == "POST":
        data = request.json.get('data')
        user = data['user']
        password = data['pass']
        confirm = data['confirm']

        if not user:
            return jsonify(error='<p>Debe rellenar el campo de usuario.</p>'), 400
        if not password:
            return jsonify(error='<p>Debe rellenar el campo de contraseña.</p>'), 400
        if not confirm:
            return jsonify(error='<p>Debe rellenar el campo de repetir contraseña.</p>'), 400
        if password != confirm:
            return jsonify(error='<p>Las contraseñas no cohinciden.</p>'), 400

        hash_pass = generate_password_hash(password)

        try:
            new_user = db.execute("INSERT INTO usuarios (nombre, contrasena) VALUES (?, ?)", user, hash_pass)
        except:
            return jsonify(error='<p>El nombre de usuario ya existe</p>'), 400

        session["user_id"] = new_user

        # Redirect user to home page
        return jsonify(message="Redirigiendo"), 200

@app.route("/logout")
def logout():
     # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")

# Funciones para la vista de usuario
@app.route('/')
@login_required_users
def index():
    return render_template("index.html")

@app.route('/obtenerLibrosVisitas', methods=["POST"])
@login_required_users
def obtenerLibrosVisitas():
    datos = db.execute(
        """
        SELECT lib.ID, lib.titulo, lib.generosID,
        lib.AutorID, nombres, apellidos,
        COUNT(LibroID) as visitas FROM calificaciones ca
        JOIN libros lib
        ON lib.ID = ca.LibroID
        JOIN autores au
        ON lib.AutorID = au.ID
        GROUP BY LibroID
        ORDER BY visitas DESC
        LIMIT 10
        """)
    return jsonify(datos), 200


@app.route('/obtenerLibrosAñadidos', methods=["POST"])
@login_required_users
def obtenerLibrosAñadidos():
    datos = db.execute(
        """
        SELECT lib.ID, lib.titulo, lib.generosID,
        lib.AutorID, nombres, apellidos FROM libros lib
        JOIN autores au
        ON au.ID = lib.AutorID
        ORDER BY fechaPublicacion DESC
        LIMIT 10
        """)
    return jsonify(datos), 200

@app.route('/obtenerLibrosCalificados', methods=["POST"])
@login_required_users
def obtenerLibrosCalificados():
    datos = db.execute(
        """
        SELECT lib.ID, lib.titulo, lib.generosID,
        lib.AutorID, nombres, apellidos, AVG(calificacion) as Pcalif
        FROM calificaciones ca
        JOIN libros lib
        ON lib.ID = ca.LibroID
        JOIN autores au
        ON au.ID = lib.AutorID
        GROUP BY LibroID
        ORDER BY Pcalif DESC
        LIMIT 10
        """)
    return jsonify(datos), 200

@app.route('/obtenerLibrosCofreIndex', methods=["POST"])
@login_required_users
def obtenerLibrosCofreIndex():
    user_id = session['user_id']
    datos = db.execute(
        """
        SELECT lib.ID, lib.titulo, lib.generosID,
        lib.AutorID, nombres, apellidos
        FROM cofre cof
        JOIN libros lib
        ON lib.ID = cof.LibroID
        JOIN autores au
        ON au.ID = lib.AutorID
        WHERE UsuarioID = ?
        ORDER BY titulo
        LIMIT 10
        """, user_id)
    print(datos)
    return jsonify(datos), 200

@app.route('/obtenerAutoresIndex', methods=["POST"])
@login_required_users
def obtenerAutoresIndex():
    datos = db.execute(
        """
        SELECT au.ID, nombres, apellidos, COUNT(au.ID) as visitasAutor
        FROM calificaciones ca
        JOIN libros lib
        ON lib.ID = ca.LibroID
        JOIN autores au
        ON au.ID = lib.AutorID
        GROUP BY au.ID
        ORDER BY visitasAutor DESC
        LIMIT 10
        """)
    return jsonify(datos), 200

@app.route('/libros')
@login_required_users
def libros():
    return render_template("libros.html")

@app.route('/generos', methods=["POST"])
@login_required_users
def obtenerGeneros():
    try:
        generos = db.execute("SELECT * FROM generos")
        return jsonify(generos), 200
    except:
        return jsonify(error="Ha ocurrido un error al obtener los géneros de la base de datos"), 400

@app.route('/obtenerLibros', methods=["POST"])
@login_required_users
def obtenerLibros():
    datos = db.execute(
        """SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID
            FROM libros lib
            JOIN autores au
            ON lib.AutorID = au.ID
        """)
    return jsonify(datos), 200

@app.route('/busquedaLibros', methods=["POST"])
@login_required_users
def busquedaLibros():
    data = request.json.get('data')
    buscar = data['valor']
    tipo_busqueda = int(data['tipoB'])
    generos = data['generos']
    consultaGenero = ''

    if(len(generos) != 0):
        for genero in generos:
            resultado = db.execute("SELECT * FROM generos WHERE ID = ?", genero)
            if not resultado:
                return jsonify(error='ID genero no valido'), 400
            consultaGenero += f'generosID LIKE "%-{genero}-%" AND '
        consultaGenero = consultaGenero[:-4]

    if tipo_busqueda == 1:
        if consultaGenero == '':
            resultados = db.execute(
                """SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID FROM libros lib
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE titulo LIKE ?
            """, "%" + buscar + "%")
            return jsonify(resultados), 200
        else:
            resultados = db.execute(
                f"""SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID FROM libros lib
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE titulo LIKE ? AND {consultaGenero}
            """, "%" + buscar + "%")
            return jsonify(resultados), 200
    elif tipo_busqueda == 2:
        if consultaGenero == '':
            resultados = db.execute(
                """SELECT lib.ID, titulo, AutorID, nombres, apellidos, nombres ||' '|| apellidos AS nombre_completo, apellidos ||' '|| nombres AS nombre_completo1, generosID FROM libros lib
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE nombre_completo LIKE ? OR nombre_completo1 LIKE ?
            """, "%" + buscar + "%", "%" + buscar + "%")
            return jsonify(resultados), 200
        else:
            resultados = db.execute(
                f"""SELECT lib.ID, titulo, AutorID, nombres, apellidos, nombres ||' '|| apellidos AS nombre_completo, apellidos ||' '|| nombres AS nombre_completo1, generosID FROM libros lib
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE (nombre_completo LIKE ? OR nombre_completo1 LIKE ?) AND {consultaGenero}
            """, "%" + buscar + "%", "%" + buscar + "%")
            return jsonify(resultados), 200
    elif tipo_busqueda == 0:
        if consultaGenero == '':
            resultados = db.execute(
                """SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID
                FROM libros lib
                JOIN autores au
                ON lib.AutorID = au.ID
            """)
            return jsonify(resultados), 200
        else:
            resultados = db.execute(
                f"""SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID FROM libros lib
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE {consultaGenero}
            """)
            return jsonify(resultados), 200

@app.route('/filtrarGeneroUnico', methods=["POST"])
@login_required_users
def filtrarGeneroUnico():
    data = request.json.get('data')
    try:
        id_genero = int(data['id'])
        result = db.execute("SELECT * FROM generos WHERE ID = ?", id_genero)
        if not result:
            return jsonify(error='ID genero no valido'), 400
    except ValueError:
        return jsonify(error='ID de género no válido'), 400
    try:
        id_genero =  "-" + str(id_genero) + "-"
        resultados = db.execute(
            """
                SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID
                FROM libros lib
                JOIN autores au
                ON lib.AutorID = au.ID
                WHERE generosID LIKE ?
            """, "%"+ id_genero + "%")
        return jsonify(resultados), 200
    except:
        return jsonify(error="Ha ocurrido un error al obtener los libros de la base de datos"), 400

@app.route('/filtrarAutor', methods=["POST"])
@login_required_users
def filtrarAutor():
    data = request.json.get('data')
    try:
        id_autor = data['id']
        result = db.execute("""SELECT ID FROM autores WHERE ID = ?""", id_autor)
        if not result:
            return jsonify(error="ID del autor no válido."), 400
    except ValueError:
        return jsonify(error="ID del autor no válido."), 400
    try:
        resultados = db.execute("""SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID FROM libros lib
                        JOIN autores au
                        ON lib.AutorID = au.ID
                        WHERE au.ID = ?
                """, id_autor)
        return jsonify(resultados), 200
    except:
        return jsonify(error="Ha ocurrido un error al obtener los libros de la base de datos"), 400

@app.route('/obtenerResena', methods=["POST"])
@login_required_users
def obtenerResena():
    data = request.json.get('data')
    try:
        id_Libro = int(data['id'])
        file_path = "/static/libros/resena/" + str(id_Libro) + ".txt"
        titulo = db.execute("SELECT titulo FROM libros WHERE ID = ?", id_Libro)
        if not titulo:
            return jsonify(error="ID del libro no válido."), 400
        titulo = titulo[0]['titulo']
        file_path = app.root_path + file_path
    except ValueError:
        return jsonify(error="ID del libro no válido."), 400
    try:
        with open(file_path, encoding="UTF-8") as file:
            file_content = file.read()
            resena = {"titulo": titulo, "resena": file_content}
            return jsonify(resena), 200
    except FileNotFoundError:
        return jsonify(error="El archivo no fue encontrado."), 400
    except Exception as e:
        mensaje = "Error al leer el archivo: " + str(e)
        return jsonify(error=mensaje), 400

@app.route('/validarCalificacion', methods=["POST"])
@login_required_users
def validarCalificacion():
    data = request.json.get('data')
    try:
        id_Libro = int(data['id'])
        result = db.execute("SELECT ID FROM libros WHERE ID = ?", id_Libro)
        if not result:
            return jsonify(error='ID libro no valido'), 400
    except ValueError:
        return jsonify(error='ID libro no valido'), 400

    user_id = session["user_id"]
    resultados = db.execute(
        """SELECT * FROM calificaciones
        WHERE UsuarioID = ?
        AND LibroID = ?
        """, user_id, id_Libro)

    result1 = db.execute(
            """
            SELECT * FROM cofre
            WHERE UsuarioID = ?
            AND LibroID = ?
            """, user_id, id_Libro)
    if len(result1) == 1:
        ultimaVisita = datetime.datetime.now()
        db.execute(
            """
            UPDATE cofre SET ultimaVisita = ?
            WHERE UsuarioID = ?
            AND LibroID = ?
            """, ultimaVisita, user_id, id_Libro)
    return jsonify(resultados), 200

@app.route('/guardarCalificacion', methods=["POST"])
@login_required_users
def guardarCalificacion():
    data = request.json.get('data')
    try:
        id_Libro = int(data['id_libro'])
        result = db.execute("SELECT ID FROM libros WHERE ID = ?", id_Libro)
        if not result:
            return jsonify(error='ID libro no valido'), 400

        calificacion = int(data['calificacion'])
        posibles_calificaciones = [1, 2, 3, 4, 5]
        if calificacion not in posibles_calificaciones:
            return jsonify(error='Calificacion no valida'), 400
    except ValueError:
        return jsonify(error='ID libro no valido o Calificacion no valida'), 400

    user_id = session["user_id"]

    fecha = datetime.datetime.now()
    resultados = db.execute(
        """INSERT INTO calificaciones
        (UsuarioID, LibroID, calificacion, fechaVisita)
        VALUES (?,?,?,?)
        """, user_id, id_Libro, calificacion, fecha)
    return jsonify(resultados), 200

@app.route('/guardarLibroCofre', methods=["POST"])
@login_required_users
def guardarLibroCofre():
    data = request.json.get('data')
    try:
        id_Libro = int(data['id_libro'])
        result = db.execute("SELECT ID FROM libros WHERE ID = ?", id_Libro)
        if not result:
            return jsonify(error='ID libro no valido'), 400
    except ValueError:
        return jsonify(error='ID libro no valido'), 400

    user_id = session["user_id"]

    ultimaVisita =db.execute(
        """
        SELECT fechaVisita FROM calificaciones
        WHERE UsuarioID = ?
        AND LibroID = ?
        """, user_id, id_Libro)

    if not ultimaVisita:
        fechaVisita = ""
    else:
        fechaVisita = ultimaVisita[0]['fechaVisita']

    try:
        resultados = db.execute(
            """
            INSERT INTO cofre (UsuarioID,LibroID, ultimaVisita) VALUES (?, ?, ?)
            """, user_id, id_Libro, fechaVisita)
        resultados = [resultados]
        print(resultados)
        return jsonify(resultados), 200
    except:
        resultados = []
        return jsonify(resultados), 200



@app.route('/autores')
@login_required_users
def autores():
    return render_template("autores.html")

@app.route('/obtenerAutores', methods=["POST"])
@login_required_users
def obtenerAutores():
    datos = db.execute("SELECT * FROM autores ORDER BY apellidos")
    return jsonify(datos), 200

@app.route('/busquedaAutores', methods=["POST"])
@login_required_users
def busquedaAutores():
    data = request.json.get('data')
    buscar = data['valor']
    if not buscar:
        return jsonify(error='<p>Debe escribir en el buscador para poder buscar.</p>'), 400
    resultados = db.execute(
        """
        SELECT *, nombres ||' '|| apellidos as nombreCompleto,
        apellidos ||' '|| nombres as nombreCompleto1
        FROM autores
        WHERE nombreCompleto LIKE ? OR nombreCompleto1 LIKE ?
        """, "%"+ buscar + "%", "%"+ buscar + "%")
    return jsonify(resultados), 200

@app.route('/abrirBiografia', methods=["POST"])
@login_required_users
def abrirBiografia():
    data = request.json.get('data')

    try:
        id_autor = int(data['id'])
        resultados = db.execute("SELECT * FROM autores WHERE ID = ?", id_autor)
        if not resultados:
            return jsonify(error='ID de autor no valido'), 400
        file_path = "/static/autores/biografias/" + str(id_autor) + ".txt"
        file_path = app.root_path + file_path
        print(file_path)
    except ValueError:
        return jsonify(error='ID de autor no valido'), 400

    resultados = resultados[0]
    try:
        with open(file_path, encoding="UTF-8") as file:
            file_content = file.read()
            nombre = resultados['nombres'] + " " + resultados['apellidos']
            biografia = {
                "ID": resultados['ID'],
                "nombre": nombre,
                "biografia": file_content
            }
            return jsonify(biografia), 200

    except FileNotFoundError:
        return jsonify(error="El archivo no fue encontrado."), 400
    except Exception as e:
        mensaje = "Error al leer el archivo: " + str(e)
        return jsonify(error=mensaje), 400

@app.route('/micofreliterario')
@login_required_users
def cofre():
    return render_template("cofre.html")


@app.route('/obtenerLibrosCofre', methods=["POST"])
@login_required_users
def obtenerLibrosCofre():
    user_id = session["user_id"]
    datos = db.execute(
        """SELECT lib.ID, titulo, AutorID, nombres,
            apellidos, generosID, notas, ultimaVisita FROM cofre cof
            JOIN libros lib
            ON lib.ID = cof.LibroID
            JOIN autores au
            ON lib.AutorID = au.ID
            WHERE UsuarioID = ?
        """, user_id)
    return jsonify(datos), 200

@app.route('/busquedaLibrosCofre', methods=["POST"])
@login_required_users
def busquedaLibrosCofre():
    data = request.json.get('data')
    buscar = data['valor']
    tipo_busqueda = int(data['tipoB'])
    generos = data['generos']
    consultaGenero = ''
    user_id = session["user_id"]

    if(len(generos) != 0):
        for genero in generos:
            resultado = db.execute("SELECT * FROM generos WHERE ID = ?", genero)
            if not resultado:
                return jsonify(error='ID genero no valido'), 400
            consultaGenero += f'generosID LIKE "%-{genero}-%" AND '
        consultaGenero = consultaGenero[:-4]

    if tipo_busqueda == 1:
        if consultaGenero == '':
            resultados = db.execute(
                """SELECT lib.ID, titulo, AutorID, nombres,
                    apellidos, generosID, notas, ultimaVisita FROM cofre cof
                    JOIN libros lib
                    ON lib.ID = cof.LibroID
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE UsuarioID = ?
                    AND titulo LIKE ?
            """, user_id,"%" + buscar + "%")
            return jsonify(resultados), 200
        else:
            resultados = db.execute(
                f"""SELECT lib.ID, titulo, AutorID, nombres,
                    apellidos, generosID, notas, ultimaVisita FROM cofre cof
                    JOIN libros lib
                    ON lib.ID = cof.LibroID
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE UsuarioID = ?
                    AND titulo LIKE ? AND {consultaGenero}
            """, user_id,"%" + buscar + "%")
            return jsonify(resultados), 200
    elif tipo_busqueda == 2:
        if consultaGenero == '':
            resultados = db.execute(
                """SELECT lib.ID, titulo, AutorID, nombres,
                    apellidos, nombres ||' '|| apellidos AS nombre_completo,
                    apellidos ||' '|| nombres AS nombre_completo1
                    ,generosID, notas, ultimaVisita FROM cofre cof
                    JOIN libros lib
                    ON lib.ID = cof.LibroID
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE UsuarioID = ?
                    AND (nombre_completo LIKE ?
                    OR nombre_completo1 LIKE ?)
            """, user_id,"%" + buscar + "%", "%" + buscar + "%")
            return jsonify(resultados), 200
        else:
            resultados = db.execute(
                f"""SELECT lib.ID, titulo, AutorID, nombres,
                    apellidos, nombres ||' '|| apellidos AS nombre_completo,
                    apellidos ||' '|| nombres AS nombre_completo1
                    ,generosID, notas, ultimaVisita FROM cofre cof
                    JOIN libros lib
                    ON lib.ID = cof.LibroID
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE UsuarioID = ?
                    AND (nombre_completo LIKE ?
                    OR nombre_completo1 LIKE ?)
                    AND {consultaGenero}
            """, user_id,"%" + buscar + "%", "%" + buscar + "%")
            return jsonify(resultados), 200
    elif tipo_busqueda == 0:
        if consultaGenero == '':
            resultados = db.execute(
                """SELECT lib.ID, titulo, AutorID, nombres,
                    apellidos, generosID, notas, ultimaVisita FROM cofre cof
                    JOIN libros lib
                    ON lib.ID = cof.LibroID
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE UsuarioID = ?
            """, user_id)
            return jsonify(resultados), 200
        else:
            resultados = db.execute(
                f"""SELECT lib.ID, titulo, AutorID, nombres,
                    apellidos, generosID, notas, ultimaVisita FROM cofre cof
                    JOIN libros lib
                    ON lib.ID = cof.LibroID
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE UsuarioID = ?
                    AND {consultaGenero}
            """, user_id)
            return jsonify(resultados), 200


@app.route('/filtrarGeneroUnicoCofre', methods=["POST"])
@login_required_users
def filtrarGeneroUnicoCofre():
    data = request.json.get('data')
    user_id = session["user_id"]
    try:
        id_genero = int(data['id'])
        result = db.execute("SELECT * FROM generos WHERE ID = ?", id_genero)
        if not result:
            return jsonify(error='ID genero no valido'), 400
    except ValueError:
        return jsonify(error='ID de género no válido'), 400
    try:
        id_genero =  "-" + str(id_genero) + "-"
        resultados = db.execute(
            """
                SELECT lib.ID, titulo, AutorID, nombres,
                apellidos, generosID, notas, ultimaVisita FROM cofre cof
                JOIN libros lib
                ON lib.ID = cof.LibroID
                JOIN autores au
                ON lib.AutorID = au.ID
                WHERE UsuarioID = ?
                AND generosID LIKE ?
            """, user_id,"%"+ id_genero + "%")
        return jsonify(resultados), 200
    except:
        return jsonify(error="Ha ocurrido un error al obtener los libros de la base de datos"), 400

@app.route('/filtrarAutorCofre', methods=["POST"])
@login_required_users
def filtrarAutorCofre():
    data = request.json.get('data')
    user_id = session["user_id"]
    try:
        id_autor = data['id']
        result = db.execute("""SELECT ID FROM autores WHERE ID = ?""", id_autor)
        if not result:
            return jsonify(error="ID del autor no válido."), 400
    except ValueError:
        return jsonify(error="ID del autor no válido."), 400
    try:
        resultados = db.execute("""
                        SELECT lib.ID, titulo, AutorID, nombres,
                        apellidos, generosID, notas, ultimaVisita FROM cofre cof
                        JOIN libros lib
                        ON lib.ID = cof.LibroID
                        JOIN autores au
                        ON lib.AutorID = au.ID
                        WHERE UsuarioID = ?
                        AND au.ID = ?
                """, user_id, id_autor)
        return jsonify(resultados), 200
    except:
        return jsonify(error="Ha ocurrido un error al obtener los libros de la base de datos"), 400

@app.route('/eliminarLibroCofre', methods=["POST"])
@login_required_users
def eliminarLibroCofre():
    data = request.json.get('data')
    try:
        id_Libro = int(data['id_libro'])
        result = db.execute("SELECT ID FROM libros WHERE ID = ?", id_Libro)
        if not result:
            return jsonify(error='ID libro no valido'), 400
    except ValueError:
        return jsonify(error='ID libro no valido'), 400

    user_id = session["user_id"]
    try:
        resultados = db.execute(
            """DELETE FROM cofre
            WHERE UsuarioID = ?
            AND LibroID = ?
            """, user_id, id_Libro)
        resultados = [resultados]
        return jsonify(resultados), 200
    except:
        resultados = []
        return jsonify(resultados), 200

@app.route('/obtenerNotasLibroCofre', methods=["POST"])
@login_required_users
def obtenerNotasLibroCofre():
    data = request.json.get('data')
    try:
        id_Libro = int(data['id'])
        result = db.execute("SELECT ID FROM libros WHERE ID = ?", id_Libro)
        if not result:
            return jsonify(error='ID libro no valido'), 400
    except ValueError:
        return jsonify(error='ID libro no valido'), 400

    user_id = session["user_id"]

    resultados = db.execute(
        """
        SELECT LibroID, Notas, ultimaVisita
        FROM cofre
        WHERE UsuarioID = ?
        AND LibroID = ?
        """, user_id, id_Libro)
    resultados = resultados[0]
    return jsonify(resultados), 200

@app.route('/actualizarNotas', methods=["POST"])
@login_required_users
def actualizarNotas():
    data = request.json.get('data')
    texto_notas = data['textoNotas']
    try:
        id_Libro = int(data['id_Libro'])
        result = db.execute("SELECT ID FROM libros WHERE ID = ?", id_Libro)
        if not result:
            return jsonify(error='ID libro no valido'), 400
    except ValueError:
        return jsonify(error='ID libro no valido'), 400

    user_id = session["user_id"]
    resultados = db.execute(
        """
        UPDATE cofre SET Notas = ?
        WHERE UsuarioID = ?
        AND LibroID = ?
        """, texto_notas, user_id, id_Libro)
    return jsonify(resultados), 200

@app.route('/perfil')
@login_required_users
def perfil():
    user_id = session["user_id"]
    try:
        resultados = db.execute(
            """
            SELECT * FROM usuarios
            WHERE ID = ?
            """, user_id)
        resultados = resultados[0]
    except:
        return redirect("/")
    user_name = resultados['nombre']
    return render_template(
        "perfil.html",
        nombre = user_name,
        id_usuario = user_id)

@app.route('/obtenerTotalLibrosCalificados', methods=["POST"])
@login_required_users
def obtenerTotalLibrosCalificados():
    user_id = session["user_id"]
    datos = db.execute(
        """SELECT count(LibroID) as libros_calificados
        FROM calificaciones
        WHERE UsuarioID = ?
        """, user_id)
    return jsonify(datos), 200

@app.route('/obtenerTotalLibrosCofre', methods=["POST"])
@login_required_users
def obtenerTotalLibrosCofre():
    user_id = session["user_id"]
    datos = db.execute(
        """SELECT count(LibroID) as libros_cofre
        FROM cofre
        WHERE UsuarioID = ?
        """, user_id)
    return jsonify(datos), 200

@app.route('/obtenerTotalAutoresLeidos', methods=["POST"])
@login_required_users
def obtenerTotalAutoresLeidos():
    user_id = session["user_id"]
    datos = db.execute(
        """
        SELECT lib.AutorID
        FROM calificaciones calf
        JOIN libros lib
        ON calf.LibroID = lib.ID
        WHERE UsuarioID = ?
        GROUP BY lib.AutorID
        """, user_id)
    return jsonify(datos), 200




@app.route("/modificarUsuarioUsuario", methods=["POST"])
@login_required_users
def modificarUsuarioUsuario():

    data = request.json.get('data')
    user = data['user']
    try:
        UsuarioID = int(data['UsuarioID'])
        result = db.execute(
            """
            SELECT * FROM usuarios
            WHERE ID = ?
            """, UsuarioID)
        if not result:
            return jsonify(error='ID usuario no valido'), 400
        result = result[0]
    except ValueError:
        return jsonify(error='ID usuario no valido'), 400
    actual_hash = result['contrasena']

    if not user:
        return jsonify(error='<p>Debe rellenar el campo de usuario.</p>'), 400

    if 'actualPass' in data:
        actualPass = data['actualPass']
        if not check_password_hash(actual_hash, actualPass):
            return jsonify(error='<p>La contraseña escrita no es la actual.</p>'), 400
        if 'pass' in data:
            password = data['pass']
            if not password:
                return jsonify(error='<p>Debe rellenar el campo de contraseña.</p>'), 400
            if 'confirm' in data:
                confirm = data['confirm']
                if not confirm:
                    return jsonify(error='<p>Debe rellenar el campo de repetir contraseña.</p>'), 400
                if password != confirm:
                    return jsonify(error='<p>Las contraseñas no cohinciden.</p>'), 400
                hash_pass = generate_password_hash(password)
                try:
                    db.execute(
                        """
                        UPDATE usuarios
                        SET nombre = ?,
                        contrasena = ?
                        WHERE ID = ?
                        """, user, hash_pass, UsuarioID)
                except:
                    return jsonify(error='<p>El nombre de usuario ya existe.</p>'), 400
    else:
        try:
            db.execute(
                """
                UPDATE usuarios
                SET nombre = ?
                WHERE ID = ?
                """, user, UsuarioID)
        except:
            return jsonify(error='<p>El nombre de usuario ya existe.</p>'), 400

    # Redirect user to home page
    return jsonify(message="Redirigiendo"), 200


# ADMIN FUNCIONES

@app.route("/login-admin", methods=["GET", "POST"])
def loginAdmin():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        data = request.json.get('data')
        user = data['user']
        password = data['pass']

        # Query database for username
        rows = db.execute("SELECT * FROM admins WHERE nombre = ?", user)

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["contrasena"], password):
            return jsonify(error='<p>Usuario o contraseña incorrectos.</p>'), 400

        # Remember which user has logged in
        session["user_admin_id"] = rows[0]["ID"]

        # Redirect user to home page
        return jsonify(message="Redirigiendo"), 200

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("admin/login-admin.html")

@app.route("/admin", methods=["GET", "POST"])
@login_required_users_admin
def admin():
    return render_template('admin/admin-index.html')





@app.route("/admin-libros")
@login_required_users_admin
def adminLibros():
    return render_template('admin/admin-libros.html')

@app.route('/obtenerLibrosAdmin', methods=["POST"])
@login_required_users_admin
def obtenerLibrosAdmin():
    datos = db.execute(
        """SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID
            FROM libros lib
            JOIN autores au
            ON lib.AutorID = au.ID
        """)
    return jsonify(datos), 200

@app.route('/obtenerTotalLibrosAdmin', methods=["POST"])
@login_required_users_admin
def obtenerTotalLibrosAdmin():
    datos = db.execute(
        """SELECT count(ID) as total_libros FROM libros""")
    return jsonify(datos), 200


@app.route('/obtenerTotalVisitadosAdmin', methods=["POST"])
@login_required_users_admin
def obtenerTotalVisitadosAdmin():
    datos = db.execute(
        """SELECT LibroID FROM calificaciones  GROUP BY LibroID""")
    return jsonify(datos), 200


@app.route('/generosAdmin', methods=["POST"])
@login_required_users_admin
def obtenerGenerosAdmin():
    try:
        generos = db.execute("SELECT * FROM generos")
        return jsonify(generos), 200
    except:
        return jsonify(error="Ha ocurrido un error al obtener los géneros de la base de datos"), 400

@app.route('/busquedaLibrosAdmin', methods=["POST"])
@login_required_users_admin
def busquedaLibrosAdmin():
    data = request.json.get('data')
    buscar = data['valor']
    tipo_busqueda = int(data['tipoB'])
    generos = data['generos']
    consultaGenero = ''

    if(len(generos) != 0):
        for genero in generos:
            resultado = db.execute("SELECT * FROM generos WHERE ID = ?", genero)
            if not resultado:
                return jsonify(error='ID genero no valido'), 400
            consultaGenero += f'generosID LIKE "%-{genero}-%" AND '
        consultaGenero = consultaGenero[:-4]

    if tipo_busqueda == 1:
        if consultaGenero == '':
            resultados = db.execute(
                """SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID FROM libros lib
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE titulo LIKE ?
            """, "%" + buscar + "%")
            return jsonify(resultados), 200
        else:
            resultados = db.execute(
                f"""SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID FROM libros lib
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE titulo LIKE ? AND {consultaGenero}
            """, "%" + buscar + "%")
            return jsonify(resultados), 200
    elif tipo_busqueda == 2:
        if consultaGenero == '':
            resultados = db.execute(
                """SELECT lib.ID, titulo, AutorID, nombres, apellidos, nombres ||' '|| apellidos AS nombre_completo, apellidos ||' '|| nombres AS nombre_completo1, generosID FROM libros lib
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE nombre_completo LIKE ? OR nombre_completo1 LIKE ?
            """, "%" + buscar + "%", "%" + buscar + "%")
            return jsonify(resultados), 200
        else:
            resultados = db.execute(
                f"""SELECT lib.ID, titulo, AutorID, nombres, apellidos, nombres ||' '|| apellidos AS nombre_completo, apellidos ||' '|| nombres AS nombre_completo1, generosID FROM libros lib
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE (nombre_completo LIKE ? OR nombre_completo1 LIKE ?) AND {consultaGenero}
            """, "%" + buscar + "%", "%" + buscar + "%")
            return jsonify(resultados), 200
    elif tipo_busqueda == 0:
        if consultaGenero == '':
            resultados = db.execute(
                """SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID
                FROM libros lib
                JOIN autores au
                ON lib.AutorID = au.ID
            """)
            return jsonify(resultados), 200
        else:
            resultados = db.execute(
                f"""SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID FROM libros lib
                    JOIN autores au
                    ON lib.AutorID = au.ID
                    WHERE {consultaGenero}
            """)
            return jsonify(resultados), 200

@app.route('/filtrarGeneroUnicoAdmin', methods=["POST"])
@login_required_users_admin
def filtrarGeneroUnicoAdmin():
    data = request.json.get('data')
    try:
        id_genero = int(data['id'])
        result = db.execute("SELECT * FROM generos WHERE ID = ?", id_genero)
        if not result:
            return jsonify(error='ID genero no valido'), 400
    except ValueError:
        return jsonify(error='ID de género no válido'), 400
    try:
        id_genero =  "-" + str(id_genero) + "-"
        resultados = db.execute(
            """
                SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID
                FROM libros lib
                JOIN autores au
                ON lib.AutorID = au.ID
                WHERE generosID LIKE ?
            """, "%"+ id_genero + "%")
        return jsonify(resultados), 200
    except:
        return jsonify(error="Ha ocurrido un error al obtener los libros de la base de datos"), 400

@app.route('/filtrarAutorAdmin', methods=["POST"])
@login_required_users_admin
def filtrarAutorAdmin():
    data = request.json.get('data')
    try:
        id_autor = data['id']
        result = db.execute("""SELECT ID FROM autores WHERE ID = ?""", id_autor)
        if not result:
            return jsonify(error="ID del autor no válido."), 400
    except ValueError:
        return jsonify(error="ID del autor no válido."), 400
    try:
        resultados = db.execute("""SELECT lib.ID, titulo, AutorID, nombres, apellidos, generosID FROM libros lib
                        JOIN autores au
                        ON lib.AutorID = au.ID
                        WHERE au.ID = ?
                """, id_autor)
        return jsonify(resultados), 200
    except:
        return jsonify(error="Ha ocurrido un error al obtener los libros de la base de datos"), 400

@app.route('/obtenerResenaAdmin', methods=["POST"])
@login_required_users_admin
def obtenerResenaAdmin():
    data = request.json.get('data')
    try:
        id_Libro = int(data['id'])
        file_path = "/static/libros/resena/" + str(id_Libro) + ".txt"
        titulo = db.execute("SELECT titulo FROM libros WHERE ID = ?", id_Libro)
        if not titulo:
            return jsonify(error="ID del libro no válido."), 400
        titulo = titulo[0]['titulo']
        file_path = app.root_path + file_path
    except ValueError:
        return jsonify(error="ID del libro no válido."), 400
    try:
        with open(file_path, encoding="UTF-8") as file:
            file_content = file.read()
            resena = {"titulo": titulo, "resena": file_content}
            return jsonify(resena), 200
    except FileNotFoundError:
        return jsonify(error="El archivo no fue encontrado."), 400
    except Exception as e:
        mensaje = "Error al leer el archivo: " + str(e)
        return jsonify(error=mensaje), 400


@app.route("/admin-libros-insertar")
@login_required_users_admin
def adminLibrosInsertar():
    return render_template('admin/admin-libros-insertar.html')

@app.route('/validarLibro', methods=["POST"])
@login_required_users_admin
def validarLibro():
    data = request.json.get('data')
    titulo = data["titulo"]
    AutorID = data["AutorID"]
    titulo = titulo.lower()

    resultados = db.execute(
        """
        SELECT ID FROM libros
        WHERE titulo LIKE ? AND AutorID = ?
        """, titulo, AutorID)
    return jsonify(resultados), 200


@app.route("/insertarLibro", methods=['POST'])
@login_required_users_admin
def insertarLibro():


    resena = request.form.get('resena')
    titulo = request.form.get('titulo')
    generos_id = request.form.getlist('generosID')
    generos_id = generos_id[0]

    fechaPublicacion = datetime.datetime.now()

    try:
        autor_id = int(request.form.get('AutorID'));
        new_libro = db.execute(
            """
                INSERT INTO libros (titulo, AutorID, generosID, fechaPublicacion)
                VALUES (?, ?, ?, ?)
            """, titulo, autor_id, generos_id, fechaPublicacion)
    except:
        return "Error al insertar el libro.", 400

    try:
        archivoIMG = request.files['imagen-insertar-libro']
        nombre_archivoIMG, extensionIMG = os.path.splitext(archivoIMG.filename)

        archivoIMG.save('static/libros/portadas/' + str(new_libro) + extensionIMG)

        archivoPDF = request.files['pdf-insertar-libro']
        nombre_archivoPDF, extensionPDF = os.path.splitext(archivoPDF.filename)

        archivoPDF.save('static/libros/pdf/' + str(new_libro) + extensionPDF)

    except Exception as e:
        db.execute("""DELETE FROM libros WHERE ID = ?""",new_libro)
        return 'Error al guardar los archivos', 500

    try:
        ruta_destino_txt = 'static/libros/resena/' + str(new_libro) + '.txt'
        # Crea y guarda el archivo
        with open(ruta_destino_txt, 'w',  encoding='utf-8') as archivoTXT:
            archivoTXT.write(resena)
    except Exception as e:
        db.execute("""DELETE FROM libros WHERE ID = ?""",new_libro)
        return 'Error al crear el txt los archivos', 500

    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Insertar"
        tabla = "Libros"
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, new_libro, fechaPublicacion)
    except:
         return 'Error al guardar en el historial', 500
    #-----------
    return "Bien", 200

@app.route('/eliminarLibro', methods=["POST"])
@login_required_users_admin
def eliminarLibro():
    data = request.json.get('data')
    errores = ''
    try:
        id_Libro = int(data['LibroID'])
        result = db.execute("SELECT ID FROM libros WHERE ID = ?", id_Libro)
        if not result:
            return jsonify(error='ID libro no valido'), 400
    except ValueError:
        return jsonify(error='ID libro no valido'), 400

    try:
        resultados = db.execute(
            """DELETE FROM libros
            WHERE ID = ?
            """, id_Libro)
    except:
        resultados = []
        return jsonify(resultados), 200

    try:
        ruta_archivoPDF = 'static/libros/pdf/' + str(id_Libro) + '.pdf'
        ruta_archivoIMG = 'static/libros/portadas/' + str(id_Libro) + '.png'
        ruta_archivoTXT = 'static/libros/resena/' + str(id_Libro) + '.txt'

        if os.path.exists(ruta_archivoPDF):
            os.remove(ruta_archivoPDF)
        else:
            errores += 'El archivo PDF no existe'

        if os.path.exists(ruta_archivoIMG):
            os.remove(ruta_archivoIMG)
        else:
            errores += 'El archivo imagen no existe'

        if os.path.exists(ruta_archivoTXT):
            os.remove(ruta_archivoTXT)
        else:
            errores += 'El archivo TXT no existe'
    except Exception as e:
        return 'Error al eliminar los archivos', 500


    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Eliminar"
        tabla = "Libros"
        fechaEliminar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, id_Libro, fechaEliminar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------

    return jsonify(resultados), 200

@app.route('/admin-libros-modificar')
@login_required_users_admin
def adminLibrosModificar():
    try:
        id_libro = int(request.args.get('libroID'))
        resultados = db.execute(
            """
            SELECT * FROM libros
            WHERE ID = ?
            """, id_libro)
        if not resultados:
            return redirect("/admin-libros")
        resultados = resultados[0]
    except ValueError:
        return redirect("/admin-libros")

    file_path = "/static/libros/resena/" + str(id_libro) + ".txt"
    file_path = app.root_path + file_path
    id_autor = resultados['AutorID']
    titulo = resultados['titulo']
    generos_string = resultados['generosID']

    try:
        with open(file_path, encoding="UTF-8") as file:
            file_content = file.read()
            resena = file_content
    except FileNotFoundError:
        return redirect("/admin-libros")
    except Exception as e:
        return redirect("/admin-libros")

    return render_template(
        "admin/admin-libros-modificar.html",
        id_libro=id_libro,
        id_autor=id_autor,
        titulo=titulo,
        generos_string=generos_string,
        resena=resena
        )

@app.route("/modificarLibro", methods=['POST'])
@login_required_users_admin
def modificarLibro():

    resena = request.form.get('resena')
    titulo = request.form.get('titulo')
    generos_id = request.form.getlist('generosID')
    generos_id = generos_id[0]

    fechaModificacion = datetime.datetime.now()

    try:
        autor_id = int(request.form.get('AutorID'));
        id_libro = int(request.form.get('id_libro'));
        result = db.execute(
            """
            SELECT ID FROM libros
            WHERE ID = ?
            """, id_libro)
        if not result:
            return jsonify(error='ID libro no valido'), 400
    except ValueError:
        return jsonify(error='ID libro no valido'), 400

    try:
        db.execute(
            """
                UPDATE libros
                SET titulo = ?,
                    AutorID = ?,
                    generosID = ?
                WHERE ID = ?
            """, titulo, autor_id, generos_id, id_libro)
    except:
        return "Error al modificar el libro.", 400

    try:
        if 'imagen-insertar-libro' in request.files:
            archivoIMG = request.files['imagen-insertar-libro']
            nombre_archivoIMG, extensionIMG = os.path.splitext(archivoIMG.filename)

            archivoIMG.save('static/libros/portadas/' + str(id_libro) + extensionIMG)

        if 'pdf-insertar-libro' in request.files:
            archivoPDF = request.files['pdf-insertar-libro']
            nombre_archivoPDF, extensionPDF = os.path.splitext(archivoPDF.filename)

            archivoPDF.save('static/libros/pdf/' + str(id_libro) + extensionPDF)

    except Exception as e:
        return 'Error al actualizar los archivos', 500

    try:
        ruta_destino_txt = 'static/libros/resena/' + str(id_libro) + '.txt'
        # Crea y guarda el archivo
        with open(ruta_destino_txt, 'w',  encoding='utf-8') as archivoTXT:
            archivoTXT.write(resena)
    except Exception as e:
        return 'Error al actualizar el txt', 500

    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Modificar"
        tabla = "Libros"
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, id_libro, fechaModificacion)
    except:
         return 'Error al guardar en el historial', 500
    #-----------
    return "Bien", 200


@app.route("/admin-autores")
@login_required_users_admin
def adminAutores():
    return render_template('admin/admin-autores.html')

@app.route('/obtenerAutoresAdmin', methods=["POST"])
@login_required_users_admin
def obtenerAutoresAdmin():
    datos = db.execute("SELECT * FROM autores ORDER BY apellidos")
    return jsonify(datos), 200

@app.route('/obtenerTotalAutoresAdmin', methods=["POST"])
@login_required_users_admin
def obtenerTotalAutoresAdmin():
    datos = db.execute(
        """SELECT count(ID) as total_autores FROM autores""")
    return jsonify(datos), 200


@app.route('/busquedaAutoresAdmin', methods=["POST"])
@login_required_users_admin
def busquedaAutoresAdmin():
    data = request.json.get('data')
    buscar = data['valor']
    if not buscar:
        return jsonify(error='<p>Debe escribir en el buscador para poder buscar.</p>'), 400
    resultados = db.execute(
        """
        SELECT *, nombres ||' '|| apellidos as nombreCompleto,
        apellidos ||' '|| nombres as nombreCompleto1
        FROM autores
        WHERE nombreCompleto LIKE ? OR nombreCompleto1 LIKE ?
        """, "%"+ buscar + "%", "%"+ buscar + "%")
    return jsonify(resultados), 200


@app.route('/abrirBiografiaAdmin', methods=["POST"])
@login_required_users_admin
def abrirBiografiaAdmin():
    data = request.json.get('data')

    try:
        id_autor = int(data['id'])
        resultados = db.execute("SELECT * FROM autores WHERE ID = ?", id_autor)
        if not resultados:
            return jsonify(error='ID de autor no valido'), 400
        file_path = "/static/autores/biografias/" + str(id_autor) + ".txt"
        file_path = app.root_path + file_path
    except ValueError:
        return jsonify(error='ID de autor no valido'), 400

    resultados = resultados[0]
    try:
        with open(file_path, encoding="UTF-8") as file:
            file_content = file.read()
            nombre = resultados['nombres'] + " " + resultados['apellidos']
            biografia = {
                "ID": resultados['ID'],
                "nombre": nombre,
                "biografia": file_content
            }
            return jsonify(biografia), 200

    except FileNotFoundError:
        return jsonify(error="El archivo no fue encontrado."), 400
    except Exception as e:
        mensaje = "Error al leer el archivo: " + str(e)
        return jsonify(error=mensaje), 400


@app.route("/admin-autor-insertar")
@login_required_users_admin
def adminAutorInsertar():
    return render_template('admin/admin-autor-insertar.html')


@app.route('/validarAutor', methods=["POST"])
@login_required_users_admin
def validarAutor():
    data = request.json.get('data')
    nombres = data["nombres"]
    apellidos = data["apellidos"]

    nombres = nombres.lower()
    apellidos = apellidos.lower()

    resultados = db.execute(
        """
        SELECT ID FROM autores
        WHERE nombres LIKE ?
        AND apellidos LIKE ?
        """, nombres, apellidos)
    return jsonify(resultados), 200


@app.route("/insertarAutor", methods=['POST'])
@login_required_users_admin
def insertarAutor():

    biografia = request.form.get('biografia')
    nombres = request.form.get('nombres')
    apellidos = request.form.get('apellidos')

    try:
        new_autor = db.execute(
            """
                INSERT INTO autores (nombres, apellidos)
                VALUES (?, ?)
            """, nombres, apellidos)
    except:
        return "Error al insertar el libro.", 400

    try:
        archivoIMG = request.files['imagen-insertar-autor']
        nombre_archivoIMG, extensionIMG = os.path.splitext(archivoIMG.filename)

        archivoIMG.save('static/autores/fotos/' + str(new_autor) + extensionIMG)


    except Exception as e:
        db.execute("""DELETE FROM autores WHERE ID = ?""",new_autor)
        return 'Error al guardar los archivos', 500

    try:
        ruta_destino_txt = 'static/autores/biografias/' + str(new_autor) + '.txt'
        # Crea y guarda el archivo
        with open(ruta_destino_txt, 'w',  encoding='utf-8') as archivoTXT:
            archivoTXT.write(biografia)
    except Exception as e:
        db.execute("""DELETE FROM autores WHERE ID = ?""",new_autor)
        return 'Error al crear el txt los archivos', 500

    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Insertar"
        tabla = "Autores"
        fechaInsertar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, new_autor, fechaInsertar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------
    return "Bien", 200

@app.route('/eliminarAutor', methods=["POST"])
@login_required_users_admin
def eliminarAutor():
    data = request.json.get('data')
    errores = ''
    try:
        id_autor = int(data['AutorID'])
        result = db.execute("SELECT ID FROM autores WHERE ID = ?", id_autor)
        if not result:
            return jsonify(error='ID autor no valido'), 400
    except ValueError:
        return jsonify(error='ID autor no valido'), 400

    try:
        resultados = db.execute(
            """DELETE FROM autores
            WHERE ID = ?
            """, id_autor)
    except:
        resultados = []
        return jsonify(resultados), 200

    try:
        ruta_archivoIMG = 'static/autores/fotos/' + str(id_autor) + '.jpg'
        ruta_archivoTXT = 'static/autores/biografias/' + str(id_autor) + '.txt'

        if os.path.exists(ruta_archivoIMG):
            os.remove(ruta_archivoIMG)
        else:
            errores += 'El archivo imagen no existe'

        if os.path.exists(ruta_archivoTXT):
            os.remove(ruta_archivoTXT)
        else:
            errores += 'El archivo TXT no existe'
    except Exception as e:
        return 'Error al eliminar los archivos', 500


    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Eliminar"
        tabla = "Autores"
        fechaEliminar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, id_autor, fechaEliminar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------

    return jsonify(resultados), 200


@app.route('/admin-autor-modificar')
@login_required_users_admin
def adminAutorModificar():
    try:
        id_autor = int(request.args.get('AutorID'))
        resultados = db.execute(
            """
            SELECT * FROM autores
            WHERE ID = ?
            """, id_autor)
        if not resultados:
            return redirect("/admin-autores")
        resultados = resultados[0]
    except ValueError:
        return redirect("/admin-autores")

    file_path = "/static/autores/biografias/" + str(id_autor) + ".txt"
    file_path = app.root_path + file_path
    nombres = resultados['nombres']
    apellidos = resultados['apellidos']

    try:
        with open(file_path, encoding="UTF-8") as file:
            file_content = file.read()
            biografia = file_content
    except FileNotFoundError:
        return redirect("/admin-autores")
    except Exception as e:
        return redirect("/admin-autores")

    return render_template(
        "admin/admin-autor-modificar.html",
        id_autor=id_autor,
        nombres=nombres,
        apellidos=apellidos,
        biografia=biografia
        )


@app.route("/modificarAutor", methods=['POST'])
@login_required_users_admin
def modificarAutor():

    biografia = request.form.get('biografia')
    nombres = request.form.get('nombres')
    apellidos = request.form.get('apellidos')

    try:
        AutorID = int(request.form.get('AutorID'))
        result = db.execute(
            """
            SELECT ID FROM autores
            WHERE ID = ?
            """, AutorID)
        if not result:
            return jsonify(error='ID autor no valido'), 400
    except ValueError:
        return jsonify(error='ID autor no valido'), 400

    try:
        db.execute(
            """
                UPDATE autores
                SET nombres = ?,
                apellidos = ?
                WHERE ID = ?
            """, nombres, apellidos, AutorID)
    except:
        return "Error al insertar el libro.", 400

    try:
        if 'imagen-insertar-autor' in request.files:
            archivoIMG = request.files['imagen-insertar-autor']
            nombre_archivoIMG, extensionIMG = os.path.splitext(archivoIMG.filename)

            archivoIMG.save('static/autores/fotos/' + str(AutorID) + extensionIMG)
    except Exception as e:
        return 'Error al guardar los archivos', 500

    try:
        ruta_destino_txt = 'static/autores/biografias/' + str(AutorID) + '.txt'
        # Crea y guarda el archivo
        with open(ruta_destino_txt, 'w',  encoding='utf-8') as archivoTXT:
            archivoTXT.write(biografia)
    except Exception as e:
        return 'Error al crear el txt los archivos', 500

    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Modificar"
        tabla = "Autores"
        fechaModificar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, AutorID, fechaModificar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------
    return "Bien", 200


@app.route("/admin-generos")
@login_required_users_admin
def adminGeneros():
    return render_template('admin/admin-generos.html')


@app.route('/busquedaGenerosAdmin', methods=["POST"])
@login_required_users_admin
def busquedaGenerosAdmin():
    data = request.json.get('data')
    buscar = data['valor']
    if not buscar:
        return jsonify(error='<p>Debe escribir en el buscador para poder buscar.</p>'), 400
    resultados = db.execute(
        """
        SELECT * FROM generos
        WHERE nombre LIKE ? """, "%"+ buscar + "%")
    return jsonify(resultados), 200


@app.route('/obtenerTotalGenerosAdmin', methods=["POST"])
@login_required_users_admin
def obtenerTotalGenerosAdmin():
    datos = db.execute(
        """SELECT count(ID) as total_generos FROM generos""")
    return jsonify(datos), 200


@app.route("/admin-genero-insertar")
@login_required_users_admin
def adminGeneroInsertar():
    return render_template('admin/admin-genero-insertar.html')


@app.route("/insertarGenero", methods=['POST'])
@login_required_users_admin
def insertarGenero():

    nombre = request.form.get('nombre')

    try:
        new_genero = db.execute(
            """
                INSERT INTO generos (nombre)
                VALUES (?)
            """, nombre)
    except:
        return "Error al insertar el genero.", 400

    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Insertar"
        tabla = "Generos"
        fechaInsertar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, new_genero, fechaInsertar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------
    return "Bien", 200

@app.route('/validarGenero', methods=["POST"])
@login_required_users_admin
def validarGenero():
    data = request.json.get('data')
    nombre = data["nombre"]

    nombre = nombre.lower()

    resultados = db.execute(
        """
        SELECT ID FROM generos
        WHERE nombre LIKE ?
        """, nombre)
    return jsonify(resultados), 200


@app.route('/admin-genero-modificar')
@login_required_users_admin
def adminGeneroModificar():
    try:
        GeneroID = int(request.args.get('GeneroID'))
        resultados = db.execute(
            """
            SELECT * FROM generos
            WHERE ID = ?
            """, GeneroID)
        if not resultados:
            return redirect("/admin-generos")
        resultados = resultados[0]
    except ValueError:
        return redirect("/admin-generos")

    nombre = resultados['nombre']

    return render_template(
        "admin/admin-genero-modificar.html",
        id_genero=GeneroID,
        nombre=nombre
        )

@app.route("/modificarGenero", methods=['POST'])
@login_required_users_admin
def modificarGenero():

    nombre = request.form.get('nombre')

    try:
        id_genero = int(request.form.get('id_genero'))
        result = db.execute(
            """
            SELECT ID FROM generos
            WHERE ID = ?
            """, id_genero)
        if not result:
            return jsonify(error='ID genero no valido'), 400
    except ValueError:
        return jsonify(error='ID genero no valido'), 400

    try:
        db.execute(
            """
                UPDATE generos
                SET nombre = ?
                WHERE ID = ?
            """, nombre, id_genero)
    except:
        return "Error al insertar el genero.", 400

    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Insertar"
        tabla = "Generos"
        fechaModificar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, id_genero, fechaModificar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------
    return "Bien", 200

@app.route('/eliminarGenero', methods=["POST"])
@login_required_users_admin
def eliminarGenero():
    data = request.json.get('data')
    errores = ''
    try:
        GeneroID = int(data['GeneroID'])
        result = db.execute("SELECT ID FROM generos WHERE ID = ?", GeneroID)
        if not result:
            return jsonify(error='ID genero no valido'), 400
    except ValueError:
        return jsonify(error='ID genero no valido'), 400

    try:
        resultados = db.execute(
            """DELETE FROM generos
            WHERE ID = ?
            """, GeneroID)
    except:
        resultados = []
        return jsonify(resultados), 200


    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Eliminar"
        tabla = "Generos"
        fechaEliminar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, GeneroID, fechaEliminar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------

    return jsonify(resultados), 200





@app.route("/admin-usuarios")
@login_required_users_admin
def adminUsuarios():
    return render_template('admin/admin-usuarios.html')


@app.route('/obtenerUsuarios', methods=["POST"])
@login_required_users_admin
def obtenerUsuarios():
    datos = db.execute("SELECT * FROM usuarios ORDER BY nombre")
    return jsonify(datos), 200

@app.route('/obtenerTotalUsuarios', methods=["POST"])
@login_required_users_admin
def obtenerTotalUsuarios():
    datos = db.execute(
        """SELECT count(ID) as total_usuarios FROM usuarios""")
    return jsonify(datos), 200


@app.route("/admin-usuario-insertar")
@login_required_users_admin
def adminUsuarioInsertar():
    return render_template('admin/admin-usuario-insertar.html')

@app.route("/registerUsuarioAdmin", methods=["POST"])
@login_required_users_admin
def registerUsuarioAdmin():

    data = request.json.get('data')
    user = data['user']
    password = data['pass']
    confirm = data['confirm']

    if not user:
        return jsonify(error='<p>Debe rellenar el campo de usuario.</p>'), 400
    if not password:
        return jsonify(error='<p>Debe rellenar el campo de contraseña.</p>'), 400
    if not confirm:
        return jsonify(error='<p>Debe rellenar el campo de repetir contraseña.</p>'), 400
    if password != confirm:
        return jsonify(error='<p>Las contraseñas no cohinciden.</p>'), 400

    hash_pass = generate_password_hash(password)

    try:
        new_user = db.execute("INSERT INTO usuarios (nombre, contrasena) VALUES (?, ?)", user, hash_pass)
    except:
        return jsonify(error='<p>El nombre de usuario ya existe</p>'), 400

    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Insertar"
        tabla = "Usuarios"
        fechaInsertar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, new_user, fechaInsertar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------

    # Redirect user to home page
    return jsonify(message="Redirigiendo"), 200

@app.route("/modificarUsuarioAdmin", methods=["POST"])
@login_required_users_admin
def modificarUsuarioAdmin():

    data = request.json.get('data')
    user = data['user']
    try:
        UsuarioID = int(data['UsuarioID'])
        result = db.execute(
            """
            SELECT * FROM usuarios
            WHERE ID = ?
            """, UsuarioID)
        if not result:
            return jsonify(error='ID usuario no valido'), 400
        result = result[0]
    except ValueError:
        return jsonify(error='ID usuario no valido'), 400
    actual_hash = result['contrasena']

    if not user:
        return jsonify(error='<p>Debe rellenar el campo de usuario.</p>'), 400

    if 'actualPass' in data:
        actualPass = data['actualPass']
        if not check_password_hash(actual_hash, actualPass):
            return jsonify(error='<p>La contraseña escrita no es la actual.</p>'), 400
        if 'pass' in data:
            password = data['pass']
            if not password:
                return jsonify(error='<p>Debe rellenar el campo de contraseña.</p>'), 400
            if 'confirm' in data:
                confirm = data['confirm']
                if not confirm:
                    return jsonify(error='<p>Debe rellenar el campo de repetir contraseña.</p>'), 400
                if password != confirm:
                    return jsonify(error='<p>Las contraseñas no cohinciden.</p>'), 400
                hash_pass = generate_password_hash(password)
                try:
                    db.execute(
                        """
                        UPDATE usuarios
                        SET nombre = ?,
                        contrasena = ?
                        WHERE ID = ?
                        """, user, hash_pass, UsuarioID)
                except:
                    return jsonify(error='<p>Error al actualizar el usuario.</p>'), 400
    else:
        try:
            db.execute(
                """
                UPDATE usuarios
                SET nombre = ?
                WHERE ID = ?
                """, user, UsuarioID)
        except:
            return jsonify(error='<p>Error al actualizar el usuario.</p>'), 400

    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Modificar"
        tabla = "Usuarios"
        fechaInsertar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, UsuarioID, fechaInsertar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------

    # Redirect user to home page
    return jsonify(message="Redirigiendo"), 200


@app.route("/registerAdminAdmin", methods=["POST"])
@login_required_users_admin
def registerAdminAdmin():

    data = request.json.get('data')
    user = data['user']
    password = data['pass']
    confirm = data['confirm']

    if not user:
        return jsonify(error='<p>Debe rellenar el campo de usuario.</p>'), 400
    if not password:
        return jsonify(error='<p>Debe rellenar el campo de contraseña.</p>'), 400
    if not confirm:
        return jsonify(error='<p>Debe rellenar el campo de repetir contraseña.</p>'), 400
    if password != confirm:
        return jsonify(error='<p>Las contraseñas no cohinciden.</p>'), 400

    hash_pass = generate_password_hash(password)

    try:
        new_admin = db.execute("INSERT INTO admins (nombre, contrasena) VALUES (?, ?)", user, hash_pass)
    except:
        return jsonify(error='<p>El nombre de Admin ya existe</p>'), 400


    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Insertar"
        tabla = "Admins"
        fechaInsertar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, new_admin, fechaInsertar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------

    # Redirect user to home page
    return jsonify(message="Redirigiendo"), 200


@app.route("/modificarAdminAdmin", methods=["POST"])
@login_required_users_admin
def modificarAdminAdmin():

    data = request.json.get('data')
    user = data['user']
    try:
        AdminID = int(data['AdminID'])
        result = db.execute(
            """
            SELECT * FROM admins
            WHERE ID = ?
            """, AdminID)
        if not result:
            return jsonify(error='ID admin no valido'), 400
        result = result[0]
    except ValueError:
        return jsonify(error='ID admin no valido'), 400
    actual_hash = result['contrasena']

    if not user:
        return jsonify(error='<p>Debe rellenar el campo de usuario.</p>'), 400

    if 'actualPass' in data:
        actualPass = data['actualPass']
        if not check_password_hash(actual_hash, actualPass):
            return jsonify(error='<p>La contraseña escrita no es la actual.</p>'), 400
        if 'pass' in data:
            password = data['pass']
            if not password:
                return jsonify(error='<p>Debe rellenar el campo de contraseña.</p>'), 400
            if 'confirm' in data:
                confirm = data['confirm']
                if not confirm:
                    return jsonify(error='<p>Debe rellenar el campo de repetir contraseña.</p>'), 400
                if password != confirm:
                    return jsonify(error='<p>Las contraseñas no cohinciden.</p>'), 400
                hash_pass = generate_password_hash(password)
                try:
                    db.execute(
                        """
                        UPDATE admins
                        SET nombre = ?,
                        contrasena = ?
                        WHERE ID = ?
                        """, user, hash_pass, AdminID)
                except:
                    return jsonify(error='<p>Error al actualizar el usuario.</p>'), 400
    else:
        try:
            db.execute(
                """
                UPDATE admins
                SET nombre = ?
                WHERE ID = ?
                """, user, AdminID)
        except:
            return jsonify(error='<p>Error al actualizar el usuario.</p>'), 400

    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Modificar"
        tabla = "Admins"
        fechaInsertar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, AdminID, fechaInsertar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------

    # Redirect user to home page
    return jsonify(message="Redirigiendo"), 200



@app.route("/admin-admin-insertar")
@login_required_users_admin
def adminAdminInsertar():
    return render_template('admin/admin-admin-insertar.html')


@app.route("/admin-usuario-modificar")
@login_required_users_admin
def adminUsuarioModificar():

    try:
        UsuarioID = int(request.args.get('UsuarioID'))
        resultados = db.execute(
            """
            SELECT * FROM usuarios
            WHERE ID = ?
            """, UsuarioID)
        if not resultados:
            return redirect("/admin-usuarios")
        resultados = resultados[0]
    except ValueError:
        return redirect("/admin-usuarios")

    nombre = resultados['nombre']

    return render_template(
        'admin/admin-usuario-modificar.html',
        nombre=nombre,
        id_usuario=UsuarioID
        )


@app.route("/admin-admin-modificar")
@login_required_users_admin
def adminAdminModificar():

    try:
        AdminID = int(request.args.get('AdminID'))
        resultados = db.execute(
            """
            SELECT * FROM admins
            WHERE ID = ?
            """, AdminID)
        if not resultados:
            return redirect("/admin-usuarios")
        resultados = resultados[0]
    except ValueError:
        return redirect("/admin-usuarios")

    nombre = resultados['nombre']

    return render_template(
        'admin/admin-admin-modificar.html',
        nombre=nombre,
        id_admin=AdminID
        )

@app.route('/eliminarUsuario', methods=["POST"])
@login_required_users_admin
def eliminarUsuario():
    data = request.json.get('data')
    errores = ''
    try:
        UsuarioID = int(data['UsuarioID'])
        result = db.execute("SELECT ID FROM usuarios WHERE ID = ?", UsuarioID)
        if not result:
            return jsonify(error='ID usuario no valido'), 400
    except ValueError:
        return jsonify(error='ID usuario no valido'), 400

    try:
        resultados = db.execute(
            """DELETE FROM usuarios
            WHERE ID = ?
            """, UsuarioID)
    except:
        resultados = []
        return jsonify(resultados), 200


    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Eliminar"
        tabla = "Usuarios"
        fechaEliminar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, UsuarioID, fechaEliminar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------

    return jsonify(resultados), 200


@app.route('/busquedaUsuarios', methods=["POST"])
@login_required_users_admin
def busquedaUsuarios():
    data = request.json.get('data')
    buscar = data['valor']
    if not buscar:
        return jsonify(error='<p>Debe escribir en el buscador para poder buscar.</p>'), 400
    resultadosUsuarios = db.execute(
        """
        SELECT * FROM usuarios
        WHERE nombre LIKE ? """, "%"+ buscar + "%")
    resultadosAdmins = db.execute(
        """
        SELECT * FROM admins
        WHERE nombre LIKE ? """, "%"+ buscar + "%")
    resultados = {
        "resultadosUsuarios": resultadosUsuarios,
        "resultadosAdmins":resultadosAdmins
        }

    return jsonify(resultados), 200


@app.route('/obtenerAdmins', methods=["POST"])
@login_required_users_admin
def obtenerAdmins():
    datos = db.execute("SELECT * FROM admins ORDER BY nombre")
    return jsonify(datos), 200

@app.route('/obtenerTotalAdmins', methods=["POST"])
@login_required_users_admin
def obtenerTotalAdmins():
    datos = db.execute(
        """SELECT count(ID) as total_admins FROM admins""")
    return jsonify(datos), 200



@app.route('/eliminarAdmins', methods=["POST"])
@login_required_users_admin
def eliminarAdmins():
    data = request.json.get('data')
    errores = ''
    try:
        AdminID = int(data['AdminID'])
        result = db.execute("SELECT ID FROM admins WHERE ID = ?", AdminID)
        if not result:
            return jsonify(error='ID admin no valido'), 400
    except ValueError:
        return jsonify(error='ID admin no valido'), 400

    try:
        resultados = db.execute(
            """DELETE FROM admins
            WHERE ID = ?
            """, AdminID)
    except:
        resultados = []
        return jsonify(resultados), 200


    # Historial-----
    try:
        adminID = session["user_admin_id"]
        operacion = "Eliminar"
        tabla = "Admins"
        fechaEliminar = datetime.datetime.now()
        db.execute(
            """
                INSERT INTO historial (AdminID, Operacion, Tabla, IDregistro, Fecha)
                VALUES (?, ?, ?, ?, ?)
            """, adminID, operacion, tabla, AdminID, fechaEliminar)
    except:
         return 'Error al guardar en el historial', 500
    #-----------

    return jsonify(resultados), 200




@app.route("/admin-historial")
@login_required_users_admin
def adminHistorial():
    return render_template('admin/admin-historial.html')

@app.route('/obtenerHistorial', methods=["POST"])
@login_required_users_admin
def obtenerHistorial():
    datos = db.execute("SELECT * FROM historial ORDER BY Fecha DESC")
    return jsonify(datos), 200
