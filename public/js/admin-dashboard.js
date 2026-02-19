import { getAllData, postData, patchData, deleteData } from "../crud.js";

document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.querySelector('.content');
    const links = {
        'gestion-reportes': document.getElementById('gestion-reportes'),
        'gestion-proyectos': document.getElementById('gestion-proyectos'),
        'gestion-servicios': document.getElementById('gestion-servicios'),
        'gestion-usuarios': document.getElementById('gestion-usuarios'),
        'gestion-salarios': document.getElementById('gestion-salarios'),
        'gestion-financiamiento': document.getElementById('gestion-financiamiento')
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
                        reportList.innerHTML = '';
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

                        const deleteButtons = reportList.querySelectorAll('.delete-report-btn');
                        deleteButtons.forEach(button => {
                            button.addEventListener('click', async (e) => {
                                const id = e.target.getAttribute('data-id');
                                if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
                                    try {
                                        await deleteData('servicios', id);
                                        Swal.fire('Eliminado', 'Reporte eliminado correctamente', 'success');
                                        loadContent('gestion-reportes');
                                    } catch (error) {
                                        console.error('Error deleting report:', error);
                                        Swal.fire('Error', 'No se pudo eliminar el reporte', 'error');
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
                    <div id="lista-proyectos"></div>
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
                        await postData('proyectos', proyecto);
                        Swal.fire('Guardado', 'Proyecto guardado correctamente', 'success');
                        e.target.reset();
                        loadProjects();
                    } catch (error) {
                        console.error('Error saving project:', error);
                        Swal.fire('Error', 'No se pudo guardar el proyecto', 'error');
                    }
                });

                const loadProjects = async () => {
                    const projectListContainer = document.getElementById('lista-proyectos');
                    projectListContainer.innerHTML = '<p>Cargando proyectos...</p>';
                    try {
                        const projects = await getAllData('proyectos');
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

                        projectListContainer.querySelectorAll('.delete-project-btn').forEach(button => {
                            button.addEventListener('click', async (e) => {
                                const id = e.target.getAttribute('data-id');
                                if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
                                    try {
                                        await deleteData('proyectos', id);
                                        Swal.fire('Eliminado', 'Proyecto eliminado correctamente', 'success');
                                        loadProjects();
                                    } catch (error) {
                                        console.error('Error deleting project:', error);
                                        Swal.fire('Error', 'No se pudo eliminar el proyecto', 'error');
                                    }
                                }
                            });
                        });
                    } catch (error) {
                        console.error('Error loading projects:', error);
                        projectListContainer.innerHTML = '<p>Error al cargar los proyectos.</p>';
                    }
                };
                loadProjects();
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
                        resultadoDiv.innerHTML = '';
                    });
                });
                break;

            case 'gestion-usuarios':
                contentContainer.innerHTML = `
                    <div class="main-content-header">
                        <h2>Usuarios Registrados</h2>
                        <p>Visualización y administración de los usuarios del sistema.</p>
                    </div>

                    <div class="card" style="margin-bottom: 25px;">
                        <h3>Registrar Nuevo Usuario</h3>
                        <form id="form-nuevo-usuario" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px;">Nombre Completo:</label>
                                <input type="text" id="user-nombre" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" required>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px;">Correo Electrónico:</label>
                                <input type="email" id="user-email" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" required>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px;">Rol Inicial:</label>
                                <select id="user-rol" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                                    <option value="Ciudadano">Ciudadano</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                            </div>
                            <div style="display: flex; align-items: flex-end;">
                                <button type="submit" style="background-color: #6366f1; width: 100%; margin-top: 0;">Guardar Usuario</button>
                            </div>
                        </form>
                    </div>

                    <div class="table-container">
                        <table class="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
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
                        const users = await getAllData('usuarios');
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
                            const rol = user.rol || 'Ciudadano';
                            const activo = user.activo !== false;

                            tr.innerHTML = `
                                <td>#${user.id}</td>
                                <td>
                                    <div class="user-cell">
                                        <div class="avatar">${initials}</div>
                                        <div class="user-info-text">
                                            <div style="font-weight: 600; color: #0f172a;">${name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>${user.email || user.correo}</td>
                                <td>
                                    <span class="status-badge ${rol === 'Administrador' ? 'status-admin' : 'status-user'}">
                                        ${rol}
                                    </span>
                                </td>
                                <td>
                                    <span class="status-badge" style="background-color: ${activo ? '#dcfce7' : '#fee2e2'}; color: ${activo ? '#166534' : '#991b1b'};">
                                        ${activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-actions-container">
                                        <button class="btn-icon btn-rol" title="Cambiar Rol">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                                        </button>
                                        <button class="btn-icon btn-estado" title="${activo ? 'Desactivar' : 'Activar'}">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                        </button>
                                        <button class="btn-icon delete" title="Eliminar">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            `;

                            // Event Listeners for row actions
                            tr.querySelector('.btn-rol').addEventListener('click', async () => {
                                const nuevoRol = rol === 'Administrador' ? 'Ciudadano' : 'Administrador';
                                await patchData('usuarios', user.id, { rol: nuevoRol });
                                fetchUsers();
                                Swal.fire('Actualizado', `Rol cambiado a ${nuevoRol}`, 'success');
                            });

                            tr.querySelector('.btn-estado').addEventListener('click', async () => {
                                await patchData('usuarios', user.id, { activo: !activo });
                                fetchUsers();
                                Swal.fire('Actualizado', `Usuario ${activo ? 'desactivado' : 'activado'}`, 'success');
                            });

                            tr.querySelector('.btn-icon.delete').addEventListener('click', async () => {
                                const result = await Swal.fire({
                                    title: '¿Eliminar usuario?',
                                    text: "Esta acción no se puede deshacer.",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#e74c3c'
                                });
                                if (result.isConfirmed) {
                                    await deleteData('usuarios', user.id);
                                    fetchUsers();
                                    Swal.fire('Eliminado', 'Usuario removido correctamente', 'success');
                                }
                            });

                            tableBody.appendChild(tr);
                        });
                    } catch (error) {
                        console.error('Error fetching users:', error);
                        document.getElementById('users-table-body').innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar usuarios</td></tr>';
                    }
                };

                // Form submission for new user
                document.getElementById('form-nuevo-usuario').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const newUser = {
                        nombre: document.getElementById('user-nombre').value,
                        email: document.getElementById('user-email').value,
                        rol: document.getElementById('user-rol').value,
                        activo: true,
                        id: Date.now().toString()
                    };
                    try {
                        await postData('usuarios', newUser);
                        Swal.fire('Registrado', 'Usuario creado correctamente', 'success');
                        e.target.reset();
                        fetchUsers();
                    } catch (error) {
                        console.error('Error creating user:', error);
                        Swal.fire('Error', 'No se pudo crear el usuario', 'error');
                    }
                });

                fetchUsers();
                break;

            case 'gestion-salarios':
                contentContainer.innerHTML = `
                <div class="main-content-header">
                    <h2>Gestión de Salarios Municipales</h2>
                    <p>Administración detallada y registro de salarios de empleados.</p>
                </div>

                <div class="card" style="margin-bottom: 25px;">
                    <h3>Registrar Nuevo Salario</h3>
                    <form id="form-nuevo-salario" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Nombre Completo:</label>
                            <input type="text" id="salario-nombre" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" placeholder="Nombre del empleado" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Correo Electrónico:</label>
                            <input type="email" id="salario-correo" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" placeholder="correo@ejemplo.com" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Puesto:</label>
                            <input type="text" id="salario-puesto" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" placeholder="Ej: Analista" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Departamento:</label>
                            <select id="salario-depto" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                                <option value="Recursos Humanos">Recursos Humanos</option>
                                <option value="Tecnología e Información">Tecnología e Información</option>     
                                <option value="Finanzas">Finanzas</option>
                                <option value="Operaciones">Operaciones</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Salario Base:</label>
                            <input type="number" id="salario-base" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" placeholder="0.00" step="0.01" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Horas Extra:</label>
                            <input type="number" id="salario-extra" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" placeholder="0" step="1" value="0">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Rebajos/Deducciones:</label>
                            <input type="number" id="salario-rebajos" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" placeholder="0.00" step="0.01" value="0">
                        </div>
                        <div style="display: flex; align-items: flex-end; grid-column: span 2;">
                            <button type="submit" style="background-color: #2ecc71; width: 100%; margin-top: 0; padding: 10px; font-weight: bold;">Guardar y Calcular Salario Neto</button>
                        </div>
                    </form>
                </div>

                <div class="table-container" style="overflow-x: auto;">
                    <table class="users-table" style="min-width: 900px;">
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Puesto/Depto</th>
                                <th>Base</th>
                                <th>Extras</th>
                                <th>Rebajos</th>
                                <th>Neto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-salarios-body">
                            <tr>
                                <td colspan="7" style="text-align: center;">Cargando registros de salarios...</td>
                            </tr>
                        </tbody>
                    </table>
                </div> 
                `;

                const loadSalarios = async () => {
                    try {
                        const salarios = await getAllData('salarios');
                        const tableBody = document.getElementById('tabla-salarios-body');
                        tableBody.innerHTML = '';

                        if (salarios.length === 0) {
                            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay registros de salarios.</td></tr>';
                            return;
                        }

                        salarios.forEach(item => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>
                                    <div style="font-weight: 600;">${item.nombre}</div>
                                    <div style="font-size: 0.8rem; color: #64748b;">${item.correo}</div>
                                </td>
                                <td>
                                    <div>${item.puesto}</div>
                                    <div style="font-size: 0.8rem; color: #64748b;">${item.depto}</div>
                                </td>
                                <td>$${Number(item.base).toFixed(2)}</td>
                                <td style="color: #166534;">+$${Number(item.pagoExtra || 0).toFixed(2)}<br><small>(${item.horasExtra}h)</small></td>
                                <td style="color: #991b1b;">-$${Number(item.rebajos).toFixed(2)}</td>
                                <td style="font-size: 1.1rem; color: #0f172a;"><strong>$${Number(item.salarioNeto).toFixed(2)}</strong></td>
                                <td>
                                    <button class="btn-icon delete delete-salary-btn" data-id="${item.id}" title="Eliminar">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </td>
                            `;

                            tr.querySelector('.delete-salary-btn').addEventListener('click', async (e) => {
                                const id = item.id;
                                const result = await Swal.fire({
                                    title: '¿Eliminar registro?',
                                    text: "Se borrará la información salarial del empleado.",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#e74c3c'
                                });
                                if (result.isConfirmed) {
                                    await deleteData('salarios', id);
                                    Swal.fire('Eliminado', 'Registro eliminado correctamente', 'success');
                                    loadSalarios();
                                }
                            });

                            tableBody.appendChild(tr);
                        });
                    } catch (error) {
                        console.error('Error loading salaries:', error);
                        document.getElementById('tabla-salarios-body').innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">Error al cargar salarios</td></tr>';
                    }
                };

                document.getElementById('form-nuevo-salario').addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const base = parseFloat(document.getElementById('salario-base').value);
                    const horasExtra = parseFloat(document.getElementById('salario-extra').value || 0);
                    const rebajos = parseFloat(document.getElementById('salario-rebajos').value || 0);

                    // Cálculo automático
                    // Tarifa por hora (asumiendo 160h mensuales)
                    const tarifaHora = base / 160;
                    // Horas extra se pagan al 1.5x
                    const pagoExtra = horasExtra * tarifaHora * 1.5;
                    const salarioNeto = base + pagoExtra - rebajos;

                    const nuevoSalario = {
                        nombre: document.getElementById('salario-nombre').value,
                        correo: document.getElementById('salario-correo').value,
                        puesto: document.getElementById('salario-puesto').value,
                        depto: document.getElementById('salario-depto').value,
                        base: base,
                        horasExtra: horasExtra,
                        pagoExtra: pagoExtra,
                        rebajos: rebajos,
                        salarioNeto: salarioNeto,
                        id: Date.now().toString()
                    };

                    try {
                        await postData('salarios', nuevoSalario);
                        Swal.fire('Guardado', 'Cálculo de salario neto realizado correctamente', 'success');
                        e.target.reset();
                        loadSalarios();
                    } catch (error) {
                        console.error('Error saving salary:', error);
                        Swal.fire('Error', 'No se pudo guardar el registro', 'error');
                    }
                });

                loadSalarios();
                break;
            case 'gestion-financiamiento':
                contentContainer.innerHTML = `
                <div class="main-content-header">
                    <h2>Gestión de Solicitudes de Financiamiento</h2>
                    <p>Cree solicitudes, monitoree estados y gestione fondos para proyectos municipales.</p>
                </div>

                <div class="card" style="margin-bottom: 25px;">
                    <h3>Nueva Solicitud de Financiamiento</h3>
                    <form id="form-nuevo-financiamiento" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 5px;">Nombre del Proyecto:</label>
                            <input type="text" id="fin-nombre" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" placeholder="Ej: Modernización Parque Escazú" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Entidad Financiera:</label>
                            <input type="text" id="fin-entidad" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" placeholder="Ej: Banco Nacional" required>
                        </div>
                        <div style="grid-column: span 3;">
                            <label style="display: block; margin-bottom: 5px;">Descripción del Proyecto:</label>
                            <textarea id="fin-descripcion" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd; min-height: 80px;" placeholder="Detalles de la necesidad de financiamiento..." required></textarea>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Monto Solicitado ($):</label>
                            <input type="number" id="fin-monto-solicitado" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" placeholder="0.00" step="0.01" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Fecha de Solicitud:</label>
                            <input type="date" id="fin-fecha" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" required>
                        </div>
                        <div style="display: flex; align-items: flex-end;">
                            <button type="submit" style="background-color: #3498db; color: white; width: 100%; margin-top: 0; padding: 10px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer;">Crear Solicitud</button>
                        </div>
                    </form>
                </div>

                <div class="table-container" style="overflow-x: auto;">
                    <table class="users-table" style="min-width: 1000px;">
                        <thead>
                            <tr>
                                <th>Proyecto / Descripción</th>
                                <th>Entidad</th>
                                <th>Monto Solicitado</th>
                                <th>Monto Aprobado</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-financiamiento-body">
                            <tr>
                                <td colspan="7" style="text-align: center;">Cargando solicitudes...</td>
                            </tr>
                        </tbody>
                    </table>
                </div> 
                `;

                const loadFinanciamiento = async () => {
                    try {
                        const solicitudes = await getAllData('financiamiento');
                        const tableBody = document.getElementById('tabla-financiamiento-body');
                        tableBody.innerHTML = '';

                        if (solicitudes.length === 0) {
                            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay solicitudes de financiamiento registradas.</td></tr>';
                            return;
                        }

                        solicitudes.forEach(item => {
                            const tr = document.createElement('tr');

                            let statusColor = '#64748b'; // Pendiente
                            if (item.estado === 'Aprobado') statusColor = '#166534';
                            if (item.estado === 'Rechazado') statusColor = '#991b1b';

                            const statusBadgeStyle = `
                                padding: 4px 8px; 
                                border-radius: 12px; 
                                font-size: 0.75rem; 
                                font-weight: 600;
                                background-color: ${statusColor}15;
                                color: ${statusColor};
                                border: 1px solid ${statusColor}30;
                            `;

                            tr.innerHTML = `
                                <td>
                                    <div style="font-weight: 600;">${item.nombre}</div>
                                    <div style="font-size: 0.8rem; color: #64748b; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.descripcion}">${item.descripcion}</div>
                                </td>
                                <td>${item.entidad}</td>
                                <td>$${Number(item.montoSolicitado).toLocaleString()}</td>
                                <td style="font-weight: bold; color: ${item.montoAprobado > 0 ? '#166534' : '#64748b'}">
                                    $${Number(item.montoAprobado || 0).toLocaleString()}
                                </td>
                                <td>${item.fecha}</td>
                                <td>
                                    <span style="${statusBadgeStyle}">${item.estado || 'Pendiente'}</span>
                                </td>
                                <td>
                                    <div style="display: flex; gap: 5px;">
                                        <button class="btn-icon status-approve-btn" data-id="${item.id}" title="Aprobar" style="color: #166534;">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </button>
                                        <button class="btn-icon status-reject-btn" data-id="${item.id}" title="Rechazar" style="color: #991b1b;">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                        <button class="btn-icon delete delete-fin-btn" data-id="${item.id}" title="Eliminar">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            `;

                            // Event Listeners for actions
                            tr.querySelector('.status-approve-btn').addEventListener('click', async () => {
                                const { value: monto } = await Swal.fire({
                                    title: 'Aprobar Financiamiento',
                                    input: 'number',
                                    inputLabel: 'Monto a aprobar ($)',
                                    inputValue: item.montoSolicitado,
                                    showCancelButton: true,
                                    confirmButtonColor: '#28a745'
                                });

                                if (monto) {
                                    await patchData('financiamiento', item.id, {
                                        estado: 'Aprobado',
                                        montoAprobado: parseFloat(monto)
                                    });
                                    Swal.fire('¡Aprobado!', 'La solicitud ha sido aprobada.', 'success');
                                    loadFinanciamiento();
                                }
                            });

                            tr.querySelector('.status-reject-btn').addEventListener('click', async () => {
                                const result = await Swal.fire({
                                    title: '¿Rechazar solicitud?',
                                    text: "El estado cambiará a Rechazado.",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#e74c3c'
                                });
                                if (result.isConfirmed) {
                                    await patchData('financiamiento', item.id, { estado: 'Rechazado', montoAprobado: 0 });
                                    Swal.fire('Rechazado', 'La solicitud ha sido rechazada.', 'success');
                                    loadFinanciamiento();
                                }
                            });

                            tr.querySelector('.delete-fin-btn').addEventListener('click', async () => {
                                const result = await Swal.fire({
                                    title: '¿Eliminar registro?',
                                    text: "Esta acción no se puede deshacer.",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#e74c3c'
                                });
                                if (result.isConfirmed) {
                                    await deleteData('financiamiento', item.id);
                                    Swal.fire('Eliminado', 'Registro eliminado correctamente', 'success');
                                    loadFinanciamiento();
                                }
                            });

                            tableBody.appendChild(tr);
                        });
                    } catch (error) {
                        console.error('Error loading financing:', error);
                        document.getElementById('tabla-financiamiento-body').innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">Error al cargar datos</td></tr>';
                    }
                };

                document.getElementById('form-nuevo-financiamiento').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const nuevo = {
                        nombre: document.getElementById('fin-nombre').value,
                        descripcion: document.getElementById('fin-descripcion').value,
                        entidad: document.getElementById('fin-entidad').value,
                        montoSolicitado: parseFloat(document.getElementById('fin-monto-solicitado').value),
                        montoAprobado: 0,
                        fecha: document.getElementById('fin-fecha').value,
                        estado: 'Pendiente',
                        id: Date.now().toString()
                    };

                    try {
                        await postData('financiamiento', nuevo);
                        Swal.fire('Solicitud Creada', 'La solicitud se ha registrado con estado Pendiente.', 'success');
                        e.target.reset();
                        loadFinanciamiento();
                    } catch (error) {
                        console.error('Error saving financing:', error);
                        Swal.fire('Error', 'No se pudo crear la solicitud.', 'error');
                    }
                });

                loadFinanciamiento();
                break;

            default:
                contentContainer.innerHTML = '<p>Seleccione una opción del menú.</p>';
        }
    };

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

    for (const [key, link] of Object.entries(links)) {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadContent(key);
            });
        }
    }
});
