import { getDataUsers, sendDataUsers, deleteUser, editUser, updateUser } from './controllers/crudUsers.js';
import { getDataEvents, sendDataEvents, deleteEvent, editEvent, updateEvent } from './controllers/crudEvents.js';
import { sendDataAppointment, getDataAppointments, deleteAppointment } from './controllers/crudAppointments.js';

const routes = {
    "/": "/src/views/home.html",
    "/login": "/src/views/auth/login.html",
    "/register": "/src/views/auth/register.html",
    "/events": "/src/views/events/index.html",
    "/event-create": "/src/views/events/create.html",
    "/appointments": "/src/views/appointments/index.html",
    "/users": "/src/views/users/index.html",
}

const users = await getDataUsers();
const events = await getDataEvents();
const appointments = await getDataAppointments();


export async function renderRoute() {
    const path = location.pathname;
    const app = document.getElementById("app");
    let loggedInUser = localStorage.getItem("loggedInUser") ? true : false;
    const file = routes[path] || "/src/views/404.html";

        if (localStorage.getItem('loggedInUser')) {
      const header = document.querySelector('header');
      header.innerHTML = `
      <a class="nav-link" href="/">Inicio</a>
      <a class="nav-link" href="/users">Usuarios</a>
      <a class="nav-link" href="/events">Eventos</a>
      <a class="nav-link" href="/appointments">Reservas</a>
      <button class="btn btn-danger" onclick="logout()">Logout</button>
  `;
  document.querySelector('body').prepend(header)
    }

    try {
        const res = await fetch(file);
        const html = await res.text();
        app.innerHTML = html;

        if (loggedInUser) {
            if (path === "/login") {
                window.location.href = "/";
                return;
            }
            switch (file) {
                case "/src/views/users/index.html":
                    users.forEach(u => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${u.name}</td>
                            <td>${u.email}</td>
                            <td>${u.role}</td>
                            <td>${u.created}</td>
                            <td>
                                <button data-id="${u.id}" class="btn btn-warning edit-btn">Editar</button>
                                <button data-id="${u.id}" class="btn btn-danger delete-btn">Eliminar</button>
                            </td>
                        `;

                        const deleteButton = row.querySelector('.delete-btn');
                        if (deleteButton) {
                            deleteButton.addEventListener('click', () => {
                                deleteUser(u.id);
                            });
                        }

                        const editButton = row.querySelector('.edit-btn');
                        if (editButton) {
                            editButton.addEventListener('click', () => {
                                editUser(u.id);
                                console.log(`Editar usuario con ID: ${u.id}`);
                            });
                        }
                        const btnSendEdit = document.getElementById('btnSendEdit');
                        btnSendEdit.addEventListener('click', () => {
                            updateUser()
                        })

                        document.querySelector("#users-table tbody").appendChild(row);
                    });
                    break;

                case "/src/views/events/index.html":
                    const eventsTableBody = document.querySelector('#events-table tbody');
                    const appointmentModal = document.getElementById('appointment-modal');
                    const appointmentEventTitle = document.getElementById('appointment-event-title');
                    const numTicketsInput = document.getElementById('numTickets');
                    const confirmAppointmentBtn = document.getElementById('confirAppointmentBtn');
                    const cancelAppointmentBtn = document.getElementById('cancelAppointmentBtn');

                    let selectedEventId = null;

                    const renderEventsTable = async () => {
                        eventsTableBody.innerHTML = '';
                        events.forEach(e => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${e.title}</td>
                                <td>${e.description}</td>
                                <td>${e.location}</td>
                                <td>${e.date}</td>
                                <td><span id="available-seats-${e.id}">${e.availableSeats}</span></td>
                                <td>${e.capacity}</td>
                                <td>
                                    <button data-id="${e.id}" class="btn btn-info appointment-btn" ${e.availableSeats === 0 ? 'disabled' : ''}>
                                        ${e.availableSeats === 0 ? 'Agotado' : 'Reservar'}
                                    </button>
                                    <button data-id="${e.id}" class="btn btn-warning edit-btn">Editar</button>
                                    <button data-id="${e.id}" class="btn btn-danger delete-btn">Eliminar</button>
                                </td>
                            `;
                            eventsTableBody.appendChild(row);

                            const deleteButton = row.querySelector('.delete-btn');
                            if (deleteButton) {
                                deleteButton.addEventListener('click', () => {
                                    deleteEvent(e.id);
                                });
                            }

                            const editButton = row.querySelector('.edit-btn');
                            if (editButton) {
                                editButton.addEventListener('click', () => {
                                    editEvent(e.id);
                                });
                            }
                            const btnSendEdit = document.getElementById('btnSendEdit');
                            if (btnSendEdit) {
                                btnSendEdit.addEventListener('click', () => {
                                    updateEvent();
                                });
                            }
                        });

                        document.querySelectorAll('.appointment-btn').forEach(button => {
                            button.addEventListener('click', (e) => {
                                selectedEventId = e.target.dataset.id;
                                const eventTitle = e.target.closest('tr').children[0].textContent;
                                appointmentEventTitle.textContent = eventTitle;
                                numTicketsInput.value = 1;
                                appointmentModal.style.display = 'block';
                            });
                        });
                    };

                    renderEventsTable();

                    if (confirmAppointmentBtn) {
                        confirmAppointmentBtn.addEventListener('click', async () => {
                            const numberOfTickets = parseInt(numTicketsInput.value);

                            if (isNaN(numberOfTickets) || numberOfTickets <= 0) {
                                alert("Por favor, ingresa un número válido de asientos.");
                                return;
                            }

                            if (selectedEventId) {
                                const success = await sendDataAppointment(selectedEventId, numberOfTickets);
                                if (success) {
                                    appointmentModal.style.display = 'none';
                                    selectedEventId = null;
                                    renderEventsTable();
                                }
                            }
                        });
                    }


                    if (cancelAppointmentBtn) {
                        cancelAppointmentBtn.addEventListener('click', () => {
                            appointmentModal.style.display = 'none';
                            selectedEventId = null;
                        });
                    }
                    break;

                case "/src/views/events/create.html":
                    document.getElementById("btnEvents").addEventListener("click", () => {

                        const title = document.getElementById("title").value;
                        const description = document.getElementById("description").value;
                        const location = document.getElementById("location").value;
                        const date = document.getElementById("date").value;
                        const capacity = document.getElementById("capacity").value;

                        if (!title || !description || !location || !date || !capacity) {
                            alert("Todos los campos son requeridos");
                            return;
                        }

                        const form = {
                            title: title,
                            description: description,
                            date: date,
                            location: location,
                            availableSeats: capacity,
                            capacity: capacity,
                            created: new Date().toISOString()
                        };

                        sendDataEvents(form);
                    });
                    break;

                case "/src/views/appointments/index.html":
                    appointments.forEach(a => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                        <td>${users.find(u => u.id == a.user_id).name}</td>
                        <td>${a.numberOfTickets}</td>
                        <td>${events.find(e => e.id == a.event_id).title}</td>
                        <td>${events.find(e => e.id == a.event_id).location}</td>
                        <td>${events.find(e => e.id == a.event_id).date}</td>
                        <td>
                            <button data-id="${a.id}" class="btn btn-danger delete-btn">Eliminar</button>
                        </td>
                        `;

                        const deleteButton = row.querySelector('.delete-btn');
                        if (deleteButton) {
                            deleteButton.addEventListener('click', () => {
                                deleteAppointment(a.id);
                            });
                        }

                        document.querySelector('#appointments-table tbody').appendChild(row);
                    })

                    break;
            }
        } else {
            if (path !== "/login" && path !== "/register") {
                window.location.href = "/login";
                return;
            }

            if (path === "/login") {
                const btnLogin = document.getElementById('btn-login');
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');

                btnLogin.addEventListener('click', (e) => {
                    e.preventDefault()
                    const email = emailInput.value;
                    const password = passwordInput.value;
                    const user = users.find(u => u.email === email && u.password === password);

                    if (user) {
                        localStorage.setItem('loggedInUser', email);
                        window.location.href = '/'
                    } else {
                        console.warn('usuario no existe')
                    }
                })
            } else if (path === "/register") {
                document.getElementById("btnRegister").addEventListener("click", () => {

                    const name = document.getElementById("name").value;
                    const email = document.getElementById("email").value;
                    const password = document.getElementById("password").value;
                    const repeatPassword = document.getElementById("repeatPassword").value;

                    if (!name || !email || !password || !repeatPassword) {
                        alert("Todos los campos son requeridos");
                        return;
                    }

                    if (password !== repeatPassword) {
                        alert('Contraseñas no coinciden')
                        return;
                    }

                    const form = {
                        name: name,
                        email: email,
                        password: password,
                        rol: 'visitor',
                        created: new Date().toISOString(),
                    };

                    sendDataUsers(form);
                });
            } else {
                window.location.href = '/';
            }
        }
    } catch (error) {
        console.error("Error al cargar la ruta:", error);
        app.innerHTML = "<h1>Error al cargar la página</h1>";
    }
}
