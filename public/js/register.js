import { postUsuarios } from "../services/serviciosUsuario.js";

const nombre = document.getElementById('nombre')
const email = document.getElementById('email')
const telefono = document.getElementById('telefono')
const password = document.getElementById('password')
const btnRegistrarse = document.getElementById('btnRegistrarse')


async function registrarUsuario(e) {
    e.preventDefault();
    const objUsuario = {
        nombre: nombre.value,
        email: email.value,
        telefono: telefono.value,
        password: password.value
    }
    await postUsuarios(objUsuario)
}

btnRegistrarse.addEventListener('click', registrarUsuario)