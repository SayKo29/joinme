import { Linking } from 'react-native'

export function formatDateRelative (date) {
    // check if date is a Date object

    const now = new Date()
    const auxDate = new Date(date)
    const diff = now.getTime() - auxDate.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    const timeUnits = [
        { unit: 'día', value: days },
        { unit: 'hora', value: hours },
        { unit: 'minuto', value: minutes }
    ]

    for (const { unit, value } of timeUnits) {
        if (value > 0) {
            const plural = value !== 1 ? 's' : ''
            return `hace ${value} ${unit}${plural}`
        }
    }

    return 'hace unos segundos'
}

export const formatDateTime = (date) => {
    // format date to 01/01/2021 12:00
    const day = String(date.getDate()).padStart(2, '0')
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day} ${month} ${hours}:${minutes}h`
}

export const openGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
    )}`
    Linking.openURL(url)
}

// Función para comparar objetos de forma profunda
export const deepEqual = (obj1, obj2) => {
    // Si los objetos son nulos, son iguales
    if (obj1 === null && obj2 === null) {
        return true;
    }
    // return false si alguno de los objetos es nulo
    if (obj1 === null || obj2 === null) {
        return false;
    }

    // Si los objetos son del mismo tipo, continuamos con la comparación
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
        // Obtenemos las claves de ambos objetos
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // Si el número de claves es diferente, los objetos no son iguales
        if (keys1.length !== keys2.length) {
            return false;
        }

        // Iteramos sobre las claves del primer objeto
        for (const key of keys1) {
            // Si el segundo objeto no tiene la misma clave o los valores no son iguales, los objetos no son iguales
            if (!obj2.hasOwnProperty(key) || !deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        // Si llegamos aquí, significa que todos los pares clave-valor son iguales
        return true;
    }

    // Si los objetos no son del mismo tipo o son primitivos, simplemente los comparamos con el operador de igualdad
    return obj1 === obj2;
}

function calculateDistance (lat1, lon1, lat2, lon2) {
    const radioTierra = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = radioTierra * c;
    return distancia;
}

// Función para ordenar los eventos por distancia al usuario
export function sortEventsByCloser (usuarioLat, usuarioLng, eventos) {
    eventos.sort((eventoA, eventoB) => {
        const distanciaA = calculateDistance(usuarioLat, usuarioLng, eventoA?.coords?.lat, eventoA?.coords?.lng);
        const distanciaB = calculateDistance(usuarioLat, usuarioLng, eventoB.coords?.lat, eventoB?.coords?.lng);
        return distanciaA - distanciaB;
    });
    return eventos;
}