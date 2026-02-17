import { getUsuarios } from "../services/serviciosUsuario.js";

const btnCitizen = document.getElementById('btnCitizen');
const btnAdmin = document.getElementById('btnAdmin');
const roleInput = document.getElementById('role');
const adminCodeGroup = document.getElementById('adminCodeGroup');
const adminCodeInput = document.getElementById('adminCode');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnIniciarSesion = document.getElementById('btnIniciarSesion');


const switchRole = (role) => {
    roleInput.value = role;
    if (role === 'admin') {
        adminCodeGroup.style.display = 'block';
        adminCodeInput.setAttribute('required', 'true');
        btnAdmin.classList.add('active');
        btnCitizen.classList.remove('active');
    } else {
        adminCodeGroup.style.display = 'none';
        adminCodeInput.removeAttribute('required');
        btnCitizen.classList.add('active');
        btnAdmin.classList.remove('active');
    }
};

btnCitizen.addEventListener('click', () => switchRole('citizen'));
btnAdmin.addEventListener('click', () => switchRole('admin'));


async function inicioUsuario(e) {
    e.preventDefault();
    const usuarios = await getUsuarios();

    const usuarioValido = usuarios.find((usuario) => usuario.email === emailInput.value && usuario.password === passwordInput.value);

    if (usuarioValido) {
        // Enforce role check and admin code
        if (roleInput.value === 'admin') {
            if (usuarioValido.rol !== 'admin') {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso Denegado',
                    text: 'No tienes permisos de administrador',
                    confirmButtonColor: '#1A1A54'
                });
                return;
            }
            if (adminCodeInput.value !== 'cr7teamo') {
                Swal.fire({
                    icon: 'error',
                    title: 'Código Incorrecto',
                    text: 'El código de administrador es incorrecto',
                    confirmButtonColor: '#1A1A54'
                });
                return;
            }
        }

        localStorage.setItem('currentUser', JSON.stringify(usuarioValido));

        Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Inicio de sesión exitoso',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            if (usuarioValido.rol === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'cuidadano.html';
            }
        });

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Usuario o contraseña incorrectos',
            confirmButtonColor: '#1A1A54'
        });
    }
}

btnIniciarSesion.addEventListener('click', inicioUsuario);  