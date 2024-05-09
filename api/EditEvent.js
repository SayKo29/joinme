export default async function EditEvent (event) {
    const requestBody = {
        name: event.name,
        description: event.description,
        category: event.category,
        location: event.location,
        images: event.images,
        isRemote: event.isRemote,
        user: event.user,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
    };

    if (event.location?.position) {
        requestBody.coords = {
            lat: event.location.position.lat.toString(),
            lng: event.location.position.lng.toString()
        };
    }
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