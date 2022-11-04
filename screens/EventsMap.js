import React, { useState, useEffect, useLayoutEffect } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useQuery } from 'react-query'
import getEventsData from '../api/EventsData'
import * as Location from 'expo-location'
import LottieAnimation from '../components/LottieAnimation'
import { useAuth } from '../contexts/Auth'
import SlidePanel from '../components/SlidePanel'

export default function Events ({ navigation }) {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [markerPressed, setMarkerPressed] = useState(false)

  const { isLoading, isError, data } = useQuery(
    'EVENTS',
    getEventsData
  )

  const user = useAuth()

  // get ios location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return errorMsg
      }

      const location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  if (isLoading) {
    return <Text>Loading events...</Text>
  }
  if (isError) {
    return <Text>Error events...</Text>
  }

  const handleMarkerPressed = (marker) => {
    setMarkerPressed(marker)
  }

  if (data && location) {
    return (
      <View style={styles.container}>
        {/* Render our MapView */}
        <View style={styles.mapContainer}>
          <MapView
            onPress={() =>
              markerPressed ? setMarkerPressed(false) : null}
            provider={PROVIDER_GOOGLE}
                        // conditional rendering for the map
            style={styles.map}
                        // specify our coordinates.
            initialRegion={{
              // latitude: 40.416775,
              latitude: location.coords.latitude,
              // longitude: 43.263,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0043,
              longitudeDelta: 0.0043
            }}
            mapType='standard'
          >
            {data.map((event, index) => (
              <Marker
                key={index}
                title={event.title}
                description={event.description}
                coordinate={{
                  latitude: parseFloat(event.latitude),
                  longitude: parseFloat(event.longitude)
                }}
                onPress={(e) =>
                  handleMarkerPressed(event)}
              />
            ))}

            {/* Mi ubicación */}
            <Marker
              coordinate={{
                latitude: parseFloat(
                  location?.coords?.latitude
                ),
                longitude: parseFloat(
                  location?.coords?.longitude
                )
              }}
            >
              <Image
                className='rounded-full'
                source={
                                    user.authData.user.avatar
                                      ? { uri: user.authData.user.avatar }
                                      : require('../assets/avatar.jpg')
                                }
                style={{ width: 40, height: 40 }}
              />
            </Marker>
          </MapView>
        </View>
        {/* Show sliding panel if marker pressed with markerPressed prop */}
        {markerPressed && <SlidePanel markerPressed={markerPressed} />}
      </View>
    )
  }
  return <LottieAnimation />
}
// create our styling code:
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '50%'
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    location: 'relative'
  },
  lottie: { width: '100%', height: '100%' }
})
