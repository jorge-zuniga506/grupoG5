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
        alert("Inicio de sesión exitoso")
    } else {
        alert("Usuario o contraseña incorrectos")
    }
}

btnIniciarSesion.addEventListener('click', inicioUsuario);  