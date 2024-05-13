import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React from "react";
import colors from "@/styles/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateTime } from "@/lib/utils";
import { Icon } from "react-native-elements";
import formStyles from "@/styles/formStyles";
import { HERE_API_KEY } from "@env";
import MapView, { Marker } from "react-native-maps";
import mapStyle from "styles/mapStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieAnimation from "../LottieAnimation";

const AdvancedEventInfo = ({ eventInfo, currentEvent }) => {
  const [event, setEvent] = React.useState(currentEvent);
  const [loading, setLoading] = React.useState(false);

  // code for search bar results:
  const [results, setResults] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [debouncedInputValue, setDebouncedInputValue] = React.useState("");
  const [hasSelectedLocation, setHasSelectedLocation] = React.useState(false);
  const [selectedResult, setSelectedResult] = React.useState(null);
  const [markerPosition, setMarkerPosition] = React.useState(null);
  // obtener la region inicial del mapa desde async storage
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [initialRegion, setInitialRegion] = React.useState(null);
  const mapRef = React.useRef(null);
  const getInitialRegion = async () => {
    try {
      const region = await AsyncStorage.getItem("region");
      if (region) {
        setInitialRegion(JSON.parse(region));
        setMapLoaded(true);
      } else {
        // Código para obtener la ubicación del usuario
      }
    } catch (error) {
      console.error("Error loading initial region:", error);
    }
  };

  React.useEffect(() => {
    getInitialRegion();
  }, []);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  React.useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 2000);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue]);

  const [searched, setSearched] = React.useState(false);

  const handleSearch = async () => {
    if (searched) {
      // set searched to false to allow new searches
      setSearched(false);
      return;
    }
    try {
      // evita que se realicen búsquedas innecesarias
      if (!debouncedInputValue) {
        return;
      }
      const encodedAddress = encodeURIComponent(debouncedInputValue);
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodedAddress}&apiKey=${HERE_API_KEY}`
      );
      const data = await response.json();
      const addresses = data?.items?.map((item) => ({
        address: item.title,
        position: item.position,
      }));
      setResults(addresses);
    } catch (error) {
      console.error("Error de búsqueda:", error);
    }
  };

  React.useEffect(() => {
    if (debouncedInputValue) {
      handleSearch();
    }
  }, [debouncedInputValue]);

  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const [isDatePickerVisible2, setDatePickerVisibility2] =
    React.useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  const updateEvent = (key, value) => {
    setEvent((oldEvent) => ({
      ...oldEvent,
      [key]: value,
    }));
    eventInfo(key, value);
  };

  // validate startDate and endDate
  React.useEffect(() => {
    if (event.startDate && event.endDate) {
      if (event.startDate > event.endDate) {
        updateEvent("startDate", "");
        updateEvent("endDate", "");
        Alert.alert(
          "Error",
          "La fecha de inicio no puede ser mayor que la fecha fin"
        );
      }
    }
  }, [event.startDate, event.endDate]);

  // if the event is editing, format start and end date to Date objects and set the location
  React.useEffect(() => {
    if (currentEvent) {
      setLoading(true);
      setEvent((oldEvent) => ({
        ...oldEvent,
        startDate: new Date(currentEvent.startDate),
        endDate: new Date(currentEvent.endDate),
      }));
      if (currentEvent.coords) {
        setMarkerPosition(currentEvent.coords);
        setHasSelectedLocation(false);
      }
      setLoading(false);
    }
  }, []);

  const handlePressLocation = (result) => {
    setMarkerPosition(result.position);
    setResults([]);
    updateEvent("location", result);
    // stop the new call to the api when the location is selected
    setSearched(true);
    // animate map to the selected location
    mapRef.current.animateToRegion({
      latitude: result.position.lat,
      longitude: result.position.lng,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  if (loading) {
    return <LottieAnimation />;
  }

  return (
    <View style={styles.container}>
      {!event?.isRemote ? (
        <View style={styles.placesAutocomplete}>
          <Text style={styles.label}>Lugar del evento</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Buscar lugar"
              value={inputValue}
              onChangeText={handleInputChange}
              placeholderTextColor={colors.gray}
              style={[
                inputValue.length > 0
                  ? formStyles.inputAutocomplete
                  : {
                      ...formStyles.inputAutocomplete,
                      width: "100%",
                    },
              ]}
            />
            {inputValue.length > 0 ? (
              <Icon
                name="close"
                size={30}
                onPress={() => setInputValue("")}
                color={colors.text}
              />
            ) : null}
          </View>
          <View>
            {results.length > 0 && !hasSelectedLocation ? (
              results?.map((result, index) => (
                // make selectable results to put it in the text input
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setInputValue(result.address);
                    handlePressLocation(result);
                  }}
                  style={styles.resultAutocomplete}
                >
                  <Text style={styles.label}>{result.address}</Text>
                </TouchableOpacity>
              ))
            ) : selectedResult ? ( // Render selected result
              <TouchableOpacity
                onPress={() => {
                  setInputValue(selectedResult.address);
                  handlePressLocation(selectedResult);
                }}
                style={styles.resultAutocomplete}
              >
                <Text style={styles.label}>{selectedResult.address}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}
      {/* poner un mapa para poner un marcador cuando se seleccione la direccion del evento */}
      {!event?.isRemote ? (
        <View style={styles.mapContainer}>
          {mapLoaded && (
            <MapView
              ref={mapRef}
              provider="google"
              clusterColor={colors.primary}
              customMapStyle={mapStyle}
              showsUserLocation
              style={styles.map}
              mapType="standard"
              initialRegion={initialRegion}
            >
              {markerPosition && (
                <Marker
                  coordinate={{
                    latitude: markerPosition.lat,
                    longitude: markerPosition.lng,
                  }}
                  title={event.location.address}
                />
              )}
            </MapView>
          )}
        </View>
      ) : null}

      <View style={styles.datePicker}>
        <Text style={formStyles.label}>Fecha y hora de inicio del evento</Text>
        <TouchableOpacity onPress={showDatePicker} style={formStyles.input}>
          {event.startDate ? (
            <Text style={styles.label}>
              Fecha y hora del evento: {formatDateTime(event.startDate)}
            </Text>
          ) : (
            <Text style={{ color: colors.gray }}>
              Selecciona la fecha y hora del evento
            </Text>
          )}
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          locale="es_ES"
          onConfirm={(date) => {
            updateEvent("startDate", date);
            hideDatePicker();
          }}
          onCancel={hideDatePicker}
        />
      </View>
      <View style={styles.datePicker}>
        <Text style={formStyles.label}>Fecha y hora de fin del evento</Text>
        <TouchableOpacity onPress={showDatePicker2} style={formStyles.input}>
          {event.endDate ? (
            <Text style={styles.label}>
              Fecha y hora del evento: {formatDateTime(event.endDate)}
            </Text>
          ) : (
            <Text style={{ color: colors.gray }}>
              Selecciona la fecha y hora del evento
            </Text>
          )}
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible2}
          mode="datetime"
          locale="es_ES"
          minimumDate={event?.startDate ? event.startDate : new Date()}
          onConfirm={(date) => {
            updateEvent("endDate", date);
            hideDatePicker2();
          }}
          onCancel={hideDatePicker2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  googleAutocomplete: {
    width: "100%",
    height: "auto",
  },
  datePicker: {
    width: "100%",
    height: "auto",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  input: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: "100%",
  },
  label: {
    color: colors.text,
    fontSize: 16,
  },
  placesAutocomplete: {
    width: "100%",
    height: "auto",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputAutocompleteSearch: {
    backgroundColor: colors.primary,
    padding: 10,
    width: "90%",
    color: colors.text,
  },
  resultAutocomplete: {
    backgroundColor: colors.secondary,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    color: colors.accent,
  },
  mapContainer: {
    width: "100%",
    height: 200,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default AdvancedEventInfo;
