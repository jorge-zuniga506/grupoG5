const btnCitizen = document.getElementById('btnCitizen');
const btnAdmin = document.getElementById('btnAdmin');
const roleInput = document.getElementById('role');
const adminCodeGroup = document.getElementById('adminCodeGroup');
const adminCodeInput = document.getElementById('adminCode');

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

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const role = document.getElementById('role').value;

    data.role = role;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('--- LOGIN EXITOSO ---');
            console.log('Usuario:', result.user);
            console.log('Rol:', result.role);
            console.log('Guardando datos en localStorage...');

            // Store user info
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('role', result.role);
            localStorage.setItem('loginTime', new Date().toISOString());

            alert('Login exitoso');

            if (role === 'admin') {
                window.location.href = '/pages/home.html';
            } else {
                window.location.href = '/pages/home.html';
            }
        } else {
            console.error('Error de autenticación:', result.message);
            alert(result.message || 'Error en el inicio de sesión');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
});
