
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log('Enviando datos de registro:', data);

    try {
        const response = await fetch('/api/ciudadanos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        console.log('Respuesta del servidor (status):', response.status);

        if (response.ok) {
            const result = await response.json();
            console.log('--- REGISTRO EXITOSO ---', result);
            alert('¡Usuario registrado exitosamente!');
            window.location.href = '/pages/login.html';
        } else {
            const errorText = await response.text();
            console.error('Error en registro:', response.status, errorText);
            alert(`Error al registrar usuario: ${response.status}`);
        }
    } catch (error) {
        console.error('Error de red/conexión:', error);
        alert('No se pudo conectar con el servidor. ¿Está encendido?');
    }
});
