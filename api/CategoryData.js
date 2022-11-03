export default async function getCategories() {
    const response = await fetch(
        // "https://joinmeapi.onrender.com/api/categories"
        "http://192.168.1.58:5000/api/categories"
    );
    if (!response.status) {
        throw new Error("NO va");
    }
    return response.json();
}
