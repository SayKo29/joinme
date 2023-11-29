export function formatDate(date) {
    const now = new Date();
    const auxDate = new Date(date);
    const diff = now.getTime() - auxDate.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `hace ${days} días`;
    } else if (hours > 0) {
        return `hace ${hours} horas`;
    } else if (minutes > 0) {
        return `hace ${minutes} minutos`;
    } else {
        return `hace unos segundos`;
    }
}

export const formatDateTime = (date) => {
    // format date to 01/01/2021 12:00
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Sumar 1 porque los meses van de 0 a 11
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};
