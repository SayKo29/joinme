import * as Location from "expo-location";

export async function getGeolocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        throw new Error("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({});
    return location;
}
