import React, { useRef, useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Marker } from 'react-native-maps'
import MapView from 'react-native-map-clustering'
import * as Location from 'expo-location'
import { useAuth } from '@/contexts/Auth'
import LottieAnimation from '../LottieAnimation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getGeolocation } from 'services/geolocation'
import colors from '@/styles/colors'
import mapStyle from '@/styles/mapStyle'
import EventCard from '../EventCard'
import BottomSheet from './BottomSheet'
import { useNavigation } from '@react-navigation/native'
import useEventStore from 'store/EventStore'

const EventMap = () => {
    const navigation = useNavigation();
    const [location, setLocation] = useState(null)
    const [markerPressed, setMarkerPressed] = useState(false)
    const sheetRef = useRef(null)
    const mapRef = useRef(null)
    const user = useAuth()
    const userLoggedIn = user.authData.user
    let data = useEventStore((state) => state.events)
    const events = data.data
        ? data.data.filter((event) => event.user !== userLoggedIn._id)
        : []
    const [mapLoaded, setMapLoaded] = useState(false)
    const [initialRegion, setInitialRegion] = useState(null)
    const [permissionDenied, setPermissionDenied] = useState(false)
    const markerRefs = useRef([])

    const renderMarkers = useCallback(() => {
        return events.map((event) => (
            <Marker
                key={event._id}
                title={event?.name}
                description={event.description}
                coordinate={{
                    latitude: parseFloat(event?.coords?.lat),
                    longitude: parseFloat(event?.coords?.lng)
                }}
                ref={(ref) => markerRefs[event._id] = ref}
                pinColor={colors.primary}
                onPress={() => handleMarkerPressed(event)}
            />
        ))
    }, [events])

    const renderLocationMarker = useCallback(
        () => (
            <Marker
                coordinate={{
                    latitude: parseFloat(location?.coords?.latitude),
                    longitude: parseFloat(location?.coords?.longitude)
                }}
            >
                <Image
                    source={
                        userLoggedIn?.picture
                            ? { uri: userLoggedIn?.picture }
                            : require('../../assets/avatar.png')
                    }
                    style={styles.avatar}
                />
            </Marker>
        ),
        [
            location?.coords?.latitude,
            location?.coords?.longitude,
            userLoggedIn?.picture
        ]
    )

    const goToEventDetail = (event, user) => {
        navigation.navigate('EventDetailScreen', { event, user })
    }

    useEffect(() => {
        const loadInitialRegion = async () => {
            try {
                const region = await AsyncStorage.getItem('region')
                if (region) {
                    setInitialRegion(JSON.parse(region))
                    setMapLoaded(true)
                }
            } catch (error) {
                console.error('Error loading initial region:', error)
            }
        }

        loadInitialRegion()
    }, [])

    useEffect(() => {
        const getLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                setPermissionDenied(true);
                return;
            }

            const location = await getGeolocation();
            setLocation(location);
            const region = {
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03
            };
            setInitialRegion(region);

            const storedRegion = await AsyncStorage.getItem('region');
            if (storedRegion) {
                const parsedRegion = JSON.parse(storedRegion);
                if (parsedRegion.latitude === region.latitude && parsedRegion.longitude === region.longitude) {
                    return;
                }
            }

            AsyncStorage.setItem('region', JSON.stringify(region));
        };

        getLocation();
    }, []);

    useEffect(() => {
        if (initialRegion) {
            mapRef?.current?.animateToRegion(initialRegion, 2000);
        }
    }, [initialRegion]);

    const handleMarkerPressed = (marker) => {
        setMarkerPressed(marker)
    }

    const hideMarker = () => {
        const markerRefId = markerPressed._id
        markerRefs[markerRefId].hideCallout()
        setMarkerPressed(false)
    }

    useEffect(() => {
        if (markerPressed) {
            sheetRef.current?.expand()
        }
    }, [markerPressed])


    if (location != null && !data) {
        return <LottieAnimation />
    }

    return (
        <View style={styles.container}>
            {
                permissionDenied && (
                    <View style={{ padding: 20, backgroundColor: colors.background }}>
                        <Text>Has denegado el permiso de ubicación, por favor actívalo en los ajustes de tu dispositivo</Text>
                    </View>
                )
            }
            <View style={styles.mapContainer}>
                {mapLoaded && (
                    <MapView
                        ref={mapRef}
                        provider='google'
                        clusterColor={colors.primary}
                        customMapStyle={
                            mapStyle
                        }
                        style={styles.map}
                        mapType='standard'
                        initialRegion={initialRegion}
                    >
                        {renderMarkers()}
                        {renderLocationMarker()}
                    </MapView>
                )}
                {markerPressed && (
                    <BottomSheet
                        ref={sheetRef}
                        snapTo={'70%'}
                        backgroundColor={colors.background}
                        hasClosed={() => hideMarker()}
                        backDropColor={'black'}>
                        <EventCard event={markerPressed} user={userLoggedIn} onEventPress={goToEventDetail} />
                    </BottomSheet>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    slider: {
        backgroundColor: colors.background
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 50
    }
})

export default EventMap