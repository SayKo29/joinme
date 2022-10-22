export default async function getMarkersData() {
    const response = await fetch(
        "https://joinmeapi.onrender.com/api/events"
        // "http://192.168.1.199:3000/api/event"
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}
