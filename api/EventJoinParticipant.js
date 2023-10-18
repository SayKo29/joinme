export default async function JoinEvent(event) {
    // make a put request to join event
    //   console.log(event)
    const response = await fetch(
        // 'https://joinmeapi.onrender.com/api/events/' + event.id,
        "http://192.168.1.39:3000/api/events/" + event.id,
        {
            method: "PUT",
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
