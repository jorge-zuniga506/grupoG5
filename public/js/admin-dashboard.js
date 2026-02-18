import { getUsuarios, postUsuarios, deleteUsuarios } from "../services/serviciosUsuario.js";
document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.querySelector('.content');
    const links = {
        'gestion-reportes': document.getElementById('gestion-reportes'),
        'gestion-proyectos': document.getElementById('gestion-proyectos'),
        'gestion-servicios': document.getElementById('gestion-servicios')
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
            default:
                contentContainer.innerHTML = '<p>Seleccione una opción del menú.</p>';
        }
    };
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