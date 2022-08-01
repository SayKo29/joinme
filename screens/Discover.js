import React, { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery } from "react-query";
import getMarkersData from "../api/MarkersData";
import * as Location from "expo-location";
import GallerySwiper from "react-native-gallery-swiper";
import SlidePanelDetail from "../components/SlidePanelDetail";
import { useNavigation } from "@react-navigation/native";
import LottieAnimation from "../components/LottieAnimation";

export default function Discover() {
    const [location, setLocation] = useState(null);

    const [markerPressed, setMarkerPressed] = useState(false);

    const query = useQuery("MARKERS", getMarkersData);

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

    if (query.isLoading) {
        return <Text>Loading markers...</Text>;
    }
    if (query.isError) {
        return <Text>Error markers...</Text>;
    }

    const handleMarkerPressed = (marker) => {
        setMarkerPressed(marker);
    };

    if (location) {
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
                        {query.data.data.map((marker, index) => (
                            <Marker
                                key={index}
                                title={marker.title}
                                description={marker.description}
                                coordinate={{
                                    latitude: parseFloat(marker.latitude),
                                    longitude: parseFloat(marker.longitude),
                                }}
                                onPress={(e) =>
                                    handleMarkerPressed(marker)
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

                {markerPressed && (
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
                        <SlidePanelDetail
                            markerData={markerPressed}></SlidePanelDetail>
                    </View>
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
