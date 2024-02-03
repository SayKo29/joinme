export default async function getUserCreatedEvents(id) {
    const response = await fetch(
        "https://calm-lime-armadillo.cyclic.app/api/events/user/" + id
        // "http://192.168.1.146:3000/api/events/user/" + id
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}
