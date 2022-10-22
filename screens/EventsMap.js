import React, { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery } from "react-query";
import getEventsData from "../api/EventsData";
import GallerySwiper from "react-native-gallery-swiper";
import { useNavigation } from "@react-navigation/native";
import LottieAnimation from "../components/LottieAnimation";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

export default function Events() {
    const [location, setLocation] = useState(null);

    const [markerPressed, setMarkerPressed] = useState(false);

    const events = useQuery("EVENTS", getEventsData);

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
    let foregroundSubscription = null;

    // Define the background task for location tracking
    TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
        if (error) {
            console.error(error);
            return;
        }
        if (data) {
            // Extract location coordinates from data
            const { locations } = data;
            const location = locations[0];
            if (location) {
                console.log("Location in background", location.coords);
            }
        }
    });

    // Request permissions right after starting the app
    useEffect(() => {
        const requestPermissions = async () => {
            const foreground =
                await Location.requestForegroundPermissionsAsync();
            if (foreground.granted)
                await Location.requestBackgroundPermissionsAsync();
        };
        requestPermissions();
    }, []);

    // Start location tracking in foreground
    const startForegroundUpdate = async () => {
        // Check if foreground permission is granted
        const { granted } = await Location.getForegroundPermissionsAsync();
        if (!granted) {
            console.log("location tracking denied");
            return;
        }

        // Make sure that foreground location tracking is not running
        foregroundSubscription?.remove();

        // Start watching location in real-time
        foregroundSubscription = await Location.watchlocationAsync(
            {
                // For better logs, we set the accuracy to the most sensitive option
                accuracy: Location.Accuracy.BestForNavigation,
            },
            (location) => {
                setLocation(location.coords);
            }
        );
    };

    // Stop location tracking in foreground
    //   const stopForegroundUpdate = () => {
    //     foregroundSubscription?.remove()
    //     setLocation(null)
    //   }

    // Start location tracking in background
    const startBackgroundUpdate = async () => {
        // Don't track location if permission is not granted
        const { granted } = await Location.getBackgroundPermissionsAsync();
        if (!granted) {
            console.log("location tracking denied");
            return;
        }

        // Make sure the task is defined otherwise do not start tracking
        const isTaskDefined = await TaskManager.isTaskDefined(
            LOCATION_TASK_NAME
        );
        if (!isTaskDefined) {
            console.log("Task is not defined");
            return;
        }

        // Don't track if it is already running in background
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
            LOCATION_TASK_NAME
        );
        if (hasStarted) {
            console.log("Already started");
            return;
        }

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            // For better logs, we set the accuracy to the most sensitive option
            accuracy: Location.Accuracy.BestForNavigation,
            // Make sure to enable this notification if you want to consistently track in the background
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: "Location",
                notificationBody: "Location tracking in background",
                notificationColor: "#fff",
            },
        });
    };

    // Stop location tracking in background
    const stopBackgroundUpdate = async () => {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
            LOCATION_TASK_NAME
        );
        if (hasStarted) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            console.log("Location tacking stopped");
        }
    };

    if (events.isLoading) {
        return <Text>Loading events...</Text>;
    }
    if (events.isError) {
        return <Text>Error events...</Text>;
    }

    const handleMarkerPressed = (marker) => {
        console.log(marker);
        setMarkerPressed(marker);
    };

    if (location && events) {
        startForegroundUpdate();
        return (
            <View style={styles.container}>
                {/*Render our MapView*/}
                <View style={styles.mapContainer}>
                    <MapView
                        onPress={() =>
                            markerPressed ? setMarkerPressed(false) : null
                        }
                        provider={PROVIDER_GOOGLE}
                        // conditional rendering for the map
                        style={styles.map}
                        //specify our coordinates.
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.0043,
                            longitudeDelta: 0.0043,
                        }}
                        mapType="standard">
                        {events.data.map((event, index) => (
                            <Marker
                                key={index}
                                title={event.title}
                                description={event.description}
                                coordinate={{
                                    latitude: parseFloat(event.latitude),
                                    longitude: parseFloat(event.longitude),
                                }}
                                onPress={(e) =>
                                    handleMarkerPressed(event)
                                }></Marker>
                        ))}

                        {/* Mi ubicación */}
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}>
                            <Callout style>
                                <Image
                                    source={require("../assets/userLocation.png")}
                                />
                                <Text>Mi ubicación</Text>
                            </Callout>
                            <Image
                                source={require("../assets/userLocation.png")}
                                style={{ width: 40, height: 40 }}
                            />
                        </Marker>
                    </MapView>
                </View>

                {/* Show sliding panel if marker pressed */}

                {/* {markerPressed.images ? (
                    <View style={styles.slider}>
                        {/* Imagenes preview *

                        <GallerySwiper
                            style={styles.gallery}
                            images={markerPressed.images.map((image) => ({
                                source: {
                                    uri: image,
                                },
                            }))}
                        />
                    </View>
                ) : (
                    <Text>Nah</Text>
                )} */}
            </View>
        );
    }
    return <LottieAnimation />;
}
//create our styling code:
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    mapContainer: {
        flex: 1,
        width: "100%",
        height: "50%",
    },
    map: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    slideContainer: {
        flex: 1,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
    },
    slider: {
        width: "100%",
        height: "30%",
    },
    gallery: {
        width: "100%",
        height: "100%",
    },
    panel: {
        flex: 1,
        backgroundColor: "white",
        location: "relative",
    },
    panelHeader: {
        height: "10%",
        backgroundColor: "#561F37",
        alignItems: "center",
        justifyContent: "start",
    },
    lottie: { width: "100%", height: "100%" },
});
