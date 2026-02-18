import { getUsuarios, postUsuarios, deleteUsuarios } from "../services/serviciosUsuario.js";
document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.querySelector('.content');
    const links = {
        'gestion-reportes': document.getElementById('gestion-reportes'),
        'gestion-proyectos': document.getElementById('gestion-proyectos'),
        'gestion-servicios': document.getElementById('gestion-servicios'),
        'gestion-usuarios': document.getElementById('gestion-usuarios')
    };
    // Función para actualizar el contenido
    const loadContent = (section) => {
        contentContainer.innerHTML = ''; // Limpiar contenido actual
        switch (section) {
            case 'gestion-reportes':
                contentContainer.innerHTML = `
                    <h2>Gestión de Reportes</h2>
                    <p>Aquí puedes ver y administrar los reportes de los ciudadanos.</p>
                    <div class="report-list">
                        <p>Cargando reportes...</p>
                    </div>
                    
                `;
                fetch('http://localhost:3001/servicios')
                    .then(response => response.json())
                    .then(data => {
                        const reportList = contentContainer.querySelector('.report-list');
                        reportList.innerHTML = ''; // Clear loading message
                        if (data.length === 0) {
                            reportList.innerHTML = '<p>No hay reportes registrados.</p>';
                            return;
                        }
                        data.forEach(report => {
                            const card = document.createElement('div');
                            card.className = 'card';
                            card.innerHTML = `
                                <h3>${report.title}</h3>
                                <p><strong>Categoría:</strong> ${report.category}</p>
                                <p><strong>Descripción:</strong> ${report.description}</p>
                                <p><strong>Ubicación:</strong> ${report.location}</p>
                                <p><strong>Fecha:</strong> ${report.date}</p>
                                <p><strong>Estado:</strong> ${report.status}</p>
                                <button>Ver Detalles</button>
                                <button class="delete-report-btn" data-id="${report.id}" style="background-color: #e74c3c; color: white; margin-left: 10px;">Eliminar</button>
                            `;
                            reportList.appendChild(card);
                        });
                        // Add event listeners for delete buttons
                        const deleteButtons = reportList.querySelectorAll('.delete-report-btn');
                        deleteButtons.forEach(button => {
                            button.addEventListener('click', async (e) => {
                                const id = e.target.getAttribute('data-id');
                                if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
                                    try {
                                        await deleteUsuarios(id, 'servicios');
                                        alert('Reporte eliminado correctamente');
                                        loadContent('gestion-reportes'); // Reload the list
                                    } catch (error) {
                                        console.error('Error deleting report:', error);
                                        alert('Error al eliminar el reporte');
                                    }
                                }
                            });
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching reports:', error);
                        contentContainer.querySelector('.report-list').innerHTML = '<p>Error al cargar los reportes.</p>';
                    });
                break;
            case 'gestion-proyectos':
                contentContainer.innerHTML = `
                    <h2>Gestión de Proyectos</h2>
                    <p>Administración de proyectos.</p>
                    <div class="card">
                        <h3>Registrar Nuevo Proyecto</h3>
                        <form id="form-proyecto">
                            <div style="margin-bottom: 15px;">
                                <label for="encargado" style="display: block; margin-bottom: 5px; font-weight: bold;">Encargado(a):</label>
                                <input type="text" id="encargado" name="encargado" placeholder="Nombre del encargado" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label for="lugar" style="display: block; margin-bottom: 5px; font-weight: bold;">Lugar:</label>
                                <input type="text" id="lugar" name="lugar" placeholder="Ubicación del proyecto" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label for="fecha" style="display: block; margin-bottom: 5px; font-weight: bold;">Fecha:</label>
                                <input type="date" id="fecha" name="fecha" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label for="plazo" style="display: block; margin-bottom: 5px; font-weight: bold;">Plazo:</label>
                                <input type="text" id="plazo" name="plazo" placeholder="Ej: 3 meses" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                            </div>
                            <button type="submit" style="background-color: #2ecc71;">Guardar Proyecto</button>
                        </form>
                    </div>
                    <div id="mensaje-proyecto" style="margin-top: 20px;"></div>
                    
                    <h3>Lista de Proyectos</h3>
                    <div id="lista-proyectos">
                        <!-- Projects will be loaded here -->
                    </div>
                `;
                document.getElementById('form-proyecto').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const proyecto = {
                        encargado: document.getElementById('encargado').value,
                        lugar: document.getElementById('lugar').value,
                        fecha: document.getElementById('fecha').value,
                        plazo: document.getElementById('plazo').value,
                        id: Date.now().toString()
                    };
                    try {
                        await postUsuarios(proyecto, 'proyectos');
                        const mensajeDiv = document.getElementById('mensaje-proyecto');
                        mensajeDiv.innerHTML = `
                            <div class="card" style="background-color: #e8f6f3; border-left: 4px solid #1abc9c;">
                                <h4>Proyecto Guardado Correctamente</h4>
                                <p><strong>Encargado:</strong> ${proyecto.encargado}</p>
                                <p><strong>Lugar:</strong> ${proyecto.lugar}</p>
                            </div>
                        `;
                        e.target.reset();
                        loadProjects(); // Reload list after save
                    } catch (error) {
                        console.error('Error saving project:', error);
                        alert('Error al guardar el proyecto');
                    }
                });
                // Function to load and display projects
                const loadProjects = async () => {
                    const projectListContainer = document.getElementById('lista-proyectos');
                    projectListContainer.innerHTML = '<p>Cargando proyectos...</p>';
                    try {
                        const response = await fetch('http://localhost:3001/proyectos');
                        const projects = await response.json();
                        projectListContainer.innerHTML = '';
                        if (projects.length === 0) {
                            projectListContainer.innerHTML = '<p>No hay proyectos registrados.</p>';
                            return;
                        }
                        projects.forEach(project => {
                            const card = document.createElement('div');
                            card.className = 'card';
                            card.innerHTML = `
                                <h3>${project.lugar}</h3>
                                <p><strong>Encargado:</strong> ${project.encargado}</p>
                                <p><strong>Fecha:</strong> ${project.fecha}</p>
                                <p><strong>Plazo:</strong> ${project.plazo}</p>
                                <button class="delete-project-btn" data-id="${project.id}" style="background-color: #e74c3c; color: white;">Eliminar</button>
                            `;
                            projectListContainer.appendChild(card);
                        });
                        // Add event listeners for delete buttons
                        const deleteButtons = projectListContainer.querySelectorAll('.delete-project-btn');
                        deleteButtons.forEach(button => {
                            button.addEventListener('click', async (e) => {
                                const id = e.target.getAttribute('data-id');
                                if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
                                    try {
                                        await deleteUsuarios(id, 'proyectos');
                                        alert('Proyecto eliminado correctamente');
                                        loadProjects(); // Reload the list
                                    } catch (error) {
                                        console.error('Error deleting project:', error);
                                        alert('Error al eliminar el proyecto');
                                    }
                                }
                            });
                        });
                    } catch (error) {
                        console.error('Error loading projects:', error);
                        projectListContainer.innerHTML = '<p>Error al cargar los proyectos.</p>';
                    }
                };
                loadProjects(); // Initial load
                break;
            case 'gestion-servicios':
                contentContainer.innerHTML = `
                    <h2>Gestión de Servicios Públicos</h2>
                    <p>Control y monitoreo de servicios públicos.</p>
                    <div class="service-list">
                        <div class="card" id="gestionServiciosControl">
                            <h3>Actualizar Estado de Servicio</h3>
                            <select id="tipoServicio">
                                <option value="Servicio de Mantenimiento">Servicio de Mantenimiento</option>
                                <option value="Servicio de Alumbrado Publico">Servicio de Alumbrado Publico</option>
                                <option value="Servicio Vial">Servicio Vial</option>
                                <option value="Servicio de Recoleccion de Basura">Servicio de Recoleccion de Basura</option>
                            </select>
                            <select id="estadoServicio">
                                <option value="Operativo">Operativo</option>
                                <option value="En Mantenimiento">En Mantenimiento</option>
                                <option value="Fuera de Servicio">Fuera de Servicio</option>
                            </select>
                            <button id="btnGestionarServicio">Gestionar</button>
                        </div>
                        <div id="resultadoGestion" style="margin-top: 20px;"></div>
                    </div>
                `;
                document.getElementById('btnGestionarServicio').addEventListener('click', () => {
                    const tipo = document.getElementById('tipoServicio').value;
                    const estado = document.getElementById('estadoServicio').value;
                    const resultadoDiv = document.getElementById('resultadoGestion');
                    resultadoDiv.innerHTML = `
                        <div class="card" style="background-color: #e8f6f3; border-left: 4px solid #1abc9c;">
                            <h3>Estado Actualizado</h3>
                            <p><strong>Servicio:</strong> ${tipo}</p>
                            <p><strong>Estado:</strong> ${estado}</p>
                            <p><em>Cambios registrados con éxito.</em></p>
                            <button id="btnEliminarServicio">Eliminar</button>
                        </div>
                    `;
                    document.getElementById('btnEliminarServicio').addEventListener('click', () => {
                        const resultadoDiv = document.getElementById('resultadoGestion');
                        resultadoDiv.innerHTML = '';
                    });
                });
                break;
            case 'gestion-usuarios':
                contentContainer.innerHTML = `
                    <div class="main-content-header">
                        <h2>Usuarios Registrados</h2>
                        <p>Visualización de todos los usuarios en el sistema.</p>
                    </div>
                    <div class="table-container">
                        <table class="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="users-table-body">
                                <tr>
                                    <td colspan="6" style="text-align: center;">Cargando usuarios...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;

                const fetchUsers = async () => {
                    try {
                        const response = await fetch('http://localhost:3001/usuarios');
                        const users = await response.json();
                        const tableBody = document.getElementById('users-table-body');
                        tableBody.innerHTML = '';

                        if (users.length === 0) {
                            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay usuarios registrados.</td></tr>';
                            return;
                        }

                        users.forEach(user => {
                            const name = user.nombre || 'Usuario';
                            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>#${user.id}</td>
                                <td>
                                    <div class="user-cell">
                                        <div class="avatar">${initials}</div>
                                        <div class="user-info-text">
                                            <div style="font-weight: 600; color: #0f172a;">${name}</div>
                                            <div style="font-size: 0.8rem; color: #64748b;">${user.rol || 'Miembro'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>${user.email}</td>
                                <td>${user.telefono || '---'}</td>
                                <td>
                                    <span class="status-badge ${user.rol === 'admin' ? 'status-admin' : 'status-user'}">
                                        ${user.rol === 'admin' ? 'Administrador' : 'Ciudadano'}
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-actions-container">
                                        <button class="btn-icon edit" title="Editar">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button class="btn-icon delete" data-id="${user.id}" title="Eliminar">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                </td>
                            `;
                            tableBody.appendChild(tr);
                        });

                        // Add delete listeners
                        tableBody.querySelectorAll('.btn-icon.delete').forEach(btn => {
                            btn.addEventListener('click', async () => {
                                const id = btn.getAttribute('data-id');
                                if (confirm('¿Seguro que deseas eliminar este usuario?')) {
                                    try {
                                        await deleteUsuarios(id, 'usuarios');
                                        fetchUsers(); // Refresh
                                        Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
                                    } catch (error) {
                                        console.error(error);
                                        Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
                                    }
                                }
                            });
                        });

                    } catch (error) {
                        console.error('Error fetching users:', error);
                        document.getElementById('users-table-body').innerHTML =
                            '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar usuarios</td></tr>';
                    }
                };

                fetchUsers();
                break;

            default:
                contentContainer.innerHTML = '<p>Seleccione una opción del menú.</p>';
        }
    };
    // Configuración del botón de Cerrar Sesión
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            const result = await Swal.fire({
                title: '¿Cerrar sesión?',
                text: "Tendrás que ingresar tus credenciales nuevamente.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#e74c3c',
                cancelButtonColor: '#2c3e50',
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                localStorage.removeItem('currentUser');
                Swal.fire({
                    icon: 'success',
                    title: '¡Hasta luego!',
                    text: 'Sesión cerrada correctamente.',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'login.html';
                });
            }
        });
    }

    // Agregar event listeners
    for (const [key, link] of Object.entries(links)) {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadContent(key);
            });
        }
    }
});