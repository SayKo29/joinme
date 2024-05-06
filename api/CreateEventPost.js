export default async function CreateEventPost (event) {
    const formData = new FormData()
    // Agrega los datos del evento al formulario
    formData.append('name', event.name)
    formData.append('description', event.description)
    formData.append('category', event.category)
    formData.append('location', event.location?.address)
    if (event.location?.position) {
        formData.append('coords[lat]', event.location.position.lat.toString());
        formData.append('coords[lng]', event.location.position.lng.toString());
    }
    formData.append('startDate', event.startDate)
    formData.append('endDate', event.endDate)
    formData.append('user', event.user)
    formData.append('participants', event.participants)
    formData.append('chatroom', event.chatroom)
    formData.append('isRemote', !!event.isRemote)
    // Manejar la imagen adjunta
    if (event.images) {
        formData.append('images', event.images); // No necesitas convertirlo a Base64
    }
    // Realiza la solicitud utilizando 'multipart/form-data'
    // "https://joinmeapi.onrender.com/api/events",
    // const response = await fetch("http://192.168.1.199:3000/api/events", {
    const response = await fetch(
        'https://joinmeapi.onrender.com/api/events',
        {
            method: 'POST',
            body: formData
        }
    )

    if (!response.ok) {
        throw new Error('Error al enviar el evento' + response.status)
    }

    return response.json()
}
