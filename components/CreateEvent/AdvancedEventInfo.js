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
formStyles;

const AdvancedEventInfo = ({ eventInfo, currentEvent }) => {
  const [event, setEvent] = React.useState(currentEvent);

  // code for search bar results:
  const [results, setResults] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [debouncedInputValue, setDebouncedInputValue] = React.useState("");
  const [hasSelectedLocation, setHasSelectedLocation] = React.useState(false);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  React.useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 500);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue]);

  React.useEffect(() => {
    const handleSearch = async () => {
      try {
        const encodedAddress = encodeURIComponent(debouncedInputValue);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`
        );
        const data = await response.json();
        // si no hay resultados, añadir un resultado con el texto de búsqueda
        setResults(data);
        if (data.length === 0) {
          setResults([
            {
              display_name: debouncedInputValue,
              place_id: debouncedInputValue,
            },
          ]);
        }
      } catch (error) {
        console.error("Error de búsqueda:", error);
      }
    };

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

  // if has selected location and is changing the input value, reset the hasSelectedLocation state
  React.useEffect(() => {
    if (hasSelectedLocation && inputValue.length > 0) {
      setHasSelectedLocation(false);
    }
  }, [inputValue]);

  const handlePressLocation = (result) => {
    setInputValue(result.display_name);
    updateEvent("location", result.display_name);
    setHasSelectedLocation(true);
  };

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
            {results.length > 0 && !hasSelectedLocation
              ? results.map((result) => (
                  // make selectable results to put it in the text input
                  <TouchableOpacity
                    key={result.place_id}
                    onPress={handlePressLocation.bind(this, result)}
                    style={styles.resultAutocomplete}
                  >
                    <Text style={styles.label}>{result.display_name}</Text>
                  </TouchableOpacity>
                ))
              : null}
          </View>
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
          onConfirm={(date) => {
            updateEvent("endDate", date);
            hideDatePicker2();
          }}
          onCancel={hideDatePicker}
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
});

export default AdvancedEventInfo;
