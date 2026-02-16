
if (window.location.protocol === 'file:') {
    alert('¡ATENCIÓN! Estás abriendo el archivo directamente.\n\nPara que el registro funcione, debes usar esta dirección en tu navegador:\nhttp://localhost:3000/pages/register.html');
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/ciudadanos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            alert('¡Usuario registrado exitosamente!');
            window.location.href = 'login.html';
        } else {
            let errorMessage = "Error en el servidor";
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Not JSON
            }
            alert(`Error al registrar usuario: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('No se pudo conectar con el servidor. ¿Está encendido?');
    }
});
