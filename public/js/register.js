import { postUsuarios, getUsuarios } from "../services/serviciosUsuario.js";

const nombre = document.getElementById('nombre');
const email = document.getElementById('email');
const telefono = document.getElementById('telefono');
const password = document.getElementById('password');
const btnRegistrarse = document.getElementById('btnRegistrarse');
const roleInput = document.getElementById('role');
const adminCodeGroup = document.getElementById('adminCodeGroup');
const adminCodeInput = document.getElementById('adminCode');
const btnCitizen = document.getElementById('btnCitizen');
const btnAdmin = document.getElementById('btnAdmin');

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

if (btnCitizen) btnCitizen.addEventListener('click', () => switchRole('citizen'));
if (btnAdmin) btnAdmin.addEventListener('click', () => switchRole('admin'));

async function registrarUsuario(e) {
    e.preventDefault();

    // Validar código de administrador si el rol es admin
    if (roleInput.value === 'admin') {
        if (adminCodeInput.value !== 'cr7teamo') {
            Swal.fire({
                icon: 'error',
                title: 'Código Incorrecto',
                text: 'El código de administrador es incorrecto.',
                confirmButtonColor: '#1A1A54'
            });
            return;
        }
    }

    const usuarios = await getUsuarios();

    const emailExiste = usuarios.find(u => u.email === email.value);
    const telefonoExiste = usuarios.find(u => u.telefono === telefono.value);

    if (emailExiste) {
        Swal.fire({
            icon: 'warning',
            title: 'Correo Duplicado',
            text: 'Este correo electrónico ya está registrado.',
            confirmButtonColor: '#1A1A54'
        });
        return;
    }

    if (telefonoExiste) {
        Swal.fire({
            icon: 'warning',
            title: 'Teléfono Duplicado',
            text: 'Este número de teléfono ya está registrado.',
            confirmButtonColor: '#1A1A54'
        });
        return;
    }

    const objUsuario = {
        nombre: nombre.value,
        email: email.value,
        telefono: telefono.value,
        password: password.value,
        rol: roleInput.value
    }

    await postUsuarios(objUsuario);

    Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: 'Tu cuenta ha sido creada correctamente.',
        timer: 2500,
        showConfirmButton: false
    }).then(() => {
        window.location.href = "login.html";
    });
}

if (btnRegistrarse) btnRegistrarse.addEventListener('click', registrarUsuario);