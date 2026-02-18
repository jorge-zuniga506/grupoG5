// Session Security: Logout on refresh
if (performance.getEntriesByType("navigation")[0].type === "reload") {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Session Validation
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const userNameSpan = document.getElementById('userName');
    const btnLogout = document.getElementById('btnLogout');

    if (userNameSpan) userNameSpan.textContent = `Hola, ${currentUser.nombre}`;

    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'home.html';
        });
    }

    const complaintForm = document.getElementById('complaintForm');
    const complaintsList = document.getElementById('complaintsList');

    // Load all reports from backend
    loadAllReports();

    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const location = document.getElementById('location').value;

        const newComplaint = {
            title,
            category,
            description,
            location,
            date: new Date().toLocaleDateString(),
            status: 'recibido',
            userEmail: currentUser.email,
            userName: currentUser.nombre
        };

        // Try to send to backend (POST)
        try {
            const response = await fetch('http://localhost:3001/servicios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newComplaint)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Reporte Enviado',
                    text: 'Tu reporte ha sido registrado con éxito.',
                    confirmButtonColor: '#1A1A54'
                });
                complaintForm.reset();
                loadAllReports();
            }
        } catch (error) {
            console.error('Error enviando reporte:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo conectar con el servidor.'
            });
        }
    });

    async function loadAllReports() {
        try {
            const response = await fetch('http://localhost:3001/servicios');
            const allReports = await response.json();

            // Sort by newest first (assuming ID or date)
            allReports.reverse();

            renderMyReports(allReports.filter(r => r.userEmail === currentUser.email));
            renderCommunityFeed(allReports);
        } catch (error) {
            console.error('Error cargando reportes:', error);
        }
    }

    function renderMyReports(myReports) {
        const complaintsList = document.getElementById('complaintsList');
        complaintsList.innerHTML = '';

        if (myReports.length === 0) {
            complaintsList.innerHTML = '<p style="text-align:center; color: #7f8c8d; grid-column: 1/-1;">No has realizado ningún reporte aún.</p>';
            return;
        }

        myReports.forEach(report => {
            const card = createReportCard(report, true);
            complaintsList.appendChild(card);
        });
    }

    function renderCommunityFeed(allReports) {
        const communityFeed = document.getElementById('communityFeed');
        communityFeed.innerHTML = '';

        if (allReports.length === 0) {
            communityFeed.innerHTML = '<p style="text-align:center; color: #7f8c8d; grid-column: 1/-1;">Aún no hay reportes de la comunidad.</p>';
            return;
        }

        allReports.forEach(report => {
            const card = createReportCard(report, false);
            communityFeed.appendChild(card);
        });
    }

    function createReportCard(report, isOwner) {
        const card = document.createElement('div');
        card.className = `complaint-card status-${report.status}`;

        let statusColor = 'red';
        if (report.status === 'en-proceso') statusColor = 'yellow';
        if (report.status === 'resuelto') statusColor = 'green';

        const actionButtons = isOwner ? `
            <div class="card-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                <button class="btn-edit" data-id="${report.id}" style="background: #3498db; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" data-id="${report.id}" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash"></i></button>
            </div>
        ` : '';

        // Comments logic
        const commentsHtml = (report.comments || []).map(comment => `
            <div class="comment-item">
                <span class="comment-author">${comment.userName}:</span>
                <span class="comment-text">${comment.text}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">${report.title}</span>
                <span class="card-status-indicator ${statusColor}"></span>
            </div>
            <span class="card-category">${report.category}</span>
            <p class="card-location"><small>📍 ${report.location}</small></p>
            <p class="card-description">${report.description}</p>
            <div class="card-footer-info" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 0.8em; color: #7f8c8d;">
                <span>👤 ${report.userName || 'Anónimo'}</span>
                <span>${report.date}</span>
            </div>
            ${actionButtons}
            
            <div class="comments-section">
                <div class="comments-title"><i class="fas fa-comment"></i> Comentarios</div>
                <div class="comments-list">
                    ${commentsHtml || '<p style="font-size: 0.8em; color: #95a5a6;">Sin comentarios aún.</p>'}
                </div>
                <div class="comment-input-group" style="display: flex; flex-direction: column; gap: 8px;">
                    <input type="text" class="comment-input" placeholder="Escribe un comentario..." style="width: 100%; border: 1px solid #ccc; padding: 8px;">
                    <button class="btn-comment" style="align-self: flex-start; border: 1px solid #ccc; background: white; padding: 2px 10px; cursor: pointer;">Enviar</button>
                </div>
            </div>
        `;

        if (isOwner) {
            card.querySelector('.btn-delete').addEventListener('click', () => deleteReport(report.id));
            card.querySelector('.btn-edit').addEventListener('click', () => editReport(report));
        }

        // Comment event listener
        const btnComment = card.querySelector('.btn-comment');
        const inputComment = card.querySelector('.comment-input');

        btnComment.addEventListener('click', async () => {
            const text = inputComment.value.trim();
            if (text) {
                await addComment(report, text);
            }
        });

        return card;
    }

    async function addComment(report, text) {
        const newComment = {
            userName: currentUser.nombre,
            text: text,
            date: new Date().toLocaleString(),
            prueba: "hollaaa"
        };

        const updatedComments = report.comments || [];
        updatedComments.push(newComment);

        try {
            const response = await fetch(`http://localhost:3001/servicios/${report.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comments: updatedComments })
            });

            if (response.ok) {
                loadAllReports(); // Refresh cards to show new comment
            }
        } catch (error) {
            console.error('Error enviando comentario:', error);
        }
    }

    async function deleteReport(id) {
        const result = await Swal.fire({
            title: '¿Eliminar reporte?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#7f8c8d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await fetch(`http://localhost:3001/servicios/${id}`, { method: 'DELETE' });
                Swal.fire('Eliminado', 'Tu reporte ha sido eliminado.', 'success');
                loadAllReports();
            } catch (error) {
                console.error('Error eliminando:', error);
            }
        }
    }

    async function editReport(report) {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Reporte',
            html:
                `<input id="swal-title" class="swal2-input" placeholder="Título" value="${report.title}">` +
                `<input id="swal-location" class="swal2-input" placeholder="Ubicación" value="${report.location}">` +
                `<textarea id="swal-description" class="swal2-textarea" placeholder="Descripción">${report.description}</textarea>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#1A1A54',
            preConfirm: () => {
                return {
                    title: document.getElementById('swal-title').value,
                    location: document.getElementById('swal-location').value,
                    description: document.getElementById('swal-description').value
                }
            }
        });

        if (formValues) {
            const updatedReport = { ...report, ...formValues };
            try {
                await fetch(`http://localhost:3001/servicios/${report.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedReport)
                });
                Swal.fire('Actualizado', 'Tu reporte ha sido modificado.', 'success');
                loadAllReports();
            } catch (error) {
                console.error('Error actualizando:', error);
            }
        }
    }
})