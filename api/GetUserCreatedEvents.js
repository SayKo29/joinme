export default async function getUserCreatedEvents(id) {
    const response = await fetch(
        "https://calm-lime-armadillo.cyclic.app/api/events/user/" + id
        // "http://192.168.1.199:3000/api/events"
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}
