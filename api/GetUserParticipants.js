export default async function getUserParticipants (id) {
    const response = await fetch(
        'https://joinmeapi.onrender.com/api/users/event/' + id
        // "http://192.168.1.146:3000/api/users/event/" + id
    )
    if (!response.status) {
        throw new Error('NO va')
    }
    return response.json()
}
