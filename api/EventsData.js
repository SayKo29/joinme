export default async function getEventsData() {
    const response = await fetch(
        // "https://joinmeapi.onrender.com/api/events"
        "http://192.168.1.58:5000/api/events"
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}