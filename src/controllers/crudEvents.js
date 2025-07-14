import axios from "axios";

let currentEditId = null;
const eventsUrl = "http://localhost:8000/events";

export async function getDataEvents() {
    try {
        const resp = await axios.get(eventsUrl);
        const data = resp.data;

        return data.sort(function (a, b) {
            return new Date(b.created) - new Date(a.created);
        });

    } catch (error) {
        console.log(error);
        return "Algo salió mal";
    }
}

export async function sendDataEvents(formData) {
    try {
        await axios.post(eventsUrl, formData);
        alert('Evento creado exitosamente!')
    } catch (error) {
        console.log(error);
        return "ocurrió un error";
    }
}

function setEditId(id) {
    currentEditId = id;
}

function clearEditId() {
    currentEditId = null;
}

export async function deleteEvent(id) {
    const confirmed = confirm(
        "¿Estás seguro de que quieres eliminar este evento?"
    );
    if (!confirmed) return;
    try {
        await axios.delete(`${eventsUrl}/${id}`);
        alert("Evento eliminado con éxito");
        location.reload();
    } catch (error) {
        console.log(error);
        alert("Error al eliminar Evento");
    }
}

export async function editEvent(id) {
    try {
        const resp = await axios.get(eventsUrl);
        const dataResponse = resp.data;
        const data = dataResponse.find(e => e.id == id)

        document.getElementById("title").value = data.title;
        document.getElementById("description").value = data.description;
        document.getElementById("date").value = data.date;
        document.getElementById("location").value = data.location;
        document.getElementById("capacity").value = data.capacity;
        document.getElementById("created").value = data.created;

        setEditId(id);

    } catch (error) {
        console.error('Error al obtener evento para editar:', error);
        alert("Error al obtener el evento para editar.");
    }
}

export async function updateEvent() {

    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const dateInput = document.getElementById('date');
    const locationInput = document.getElementById('location');
    const availableSeatsInput = document.getElementById('availableSeats');
    const capacityInput = document.getElementById('capacity');
    const createdInput = document.getElementById('created');

    const title = titleInput.value;
    const description = descriptionInput.value;
    const date = dateInput.value;
    const location = locationInput.value;
    const availableSeats = availableSeatsInput.value;
    const capacity = capacityInput.value;
    const created = createdInput.value;


    try {
        const updatedData = {
            title: title,
            description: description,
            date: date,
            location: location,
            availableSeats: availableSeats,
            capacity: capacity,
            created: created
        };

        await axios.put(`${eventsUrl}/${currentEditId}`, updatedData);
        alert("Evento actualizado con éxito.");

        titleInput.value = '';
        descriptionInput.value = '';
        dateInput.value = '';
        locationInput.value = '';
        availableSeatsInput.value = '';
        capacityInput.value = '';
        createdInput.value = '';

        clearEditId(); 
        location.reload();

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        alert("Error al actualizar el usuario.");
    }
}