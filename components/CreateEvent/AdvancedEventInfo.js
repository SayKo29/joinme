import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
    Button,
} from "react-native";
import React from "react";
import colors from "styles/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateTime } from "lib/utils";

const AdvancedEventInfo = ({ eventInfo, currentEvent }) => {
    const [event, setEvent] = React.useState(currentEvent);

    // code for search bar results:
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState([]);
    const [inputValue, setInputValue] = React.useState("");
    const [debouncedInputValue, setDebouncedInputValue] = React.useState("");

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
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${debouncedInputValue}`
                );
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error("Error de búsqueda:", error);
            }
        };

        if (debouncedInputValue) {
            handleSearch();
        }
    }, [debouncedInputValue]);

    const [isDatePickerVisible, setDatePickerVisibility] =
        React.useState(false);

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

    return (
        <View style={styles.container}>
            <View style={styles.placesAutocomplete}>
                <Text style={styles.label}>Lugar del evento</Text>
                <TextInput
                    placeholder="Buscar lugar"
                    value={inputValue}
                    onChangeText={handleInputChange}
                    style={styles.inputAutocomplete}
                />
                <View>
                    {results.map((result) => (
                        // make selectable results to put it in the text input
                        <TouchableOpacity
                            key={result.place_id}
                            onPress={() => {
                                setInputValue(result.display_name);
                                updateEvent("latitude", result.lat);
                                updateEvent("longitude", result.lon);
                            }}
                        >
                            <Text style={styles.label}>
                                {result.display_name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={styles.datePicker}>
                <Text style={styles.label}>
                    Fecha y hora de inicio del evento
                </Text>
                <TouchableOpacity onPress={showDatePicker} style={styles.input}>
                    {event.startDate ? (
                        <Text style={styles.label}>
                            Fecha y hora del evento:{" "}
                            {formatDateTime(event.startDate)}
                        </Text>
                    ) : (
                        <Text style={styles.label}>
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
                <Text style={styles.label}>Fecha y hora de fin del evento</Text>
                <TouchableOpacity
                    onPress={showDatePicker2}
                    style={styles.input}
                >
                    {event.endDate ? (
                        <Text style={styles.label}>
                            Fecha y hora del evento:{" "}
                            {formatDateTime(event.endDate)}
                        </Text>
                    ) : (
                        <Text style={styles.label}>
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
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text,
    },
    input: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 20,
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
    inputAutocomplete: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        width: "100%",
        color: colors.text,
    },
});

export default AdvancedEventInfo;
