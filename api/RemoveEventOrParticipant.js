export default async function RemoveEventOrParticipant (event) {
    const requestBody = {
        user: event.user,
        participants: event.participants,
        chatroom: event.chatroom,
        status: event.status,
    };

    if (event.location?.position) {
        requestBody.coords = {
            lat: event.location.position.lat.toString(),
            lng: event.location.position.lng.toString()
        };
    }
    console.log('requestBody', requestBody)
    // "https://joinmeapi.onrender.com/api/events",

    const response = await fetch("https://joinmeapi.onrender.com/api/events/" + event._id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json' // Especifica el tipo de contenido como JSON
        },
        body: JSON.stringify(requestBody) // Serializa el objeto a JSON
    });

    if (!response.ok) {
        throw new Error('Error al enviar el evento' + response.status)
    }

    return response.json();
}