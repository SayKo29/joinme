export default async function JoinEvent (event) {
  // make a put request to join event
  //   console.log(event)
  console.log('event', event)
  const response = await fetch(
    'https://calm-lime-armadillo.cyclic.app/api/events/' +
      event._id +
      '/participant',
    // "http://192.168.1.146:3000/api/events/" + event._id + "/participant",
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  )
  if (!response.status) {
    throw new Error('NO va')
  }
  return response.json()
}
