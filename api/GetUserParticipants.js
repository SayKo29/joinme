export default async function getUserParticipants(id) {
    console.log(typeof id, id);
    const response = await fetch(
        "https://calm-lime-armadillo.cyclic.app/api/users/event/" + id
        // "http://192.168.1.199:3000/api/users/event/" + id
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}
