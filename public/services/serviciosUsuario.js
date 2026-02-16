async function getUsuarios() {
    const peticion = await fetch('http://localhost:3001/usuarios');
    const datos = await peticion.json();
    return datos;
}

async function postUsuarios(data) {
    const peticion = await fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const datos = await peticion.json();
    return datos;
}

async function deleteUsuarios(id) {
    const peticion = await fetch('http://localhost:3001/usuarios', {
        method: 'Delete',
    })
    const datos = await peticion.json();
    return datos;
}
export { getUsuarios, postUsuarios, deleteUsuarios };