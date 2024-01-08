export default async function getUsersData() {
    const response = await fetch(
        // "https://calm-lime-armadillo.cyclic.app/api/users"
        "http://192.168.1.160:3000/api/users"
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}
