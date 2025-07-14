import axios from "axios";

const eventsUrl = "http://localhost:8000/events";
const usersUrl = "http://localhost:8000/users";
const appointmentUrl = "http://localhost:8000/appointments";
const respUsers = await axios.get(usersUrl);
const users = respUsers.data;

export async function getDataAppointments() {
    try {
        const resp = await axios.get(appointmentUrl);
        const data = resp.data;

        return data.sort(function (a, b) {
            return new Date(b.created) - new Date(a.created);
        });

    } catch (error) {
        console.log(error);
        return "Algo salió mal";
    }
}


export async function sendDataAppointment(eventId, numberOfTickets) {
    try {
        const eventResponse = await axios.get(`${eventsUrl}/${eventId}`);
        const event = eventResponse.data;

        if (event.availableSeats === 0) {
            alert("Lo sentimos, no quedan asientos disponibles para este evento.");
            return false;
        }

        if (numberOfTickets > event.availableSeats) {
            alert(`Solo quedan ${event.availableSeats} asiento(s) disponible(s). No puedes reservar ${numberOfTickets}.`);
            return false;
        }

        const updatedAvailableSeats = event.availableSeats - numberOfTickets;

        const updatedEventData = {
            ...event,
            availableSeats: updatedAvailableSeats
        };

        await axios.put(`${eventsUrl}/${eventId}`, updatedEventData);

        const appointmentUrl = "http://localhost:8000/appointments";
        const user = users.find(u => u.email == localStorage.getItem('loggedInUser'));
        await axios.post(appointmentUrl, { event_id: eventId, numberOfTickets: numberOfTickets, user_id: user.id, created: new Date().toISOString() });

        alert(`¡Reserva exitosa para ${numberOfTickets} asiento(s) en "${event.title}"!`);
        return true;

    } catch (error) {
        console.error('Error al crear la reserva:', error);
        alert("Ocurrió un error al procesar tu reserva. Por favor, inténtalo de nuevo.");
        return false;
    }
}

export async function deleteAppointment(appointmentId) {
    const confirmed = confirm(
        "¿Estás seguro de que quieres eliminar esta reserva?"
    );
    if (!confirmed) return;

    try {
        const appointmentResponse = await axios.get(`${appointmentUrl}/${appointmentId}`);
        const appointment = appointmentResponse.data;

        const { event_id, numberOfTickets } = appointment;

        const eventResponse = await axios.get(`${eventsUrl}/${event_id}`);
        const event = eventResponse.data;

        const updatedEventData = {
            ...event,
            availableSeats: event.availableSeats + numberOfTickets
        };

        await axios.put(`${eventsUrl}/${event_id}`, updatedEventData);

        await axios.delete(`${appointmentUrl}/${appointmentId}`);

        alert("Reserva eliminada con éxito");
        location.reload();
    } catch (error) {
        console.error("Error al eliminar reserva:", error);
        alert("Error al eliminar la reserva. Intenta de nuevo.");
    }
}
