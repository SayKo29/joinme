import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, SafeAreaView, TextInput, StyleSheet, Appearance, Platform, StatusBar, Dimensions, Button } from 'react-native'
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

  const [loading, setLoading] = useState(false)
  const [suggestionsList, setSuggestionsList] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const dropdownController = useRef(null)

  const searchRef = useRef(null)

  const onClearPress = useCallback(() => {
    setSuggestionsList(null)
  }, [])

  const onOpenSuggestionsList = useCallback(isOpened => {}, [])

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#b7443f', '#513b68']}
        style={styles.background}
        locations={[0.45, 1]}
      />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Crea un nuevo evento</Text>
        <Text style={styles.label}>Nomre del evento</Text>
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
        <View
          style={[
            { flex: 1, flexDirection: 'row', alignItems: 'center' },
            Platform.select({ ios: { zIndex: 1 } })
          ]}
        >
          <AutocompleteDropdown
            ref={searchRef}
            controller={controller => {
              dropdownController.current = controller
            }}
          // initialValue={'1'}
            direction={Platform.select({ ios: 'down' })}
            dataSet={dataSet}
            onSelectItem={setSelectedCategory}
            debounce={600}
            suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
            onClear={onClearPress}
          //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
            onOpenSuggestionsList={onOpenSuggestionsList}
            loading={loading}
            useFilter={false} // set false to prevent rerender twice
            textInputProps={{
              placeholder: 'Selecciona una categoría',
              autoCorrect: false,
              autoCapitalize: 'none',
              style: {
                borderRadius: 25,
                backgroundColor: '#383b42',
                color: '#fff',
                paddingLeft: 18
              }
            }}
            rightButtonsContainerStyle={{
              right: 8,
              height: 30,

              alignSelf: 'center'
            }}
            inputContainerStyle={{
              backgroundColor: '#383b42',
              borderRadius: 25
            }}
            suggestionsListContainerStyle={{
              backgroundColor: '#383b42'
            }}
            containerStyle={{ flexGrow: 1, flexShrink: 1 }}
            renderItem={(item, text) => <Text style={{ color: '#fff', padding: 15 }}>{item.title}</Text>}
            inputHeight={50}
            showChevron={false}
            closeOnBlur={false}
          />
          <View style={{ width: 10 }} />
          <Button style={{ flexGrow: 0 }} title='Toggle' onPress={() => dropdownController.current.toggle()} />
        </View>

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
    position: 'absolute',
    width: '90%',
    height: '100%',
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    // padding for android notch
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
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
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    width: '100%',
    height: 40,
    padding: 10,
    marginBottom: 10
  },
  autocompleteContainer: {
    width: '100%',
    color: colors.white,
    marginBottom: 20
  },
  rightButtonsContainerStyle: {
    width: 0,
    height: 0
  },
  suggestionsListContainerStyle: {
    backgroundColor: colors.primary,
    zIndex: 3,
    elevation: 3
  },
  autocompleteInput: {
    width: '100%',
    height: 40,
    borderbottomWidth: 1,
    borderBottomColor: colors.white,
    backgroundColor: 'transparent',
    color: colors.white
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    zIndex: 2,
    elevation: 2,
    position: 'relative'
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
