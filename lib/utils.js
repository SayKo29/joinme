import { Linking } from "react-native";
export function formatDate(date) {
    const now = new Date();
    const auxDate = new Date(date);
    const diff = now.getTime() - auxDate.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const timeUnits = [
        { unit: "día", value: days },
        { unit: "hora", value: hours },
        { unit: "minuto", value: minutes },
    ];

    for (const { unit, value } of timeUnits) {
        if (value > 0) {
            const plural = value !== 1 ? "s" : "";
            return `hace ${value} ${unit}${plural}`;
        }
    }

    return "hace unos segundos";
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

export const openGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
    )}`;
    Linking.openURL(url);
};
