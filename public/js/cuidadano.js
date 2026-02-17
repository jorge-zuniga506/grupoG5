
document.addEventListener('DOMContentLoaded', () => {
    const complaintForm = document.getElementById('complaintForm');
    const complaintsList = document.getElementById('complaintsList');

    // Load complaints from localStorage
    loadComplaints();

    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const location = document.getElementById('location').value;

        const newComplaint = {
            id: Date.now(),
            title,
            category,
            description,
            location,
            date: new Date().toLocaleDateString(),
            status: 'recibido' // Default status: recibido (red)
        };

        // Try to send to backend (POST)
        try {
            const response = await fetch('http://localhost:3001/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newComplaint)
            });

            if (response.ok) {
                console.log('Reporte enviado al servidor exitosamente.');
                // In a real app, we might get the ID from the server
            } else {
                console.warn('El servidor no respondió correctamente (esperado si no hay endpoint). Guardando localmente.');
            }
        } catch (error) {
            console.warn('Error de conexión con el servidor (esperado si no hay backend). Guardando localmente.', error);
        }

        // Always save locally for demonstration purposes (Mock/Fallback)
        saveComplaint(newComplaint);

        complaintForm.reset();
        loadComplaints();
        alert(' Reporte enviado con éxito! (Guardado localmente)');
    });

    function saveComplaint(complaint) {
        let complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        complaints.push(complaint);
        localStorage.setItem('complaints', JSON.stringify(complaints));
    }

    function loadComplaints() {
        complaintsList.innerHTML = '';
        let complaints = JSON.parse(localStorage.getItem('complaints')) || [];

        if (complaints.length === 0) {
            complaintsList.innerHTML = '<p style="text-align:center; color: #7f8c8d; grid-column: 1/-1;">No hay reportes registrados aún.</p>';
            return;
        }

        // Sort by newest first
        complaints.sort((a, b) => b.id - a.id);

        complaints.forEach(complaint => {
            const card = document.createElement('div');
            card.className = `complaint-card status-${complaint.status}`;

            // Map status to color class for the dot
            let statusColor = 'red';
            if (complaint.status === 'en-proceso') statusColor = 'yellow';
            if (complaint.status === 'resuelto') statusColor = 'green';

            card.innerHTML = `
                <div class="card-header">
                    <span class="card-title">${complaint.title}</span>
                    <span class="card-status-indicator ${statusColor}" title="Cambiar Estado (Click para Demo)"></span>
                </div>
                <span class="card-category">${complaint.category}</span>
                <p class="card-location"><small>📍 ${complaint.location || 'Sin ubicación'}</small></p>
                <p class="card-description">${complaint.description}</p>
                <div class="card-date">${complaint.date}</div>
            `;

            // Add click event to cycle status (Demonstration purpose)
            card.querySelector('.card-status-indicator').addEventListener('click', () => {
                cycleStatus(complaint.id);
            });

            complaintsList.appendChild(card);
        });
    }

    function cycleStatus(id) {
        let complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const index = complaints.findIndex(c => c.id === id);

        if (index !== -1) {
            const currentStatus = complaints[index].status;
            let nextStatus = 'recibido';

            if (currentStatus === 'recibido') nextStatus = 'en-proceso';
            else if (currentStatus === 'en-proceso') nextStatus = 'resuelto';
            else if (currentStatus === 'resuelto') nextStatus = 'recibido';

            complaints[index].status = nextStatus;
            localStorage.setItem('complaints', JSON.stringify(complaints));
            loadComplaints();
        }
    }
})