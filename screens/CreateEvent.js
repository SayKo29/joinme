import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, TextInput, StyleSheet, Appearance } from 'react-native'
import getCategories from '../api/CategoryData'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CreateEventPost from '../api/CreateEventPost'
import colors from '../styles/colors'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'
import mapStyle from '../styles/mapStyle'
import { LinearGradient } from 'expo-linear-gradient'

const CreateEvent = ({ navigation }) => {
  const categories = useQuery('CATEGORIES', getCategories)
  const dataSet = []
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState({})
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { mutate } = useMutation(CreateEventPost)
  const queryClient = useQueryClient()

  //   get current location
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [markerPressed, setMarkerPressed] = useState(false)

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

  const handleCreateEvent = async () => {
    const event = {
      name,
      description,
      category: selectedCategory.id,
      longitude: selectedLocation?.longitude,
      latitude: selectedLocation?.latitude,
      user: '634ed058ba603fa66e53732f'
    }
    mutate(event, {
      onSuccess: () => {
        queryClient.invalidateQueries('EVENTS')
        navigation.navigate('Events')
        //  clear form
        setName('')
        setDescription('')
        setSelectedCategory(null)
        setSelectedLocation({})
      }
    })
  }

  if (categories.data) {
    // format data for autocomplete
    categories.data.map((category) => {
      return dataSet.push({ id: category._id, title: category.name })
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#b7443f', '#513b68']}
        style={styles.background}
        locations={[0.45, 1]}
      />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Crea un nuevo evento</Text>
        <Text style={styles.label}>Name of the event</Text>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
          placeholder='Padel Game'
          placeholderTextColor={colors.gray}
        />
        <Text style={styles.label} className='pt-3'>Descripción del evento</Text>
        <TextInput
          style={styles.input}
          value={description}
          placeholderTextColor={colors.gray}
          onChangeText={(text) => setDescription(text)}
          placeholder='Breve descripción del evento'
          multiline
        />
        <Text style={styles.label}>Category</Text>
        <AutocompleteDropdown
          inputContainerStyle={styles.autocompleteInput}
          containerStyle={styles.autocompleteContainer}
          rightButtonsContainerStyle={styles.rightButtonsContainerStyle}
          suggestionsListContainerStyle={styles.suggestionsListContainerStyle}
          suggestionsListTextStyle={styles.suggestionsListTextStyle}
          clearOnFocus={false}
          closeOnBlur
          closeOnSubmit
          onSelectItem={setSelectedCategory}
          dataSet={dataSet}
        />
        <Text style={styles.label}>Location</Text>
        {/* click on map to get location */}
        {/* render map if user location */}
        {/* when user press show a marker */}
        {/* show loader when loading location */}

        {!location
          ? (
            <Text>Loading...</Text>
            )
          : (
            <MapView
              style={styles.map} onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
        //   google maps engine
              customMapStyle={Appearance.getColorScheme() === 'dark' ? mapStyle : null}
              provider='google'
              initialRegion={{
                // user location
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                // zoom
                latitudeDelta: 9.0922,
                longitudeDelta: 9.0421

              }}
            >
              {selectedLocation?.latitude && (
                <MapView.Marker
                  coordinate={selectedLocation}
                  title='Event Location'
                  description='This is the event location'
                />
              )}

            </MapView>
            )}
        {/* <Text>{selectedLocation}</Text> */}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCreateEvent}
        >
          <Text className='text-white text-center text-xl'>
            Crear evento
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%'
  },
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  formContainer: {
    width: '90%',
    height: '100%',
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.white
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    color: colors.white
  },
  input: {

    // border bottom
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    width: '100%',
    height: 40,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5

  },
  autocompleteContainer: {
    width: '100%',
    height: 40,
    color: colors.white,
    marginBottom: 20
  },
  rightButtonsContainerStyle: {
    width: 0,
    height: 0
  },
  suggestionsListTextStyle: {
    width: '100%',
    height: 40,
    borderWidth: 1
  },
  autocompleteInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20
  },
  submitButton: {
    backgroundColor: colors.white,
    width: '100%',
    height: 40,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
})

export default CreateEvent
