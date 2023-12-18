export default async function getEventsByParticipant(participantId) {
    const response = await fetch(
        "https://calm-lime-armadillo.cyclic.app/api/events/participant/" +
            participantId
        // "http://192.168.1.199:3000/api/events/participant/" + participantId
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}
