import { getData, sendData, deleteUser, editUser, updateUser } from "./controllers/crudUsers.js";

const routes = {
    "/": "/src/views/home.html",
    "/login": "/src/views/auth/login.html",
    "/register": "/src/views/auth/register.html",
    "/events": "/src/views/events/index.html",
    "/users": "/src/views/users/index.html",
}

const users = await getData();

export async function renderRoute() {
    const path = location.pathname;
    const app = document.getElementById("app");
    let loggedInUser = localStorage.getItem("loggedInUser") ? true : false;
    const file = routes[path] || "/src/views/404.html";

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
                case "/src/views/home.html":
                    alert("Bienvenido de nuevo, " + loggedInUser);
                    break;

                case "/src/views/users/index.html":
                    users.forEach(u => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${u.id}</td>
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
                        alert('hola')
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

                    sendData(form);
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