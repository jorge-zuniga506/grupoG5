import { getUsuarios, postUsuarios, putUsuarios, patchUsuarios, deleteUsuarios } from "../services/serviciosUsuario.js";

const listaUsuarios = document.getElementById('listaUsuarios');
const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
const modalUsuario = document.getElementById('modalUsuario');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const formUsuario = document.getElementById('formUsuario');
const modalTitle = document.getElementById('modalTitle');

let isEditing = false;
let currentUserId = null;

// Cargar usuarios al iniciar
document.addEventListener('DOMContentLoaded', cargarUsuarios);

async function cargarUsuarios() {
    listaUsuarios.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando...</td></tr>';
    try {
        const usuarios = await getUsuarios();
        renderUsuarios(usuarios);
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        listaUsuarios.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--danger);">Error al conectar con el servidor</td></tr>';
    }
}

function renderUsuarios(usuarios) {
    listaUsuarios.innerHTML = '';
    usuarios.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = 'user-row';
        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--glass-border); display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user" style="color: var(--text-muted)"></i>
                    </div>
                    <span>${user.nombre}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="badge ${user.rol === 'admin' ? 'badge-admin' : 'badge-user'}">${user.rol || 'usuario'}</span>
            </td>
            <td>
                <span class="badge ${user.activo !== false ? 'badge-active' : 'badge-inactive'}">
                    ${user.activo !== false ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="actions">
                <button class="action-btn" title="Editar" onclick="window.editUser('${user.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" title="${user.activo !== false ? 'Desactivar' : 'Activar'}" onclick="window.toggleStatus('${user.id}', ${user.activo !== false})">
                    <i class="fas ${user.activo !== false ? 'fa-user-slash' : 'fa-user-check'}"></i>
                </button>
                <button class="action-btn" title="Cambiar Rol" onclick="window.changeRole('${user.id}', '${user.rol}')">
                    <i class="fas fa-user-tag"></i>
                </button>
                <button class="action-btn delete" title="Eliminar" onclick="window.deleteUser('${user.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        listaUsuarios.appendChild(tr);
    });
}

// Modal Logic
btnNuevoUsuario.addEventListener('click', () => {
    isEditing = false;
    currentUserId = null;
    modalTitle.innerText = 'Registrar Nuevo Usuario';
    formUsuario.reset();
    document.getElementById('userId').value = '';
    modalUsuario.style.display = 'flex';
});

btnCerrarModal.addEventListener('click', () => {
    modalUsuario.style.display = 'none';
});

formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        rol: document.getElementById('rol').value,
        activo: true // Por defecto nuevos son activos
    };

    const passwordInput = document.getElementById('password').value;
    if (passwordInput) {
        formData.password = passwordInput;
    }

    try {
        if (isEditing) {
            await putUsuarios(currentUserId, formData);
        } else {
            await postUsuarios(formData);
        }
        modalUsuario.style.display = 'none';
        cargarUsuarios();
    } catch (error) {
        alert("Error al guardar usuario");
    }
});

// exposed to window for inline onclicks
window.editUser = async (id) => {
    const usuarios = await getUsuarios();
    const user = usuarios.find(u => u.id == id);
    if (!user) return;

    isEditing = true;
    currentUserId = id;
    modalTitle.innerText = 'Editar Usuario';

    document.getElementById('userId').value = user.id;
    document.getElementById('nombre').value = user.nombre;
    document.getElementById('email').value = user.email;
    document.getElementById('telefono').value = user.telefono || '';
    document.getElementById('rol').value = user.rol || 'usuario';
    document.getElementById('password').value = ''; // Don't show password

    modalUsuario.style.display = 'flex';
};

window.deleteUser = async (id) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        try {
            await deleteUsuarios(id);
            cargarUsuarios();
        } catch (error) {
            alert("Error al eliminar");
        }
    }
};

window.toggleStatus = async (id, currentStatus) => {
    try {
        await patchUsuarios(id, { activo: !currentStatus });
        cargarUsuarios();
    } catch (error) {
        alert("Error al cambiar estado");
    }
};

window.changeRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'usuario' : 'admin';
    if (confirm(`¿Cambiar rol a ${newRole}?`)) {
        try {
            await patchUsuarios(id, { rol: newRole });
            cargarUsuarios();
        } catch (error) {
            alert("Error al cambiar rol");
        }
    }
};
