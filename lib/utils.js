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
