import React, { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery } from "react-query";
import getMarkersData from "../api/MarkersData";
import * as Location from "expo-location";
import GallerySwiper from "react-native-gallery-swiper";
import { useNavigation } from "@react-navigation/native";
import LottieAnimation from "../components/LottieAnimation";

export default function Events() {
    const [location, setLocation] = useState(null);

    const [markerPressed, setMarkerPressed] = useState(false);

    const events = useQuery("MARKERS", getMarkersData);

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

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

                {markerPressed.images ? (
                    <View style={styles.slider}>
                        {/* Imagenes preview */}

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
                )}
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
        position: "relative",
    },
    panelHeader: {
        height: "10%",
        backgroundColor: "#561F37",
        alignItems: "center",
        justifyContent: "start",
    },
    lottie: { width: "100%", height: "100%" },
});
