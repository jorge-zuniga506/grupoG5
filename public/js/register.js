import { postUsuarios, getUsuarios } from "../services/serviciosUsuario.js";

const nombre = document.getElementById('nombre')
const email = document.getElementById('email')
const telefono = document.getElementById('telefono')
const password = document.getElementById('password')
const btnRegistrarse = document.getElementById('btnRegistrarse')


async function registrarUsuario(e) {
    e.preventDefault();

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
        password: password.value
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

btnRegistrarse.addEventListener('click', registrarUsuario)