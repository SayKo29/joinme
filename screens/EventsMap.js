import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, Image, Appearance } from 'react-native'
import MapView from 'react-native-map-clustering'
import { Marker } from 'react-native-maps'
import { useQuery } from 'react-query'
import getEventsData from '../api/EventsData'
import * as Location from 'expo-location'
import LottieAnimation from '../components/LottieAnimation'
import { useAuth } from '../contexts/Auth'
import mapStyle from '../styles/mapStyle'
import colors from '../styles/colors'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import EventDetail from '../components/EventDetail'

export default function Events ({ navigation }) {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [markerPressed, setMarkerPressed] = useState(false)

  //   bottom sheet
  const sheetRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const snapPoints = ['40%', '100%']

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
    // clean up function
    return () => {
      console.log('clean up')
    }
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

  //   show lottie until location is found
  if (!location || !data) {
    return (
      <LottieAnimation />
    )
  } else {
    return (
      <View style={styles.container}>
        {/* Render our MapView */}
        <View style={styles.mapContainer}>
          <MapView
            provider='google'
            clusterColor={colors.primary}
            customMapStyle={Appearance.getColorScheme() === 'dark' ? mapStyle : null}
            // provider={PROVIDER_GOOGLE}
            onPress={() =>
              markerPressed ? setMarkerPressed(false) : null}
                        // conditional rendering for the map
            style={styles.map}
                        // specify our coordinates.
            initialRegion={{
              // latitude: 40.416775,
              latitude: location.coords.latitude,
              // longitude: 43.263,
              longitude: location.coords.longitude,
              latitudeDelta: 0.6,
              longitudeDelta: 0.6
            }}
            mapType='standard'
          >
            {data.map((event, index) => (
              <Marker
                key={index}
                tracksViewChanges={false}
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
                source={
                    user.authData.user.avatar
                      ? { uri: user.authData.user.avatar }
                      : require('../assets/avatar.jpg')
                }
                style={{ width: 60, height: 60, borderRadius: 50 }}
              />
            </Marker>
          </MapView>
          {markerPressed && (
            <BottomSheet
              onClose={() => setMarkerPressed(false)}
              backgroundStyle={{ backgroundColor: colors.purple }}
              handleIndicatorStyle={{
                backgroundColor: colors.primary
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
    )
  }
}
// create our styling code:
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent'
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
    height: '100%'
  },
  lottie: { width: '100%', height: '100%' },
  slider: {
    backgroundColor: colors.purple
  }
})
