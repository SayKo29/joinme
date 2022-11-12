import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, TextInput, StyleSheet, Appearance, Platform, StatusBar, Dimensions, ScrollView, Button } from 'react-native'
import getCategories from '../api/CategoryData'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CreateEventPost from '../api/CreateEventPost'
import colors from '../styles/colors'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'
import mapStyle from '../styles/mapStyle'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '../contexts/Auth'
import DateTimePicker from '@react-native-community/datetimepicker'
import { formatDate } from '../services/functions'

const CreateEvent = ({ navigation }) => {
  // API
  const categories = useQuery('CATEGORIES', getCategories)
  const dataSet = []
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState({})
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [description, setDescription] = useState('')
  const { mutate } = useMutation(CreateEventPost)
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [suggestionsList, setSuggestionsList] = useState(null)
  const dropdownController = useRef(null)

  const searchRef = useRef(null)

  const onClearPress = useCallback(() => {
    setSuggestionsList(null)
  }, [])

  const onOpenSuggestionsList = useCallback(isOpened => {}, [])

  //   get current location
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  //   const [markerPressed, setMarkerPressed] = useState(false)

  //   datetime picker

  const auth = useAuth()

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
  }, [selectedLocation])

  const handleCreateEvent = async () => {
    const event = {
      name,
      description,
      category: selectedCategory.id,
      longitude: selectedLocation?.longitude,
      latitude: selectedLocation?.latitude,
      user: auth.authData?.user?.id,
      startDate,
      endDate
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
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate
    setShow(false)
    setStartDate(currentDate)
  }
  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate
    setShow(false)
    setEndDate(currentDate)
  }

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(true)
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode)
  }

  const showDatepicker = () => {
    showMode('date')
  }

  const showTimepicker = () => {
    showMode('time')
  }

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps='handled'
        style={styles.container} contentContainerStyle={
        {
          alignItems: 'center',
          padding: 20
        }

    }
      >
        <LinearGradient
          colors={[colors.backgroundOrange, colors.purple]}
          style={styles.background}
          locations={[0.1, 0.8]}
        />
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
        <Text style={styles.label}>Categoría del evento</Text>
        <View
          keyboardShouldPersistTaps='always'
          style={[
            { flex: 1, flexDirection: 'row', marginBottom: 20, alignItems: 'flex-start', maxHeight: 80 },
            Platform.select({ ios: { zIndex: 1 } })
          ]}
        >
          <AutocompleteDropdown
            ref={searchRef}
            controller={controller => {
              dropdownController.current = controller
            }}
            direction={Platform.select({ ios: 'down' })}
            dataSet={dataSet}
            onSelectItem={setSelectedCategory}
            debounce={600}
            suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
            onClear={onClearPress}
            onOpenSuggestionsList={onOpenSuggestionsList}
            loading={loading}
            useFilter={false} // set false to prevent rerender twice
            textInputProps={{
              placeholder: 'Selecciona una categoría',
              placeholderTextColor: colors.gray,
              autoCorrect: false,
              autoCapitalize: 'none',
              style: {
                borderBottomWidth: 1,
                backgroundColor: 'transparent',
                color: '#fff',
                borderBottomColor: '#fff',
                paddingLeft: 0,
                fontSize: 12
              }
            }}
            inputContainerStyle={{
              backgroundColor: 'transparent'
            }}
            suggestionsListContainerStyle={{
              backgroundColor: colors.primary
            }}
            containerStyle={{ flexGrow: 1, flexShrink: 1 }}
            renderItem={(item, text) => <Text style={{ color: '#fff', padding: 12 }}>{item.title}</Text>}
            inputHeight={50}
            showChevron={false}
            closeOnBlur={false}
          />
        </View>
        <Text style={styles.label}>Fecha de inicio</Text>
        <View>
          <Button onPress={showDatepicker} title='Seleccione la fecha' />
          <Button onPress={showTimepicker} title='Seleccione la hora' />
          <Text style={styles.label}>{formatDate(startDate)}</Text>
          {show && (
            <DateTimePicker
              testID='dateTimePicker'
              value={startDate}
              mode={mode}
              minimumDate={new Date()}
              is24Hour
              onChange={onChangeStartDate}
            />
          )}
        </View>
        <Text style={styles.label}>Fecha de finalización</Text>
        <View>
          <Button onPress={showDatepicker} title='Show date picker!' />
          <Button onPress={showTimepicker} title='Show time picker!' />
          {/* show end date in DD-MM-YYYY HH:MM:SS FORMAT */}
          <Text style={styles.label}>{formatDate(endDate)}</Text>

          {/* <Text style={styles.label}>{}</Text> */}
          {show && (
            <DateTimePicker
              testID='dateTimePicker'
              value={endDate}
              minimumDate={startDate || new Date()}
              mode={mode}
              is24Hour
              onChange={onChangeEndDate}
            />
          )}
        </View>

        <Text style={styles.label}>Localización del evento</Text>
        <Text style={styles.description}>Selecciona en el mapa el lugar del evento o introduce la dirección a continuación</Text>
        <View style={{
          width: '100%',
          height: 'auto',
          paddingTop: 10,
          elevation: 5,
          zIndex: 5

        }}
        >
          <GooglePlacesAutocomplete
            placeholder='Search'
            fetchDetails
            onPress={(data, details = null) => {
              if (details) {
                const loc = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng
                }
                setSelectedLocation(loc)
              }
            }}
            query={{
              key: 'AIzaSyCXI6UDD5VVeeDwYwCFY5SKyTCQjbt3OIY',
              language: 'es',
              components: 'country:es'
            }}
          />
        </View>

        {/* click on map to get location */}
        {/* render map if user location */}
        {/* when user press show a marker */}
        {/* show loader when loading location */}

        {!location
          ? (
            <Text style={styles.loading}>Loading...</Text>
            )
          : (
            <MapView
              style={styles.map} onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
              customMapStyle={Appearance.getColorScheme() === 'dark' ? mapStyle : null}
              provider='google'
              initialRegion={{
              // user location
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                // zoom
                latitudeDelta: 0.6,
                longitudeDelta: 0.6

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

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCreateEvent}
        >
          <Text style={styles.submitText}>
            Crear evento
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 900
  },
  container: {
    flex: 1
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
    color: colors.white,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
    height: 40
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    color: colors.white,
    height: 20
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    width: '100%',
    height: 40,
    fontSize: 12,
    marginBottom: 10,
    color: colors.white
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
    height: 250,
    marginBottom: 20,
    zIndex: 2,
    elevation: 2
  },
  loading: {
    height: 250
  },
  submitButton: {
    backgroundColor: colors.primary,
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
  },
  submitText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  description: {
    paddingTop: 10,
    width: '100%',
    color: colors.white,
    fontSize: 12,
    marginBottom: 10
  }
})

export default CreateEvent
