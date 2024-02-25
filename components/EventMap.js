import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Appearance, Image } from "react-native";
import { Marker } from "react-native-maps";
import MapView from "react-native-map-clustering";
import * as Location from "expo-location";
import { useAuth } from "@/contexts/Auth";
import LottieAnimation from "./LottieAnimation";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import EventDetail from "./EventDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getGeolocation } from "services/geolocation";
import colors from "@/styles/colors";
import mapStyle from "@/styles/mapStyle";

const EventMap = ({ data }) => {
  const [location, setLocation] = useState(null);
  const [markerPressed, setMarkerPressed] = useState(false);
  const sheetRef = useRef(null);
  const mapRef = useRef(null);
  const snapPoints = ["40%", "100%"];
  const user = useAuth();
  const userLoggedIn = user.authData.user;
  const [mapLoaded, setMapLoaded] = useState(false);
  const [initialRegion, setInitialRegion] = useState(null);

  const renderMarkers = useCallback(() => {
    return data.data.map((event, index) => (
      <Marker
        key={index}
        title={event?.title}
        description={event.description}
        coordinate={{
          latitude: parseFloat(event?.latitude),
          longitude: parseFloat(event?.longitude),
        }}
        onPress={() => handleMarkerPressed(event)}
      />
    ));
  }, [data.data]);

  const renderLocationMarker = useCallback(
    () => (
      <Marker
        coordinate={{
          latitude: parseFloat(location?.coords?.latitude),
          longitude: parseFloat(location?.coords?.longitude),
        }}
      >
        <Image
          source={
            userLoggedIn?.avatar
              ? { uri: userLoggedIn?.avatar }
              : require("../assets/avatar.jpg")
          }
          style={styles.avatar}
        />
      </Marker>
    ),
    [
      location?.coords?.latitude,
      location?.coords?.longitude,
      userLoggedIn?.avatar,
    ]
  );

  useEffect(() => {
    const loadInitialRegion = async () => {
      try {
        const region = await AsyncStorage.getItem("region");
        if (region) {
          setInitialRegion(JSON.parse(region));
          setMapLoaded(true);
        }
      } catch (error) {
        console.error("Error loading initial region:", error);
      }
    };

    loadInitialRegion();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await getGeolocation();
      setLocation(location);
      let region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      };
      setInitialRegion(region);
      AsyncStorage.setItem("region", JSON.stringify(region));
      mapRef.current.animateToRegion(region, 2000);
    };

    getLocation();

    return () => {
      console.log("clean up");
    };
  }, []);

  const handleMarkerPressed = (marker) => {
    setMarkerPressed(marker);
  };

  if (location != null && !data) {
    return <LottieAnimation />;
  }

  if (data) {
    AsyncStorage.setItem("events", JSON.stringify(data));
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {mapLoaded && (
          <MapView
            ref={mapRef}
            provider="google"
            clusterColor={colors.primary}
            customMapStyle={
              Appearance.getColorScheme() === "dark" ? mapStyle : null
            }
            onPress={() => (markerPressed ? setMarkerPressed(false) : null)}
            style={styles.map}
            mapType="standard"
            initialRegion={initialRegion}
          >
            {renderMarkers()}
            {renderLocationMarker()}
          </MapView>
        )}
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
    </View>
  );
};

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
  slider: {
    backgroundColor: colors.background,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
});

export default EventMap;
