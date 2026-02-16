async function getUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/usuarios');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al obtener usuarios", error);
    }
}

async function postUsuario(usuario) {
    try {
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al obtener usuarios", error);
    }
}

async function putUsuario(usuario) {
    try {
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al obtener usuarios", error);
    }
}

async function deleteUsuario(usuario) {
    try {
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al obtener usuarios", error);
    }
}