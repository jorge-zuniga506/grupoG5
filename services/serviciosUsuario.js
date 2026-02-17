async function getUsuarios() {
    const peticion = await fetch('http://localhost:3001/usuarios');
    const datos = await peticion.json();
    return datos;
}

async function postUsuarios(data, endpoint = 'usuarios') {
    const peticion = await fetch(`http://localhost:3001/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const datos = await peticion.json();
    return datos;
}

async function deleteUsuarios(id, endpoint = 'usuarios') {
    const peticion = await fetch(`http://localhost:3001/${endpoint}/${id}`, {
        method: 'DELETE',
    })
    const datos = await peticion.json();
    return datos;
}
export { getUsuarios, postUsuarios, deleteUsuarios };