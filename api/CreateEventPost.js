export default async function CreateEventPost(event) {
    // post event
    // x-www-form-urlencoded post
    const response = await fetch(
        "https://calm-lime-armadillo.cyclic.app/api/events",
        // "http://192.168.1.199:3000/api/events",
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(event),
        }
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}
