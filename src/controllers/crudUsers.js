import axios from "axios";

let currentEditId = null;
const usersUrl = "http://localhost:8000/users";

export async function getData() {
    try {
        const resp = await axios.get(usersUrl);
        const data = resp.data;

        return data.sort(function (a, b) {
            return new Date(b.created) - new Date(a.created);
        });

    } catch (error) {
        console.log(error);
        return "Algo salió mal";
    }
}

export async function sendData(formData) {
    try {
        await axios.post(usersUrl, formData);
        alert('Usuario creado exitosamente!')
        
        window.location.href = '/login'
    } catch (error) {
        console.log(error);
        return "ocurrió un error";
    }
}

// Función para establecer el ID del usuario que se está editando
function setEditId(id) {
    currentEditId = id;
}

// Función para limpiar el ID cuando ya no se edita
function clearEditId() {
    currentEditId = null;
}

export async function deleteUser(id) {
    const confirmed = confirm(
        "¿Estás seguro de que quieres eliminar este usuario?"
    );
    if (!confirmed) return;
    try {
        await axios.delete(`${usersUrl}/${id}`);
        alert("Usuario eliminado con éxito");
        location.reload(); 
    } catch (error) {
        console.log(error);
        alert("Error al eliminar Usuario");
    }
}

export async function editUser(id) {
    try {
        const resp = await axios.get(usersUrl);
        const dataResponse = resp.data;
        const data = dataResponse.find(e => e.id == id)

        document.getElementById("name").value = data.name;
        document.getElementById("email").value = data.email;
        document.getElementById("role").value = data.role;
        document.getElementById("password").value = '';
        document.getElementById("repeatPassword").value = '';
        document.getElementById("created").value = data.created;

        setEditId(id);

    } catch (error) {
        console.error('Error al obtener usuario para editar:', error); // Usa console.error para errores
        alert("Error al obtener el usuario para editar.");
    }
}

export async function updateUser() {

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const rolInput = document.getElementById('role');
    const passwordInput = document.getElementById('password');
    const repeatPasswordInput = document.getElementById('repeatPassword');
    const createdInput = document.getElementById('created');

    const name = nameInput.value;
    const email = emailInput.value;
    const role = rolInput.value;
    const password = passwordInput.value;
    const repeatPassword = repeatPasswordInput.value;
    const created = createdInput.value;

    let passwordToUpdate = null;
    if (password || repeatPassword) { 
        if (password !== repeatPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        passwordToUpdate = password;
    }

   
    try {
        const resp = await axios.get(`${usersUrl}/${currentEditId}`);
        const existingUser = resp.data;

        const updatedData = {
            name: name,
            email: email,
            role: role,
            password: passwordToUpdate !== null ? passwordToUpdate : existingUser.password,
            created: created
        };

        await axios.put(`${usersUrl}/${currentEditId}`, updatedData);
        alert("Usuario actualizado con éxito.");

        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        repeatPasswordInput.value = '';
        createdInput.value = '';

        clearEditId(); // Limpiar el ID de edición
        location.reload(); // Recargar la página para ver los cambios actualizados

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        alert("Error al actualizar el usuario.");
    }
}