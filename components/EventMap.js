import { View, Text, StyleSheet, Appearance, Image } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import colors from "../styles/colors";
import { useQuery } from "react-query";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import getEventsData from "../api/EventsData";
import * as Location from "expo-location";
import LottieAnimation from "./LottieAnimation";
import { useAuth } from "../contexts/Auth";
import mapStyle from "../styles/mapStyle";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import EventDetail from "./EventDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EventMap = ({ data }) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [markerPressed, setMarkerPressed] = useState(false);

    //   bottom sheet
    const sheetRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const snapPoints = ["40%", "100%"];

    const user = useAuth();

    const INITIAL_REGION = {
        latitude: 52.5,
        longitude: 19.2,
        latitudeDelta: 8.5,
        longitudeDelta: 8.5,
    };
    const mapRef = useRef();

    // get ios location
    if (Platform.OS === "ios") {
        useEffect(() => {
            (async () => {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setErrorMsg("Permission to access location was denied");
                    return errorMsg;
                }

                const location = await Location.getCurrentPositionAsync({});
                setLocation(location);
                let region = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 7.5,
                    longitudeDelta: 7.5,
                };

                mapRef.current.animateToRegion(region, 2000);
            })();
            // clean up function
            return () => {
                console.log("clean up");
            };
        }, []);
    }

    // get android location
    if (Platform.OS === "android") {
        useEffect(() => {
            (async () => {
                let { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setErrorMsg("Permission to access location was denied");
                    return errorMsg;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation(location.coords);
                let region = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 7.5,
                    longitudeDelta: 7.5,
                };

                mapRef.current.animateToRegion(region, 2000);
            })();
            // clean up function
            return () => {
                console.log("clean up");
            };
        }, []);
    }

    const handleMarkerPressed = (marker) => {
        setMarkerPressed(marker);
    };

    //   show lottie until location is found
    if (location != null && !data) {
        return <LottieAnimation />;
    }
    // storage events data to async storage
    AsyncStorage.setItem("events", JSON.stringify(data));

    return (
        <View style={styles.container}>
            {/* Render our MapView */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider="google"
                    clusterColor={colors.primary}
                    customMapStyle={
                        Appearance.getColorScheme() === "dark" ? mapStyle : null
                    }
                    // provider={PROVIDER_GOOGLE}
                    onPress={() =>
                        markerPressed ? setMarkerPressed(false) : null
                    }
                    // conditional rendering for the map
                    style={styles.map}
                    // specify our coordinates.
                    initialRegion={INITIAL_REGION}
                    mapType="standard"
                >
                    {data.data.map((event, index) => (
                        <Marker
                            key={index}
                            tracksViewChanges={false}
                            title={event?.title}
                            description={event.description}
                            coordinate={{
                                latitude: parseFloat(event?.latitude),
                                longitude: parseFloat(event?.longitude),
                            }}
                            onPress={(e) => handleMarkerPressed(event)}
                        />
                    ))}

                    {/* Mi ubicación */}
                    <Marker
                        coordinate={{
                            latitude: parseFloat(location?.latitude),
                            longitude: parseFloat(location?.longitude),
                        }}
                    >
                        <Image
                            source={
                                user.authData.user.avatar
                                    ? { uri: user.authData.user.avatar }
                                    : require("../assets/avatar.jpg")
                            }
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 50,
                            }}
                        />
                    </Marker>
                </MapView>
                {markerPressed && (
                    <BottomSheet
                        onClose={() => setMarkerPressed(false)}
                        backgroundStyle={{ backgroundColor: colors.background }}
                        handleIndicatorStyle={{
                            backgroundColor: colors.accent,
                        }}
                        ref={sheetRef}
                        snapPoints={snapPoints}
                        enablePanDownToClose
                    >
                        <BottomSheetView style={styles.slider}>
                            <EventDetail markerPressed={markerPressed} />
                        </BottomSheetView>
                    </BottomSheet>
                )}
            </View>
            {/* Show sliding panel if marker pressed with markerPressed prop */}
        </View>
    );
};

// create our styling code:
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "transparent",
    },
    mapContainer: {
        backgroundColor: "transparent",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    map: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    lottie: { width: "100%", height: "100%" },
    slider: {
        backgroundColor: colors.background,
    },
});

export default EventMap;
