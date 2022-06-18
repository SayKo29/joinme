import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery } from 'react-query'
import getMarkersData from '../api/MarkersData'
import * as Location from 'expo-location';
import tw from 'twrnc';


export default function Discover () {

    const [location, setLocation] = useState(null);

    const [markerPressed, setMarkerPressed] = useState(false);

    const query = useQuery('MARKERS', getMarkersData);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
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

    if (location != null) {

        return (
            <View style={styles.container}>
                {/*Render our MapView*/}
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    //specify our coordinates.
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    mapType="standard"
                >
                    {query.data.data.map((marker, index) => (
                        <Marker
                            key={index}
                            title={marker.title}
                            description={marker.description}
                            coordinate={{
                                latitude: parseFloat(marker.latitude),
                                longitude: parseFloat(marker.longitude),
                            }}
                        // onPress={(e) => handleMarkerPressed(marker)}
                        ></Marker>


                    ))}
                    {/* Mi ubicación */}
                    <Marker
                        coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}

                    >
                        <Callout style>
                            <Image source={require('../assets/userLocation.png')} />
                            <Text>Mi ubicación</Text>
                        </Callout>
                        <Image source={require('../assets/userLocation.png')} style={{ width: 40, height: 40 }} />
                    </Marker>
                </MapView>
            </View>
        );
    }
    return (
        <View style={tw.style('h-full justify-center')}>
            <Text style={tw.style('self-center text-xl text-blue-600')}>Obteniendo ubicación y cargando mapa...</Text>
        </View>
    )


}
//create our styling code:
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1, //the container will fill the whole screen.
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});