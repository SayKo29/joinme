export default async function getMarkersData() {
    const response = await fetch(
        // "https://landscapediscoverapi.herokuapp.com/api/event"
        "http://192.168.1.199:3000/api/event"
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}
