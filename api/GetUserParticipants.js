export default async function getUserParticipants(id) {
    const response = await fetch(
        // "https://calm-lime-armadillo.cyclic.app/api/users/event/" + id
        "http://192.168.1.160:3000/api/users/event/" + id
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}
