import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useQuery } from 'react-query'

async function getMarkersData () {
    const response = await fetch('http://192.168.1.199:3000/api/marker');
    if (!response.status) {
        throw new Error('NO va');
    }
    return response.json();
}

export default function Discover () {

    const [markerPressed, setMarkerPressed] = useState(false);

    const query = useQuery('MARKERS', getMarkersData);

    if (query.isLoading) {
        return <Text>Loading markers...</Text>;
    }
    if (query.isError) {
        return <Text>Error markers...</Text>;
    }

    return (
        <View style={styles.container}>
            {/*Render our MapView*/}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                //specify our coordinates.
                initialRegion={{
                    latitude: 41.5002487,
                    longitude: 2.3822814,
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
                        onPress={(e) => handleMarkerPressed(marker)}
                    ></Marker>


                ))}
            </MapView>
        </View>
    );
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