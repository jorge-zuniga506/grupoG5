import { getAllData, postData, patchData, deleteData } from "../crud.js";

const tabla = document.getElementById("tablaUsuarios");

/**
 * Muestra la lista de usuarios en la tabla.
 */
async function mostrarUsuarios() {
    try {
        const usuarios = await getAllData("usuarios");
        tabla.innerHTML = "";

        usuarios.forEach(usuario => {
            const tr = document.createElement("tr");

            // Determinar rol y estado legibles
            const rolActual = usuario.rol || "Usuario";
            const estadoActual = usuario.activo !== false ? "Activo" : "Inactivo";

            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.correo}</td>
                <td>${rolActual}</td>
                <td>${estadoActual}</td>
                <td>
                    <button class="btn-rol">Cambiar Rol</button>
                    <button class="btn-estado">Activar/Desactivar</button>
                    <button class="btn-eliminar">Eliminar</button>
                </td>
            `;

            // Asignar eventos a los botones
            tr.querySelector(".btn-rol").addEventListener("click", () => cambiarRol(usuario));
            tr.querySelector(".btn-estado").addEventListener("click", () => cambiarEstado(usuario));
            tr.querySelector(".btn-eliminar").addEventListener("click", () => eliminarUsuario(usuario.id));

            tabla.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

/**
 * Registra un nuevo usuario.
 */
document.getElementById("formUsuario").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const rol = document.getElementById("rol").value;

    const nuevoUsuario = {
        nombre,
        correo,
        rol,
        activo: true
    };

    try {
        await postData("usuarios", nuevoUsuario);
        mostrarUsuarios();
        this.reset();
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        alert("Error al registrar el usuario.");
    }
});

/**
 * Elimina un usuario por ID.
 * @param {string|number} id 
 */
async function eliminarUsuario(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        try {
            await deleteData("usuarios", id);
            mostrarUsuarios();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("No se pudo eliminar el usuario.");
        }
    }
}

/**
 * Activa o desactiva un usuario.
 * @param {Object} usuario 
 */
async function cambiarEstado(usuario) {
    const nuevoEstado = !usuario.activo;
    try {
        await patchData("usuarios", usuario.id, { activo: nuevoEstado });
        mostrarUsuarios();
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        alert("Error al cambiar el estado del usuario.");
    }
}

/**
 * Alterna el rol del usuario entre Usuario y Administrador.
 * @param {Object} usuario 
 */
async function cambiarRol(usuario) {
    const nuevoRol = usuario.rol === "Administrador" ? "Usuario" : "Administrador";
    try {
        await patchData("usuarios", usuario.id, { rol: nuevoRol });
        mostrarUsuarios();
    } catch (error) {
        console.error("Error al cambiar rol:", error);
        alert("Error al cambiar el rol del usuario.");
    }
}

// Carga inicial
mostrarUsuarios();