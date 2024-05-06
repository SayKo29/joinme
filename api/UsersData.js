export default async function getUsersData () {
    const response = await fetch(
        'https://joinmeapi.onrender.com/api/users'
        // "http://192.168.1.146:3000/api/users"
    )
    if (!response.status) {
        throw new Error('NO va')
    }
    return response.json()
}
