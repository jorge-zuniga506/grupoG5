import { getUsuarios, postUsuarios, deleteUsuarios } from "../services/serviciosUsuario.js";

// Session Security: Logout on refresh
if (performance.getEntriesByType("navigation")[0].type === "reload") {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Session Validation
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
} else if (currentUser.rol !== 'admin') {
    window.location.href = 'cuidadano.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const userNameSpan = document.getElementById('userName');
    const btnLogout = document.getElementById('btnLogout');
    const contentContainer = document.querySelector('.content');

    if (userNameSpan) userNameSpan.textContent = `Hola, ${currentUser.nombre}`;

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'home.html';
        });
    }

    const links = {
        'gestion-reportes': document.getElementById('gestion-reportes'),
        'gestion-proyectos': document.getElementById('gestion-proyectos'),
        'gestion-servicios': document.getElementById('gestion-servicios')
    };

    let currentSection = 'gestion-reportes';

    const loadContent = async (section) => {
        contentContainer.innerHTML = '<div style="text-align:center; padding:50px;">Cargando...</div>';

        switch (section) {
            case 'gestion-reportes':
                contentContainer.innerHTML = `
                    <h2>Gestión de Reportes</h2>
                    <p>Aquí puedes administrar las denuncias recibidas.</p>
                    <div id="adminReportList" class="report-list" style="display:grid; gap:20px; margin-top:20px;"></div>
                `;

                try {
                    const data = await getUsuarios(); // This gets /usuarios, but we need /servicios
                    // Wait, getUsuarios only does /usuarios. Let's fetch directly or fix the service.
                    const response = await fetch('http://localhost:3001/servicios');
                    const servicios = await response.json();

                    const listContainer = document.getElementById('adminReportList');
                    listContainer.innerHTML = '';

                    if (servicios.length === 0) {
                        listContainer.innerHTML = '<p>No hay reportes para mostrar.</p>';
                    } else {
                        servicios.reverse().forEach(report => {
                            const card = document.createElement('div');
                            card.className = 'card';
                            card.style.cssText = 'background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 5px solid #1A1A54;';
                            card.innerHTML = `
                                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                    <div>
                                        <h3 style="margin-top:0;">${report.title}</h3>
                                        <p><strong>Categoría:</strong> ${report.category}</p>
                                        <p>${report.description}</p>
                                        <p><small>📍 ${report.location}</small></p>
                                    </div>
                                    <button class="delete-admin-btn" data-id="${report.id}" style="background:#e74c3c; color:white; border:none; padding:10px 15px; border-radius:4px; cursor:pointer; min-width:120px;">
                                        <i class="fas fa-trash"></i> Eliminar
                                    </button>
                                </div>
                                <div style="margin-top:10px; font-size:0.85em; color:#666;">ID: ${report.id} | Fecha: ${report.date}</div>
                            `;
                            listContainer.appendChild(card);
                        });
                    }
                } catch (err) {
                    contentContainer.innerHTML = '<p style="color:red;">Error al cargar reportes.</p>';
                }
                break;

            case 'gestion-proyectos':
                contentContainer.innerHTML = '<h2>Gestión de Proyectos</h2><p>Contenido de proyectos.</p>';
                break;
            default:
                contentContainer.innerHTML = '<h2>Panel de Administración</h2><p>Seleccione una opción.</p>';
        }
    };

    // Robust Event Delegation for DELETE
    contentContainer.addEventListener('click', async (e) => {
        const deleteBtn = e.target.closest('.delete-admin-btn');
        if (!deleteBtn) return;

        const id = deleteBtn.getAttribute('data-id');

        const confirmResult = await Swal.fire({
            title: '¿Confirmar eliminación?',
            text: "Esta acción usará un método DELETE para remover el reporte permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1A1A54',
            cancelButtonColor: '#e74c3c',
            confirmButtonText: 'Sí, eliminar permanentemente',
            cancelButtonText: 'Cancelar'
        });

        if (confirmResult.isConfirmed) {
            try {
                // Use the service which now has detailed logging
                await deleteUsuarios(id, 'servicios');

                await Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El reporte ha sido eliminado usando el método DELETE local.',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Force immediate refresh
                loadContent(currentSection);
            } catch (error) {
                console.error("FAIL:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Fallo al eliminar',
                    text: `Error de servidor: ${error.message}`
                });
            }
        }
    });

    // Sidebar listeners
    for (const [key, link] of Object.entries(links)) {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentSection = key;
                loadContent(key);
            });
        }
    }

    // Load initial section
    loadContent(currentSection);
});
