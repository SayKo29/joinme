export default async function getEventsData() {
    const response = await fetch(
        // "https://calm-lime-armadillo.cyclic.app/api/events"
        "http://192.168.1.160:3000/api/events"
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}
