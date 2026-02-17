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
    console.log(`SERVICIO: Intentando eliminar ${endpoint} con ID: ${id}`);
    try {
        const response = await fetch(`http://localhost:3001/${endpoint}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Servidor respondió ${response.status}: ${errorText || response.statusText}`);
        }

        console.log(`SERVICIO: Eliminación de ${id} completada exitosamente.`);
        return { success: true };
    } catch (error) {
        console.error("SERVICIO ERROR:", error);
        throw error;
    }
}
export { getUsuarios, postUsuarios, deleteUsuarios };