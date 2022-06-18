export default async function getMarkersData () {
    const response = await fetch('http://192.168.1.199:3000/api/marker');
    if (!response.status) {
        throw new Error('NO va');
    }
    return response.json();
}