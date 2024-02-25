export default async function CreateEventPost (event) {
  const formData = new FormData()
  // Agrega los datos del evento al formulario
  formData.append('name', event.name)
  formData.append('description', event.description)
  formData.append('category', event.category)
  formData.append('location', event.location)
  formData.append('startDate', event.startDate)
  formData.append('endDate', event.endDate)
  formData.append('user', event.user)
  formData.append('participants', event.participants)
  formData.append('chatroom', event.chatroom)
  formData.append('isRemote', !!event.isRemote)
  // poner todo encima de images que peta
  formData.append('images', event.images)

  // Realiza la solicitud utilizando 'multipart/form-data'
  // "https://calm-lime-armadillo.cyclic.app/api/events",
  // const response = await fetch("http://192.168.1.146:3000/api/events", {
  const response = await fetch(
    'https://calm-lime-armadillo.cyclic.app/api/events',
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
