
document.addEventListener('DOMContentLoaded', () => {
    console.log('--- VERIFICANDO SESIÓN ---');
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('role');

    if (user) {
        console.log('Sesión activa detectada:', user);
        console.log('Rol:', role);

        // Update UI if elements exist
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const ctaButtons = document.querySelector('.cta-buttons');

        if (heroTitle) {
            heroTitle.textContent = `Hola, ${user.nombre || user.email}`;
            heroSubtitle.textContent = `Has iniciado sesión como ${role === 'admin' ? 'Administrador' : 'Ciudadano'}.`;
        }

        if (ctaButtons) {
            ctaButtons.innerHTML = `
                <button id="btnLogout" class="btn-secondary" style="width: auto; padding: 1rem 2rem;">Cerrar Sesión</button>
            `;

            document.getElementById('btnLogout').addEventListener('click', () => {
                console.log('Cerrando sesión...');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                localStorage.removeItem('loginTime');
                window.location.reload();
            });
        }
    } else {
        console.log('No hay sesión activa.');
    }
});
