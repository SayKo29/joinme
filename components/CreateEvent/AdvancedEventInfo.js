import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React from "react";
import colors from "styles/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateTime } from "lib/utils";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const AdvancedEventInfo = ({ eventInfo, currentEvent }) => {
    const [event, setEvent] = React.useState(currentEvent);

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
            {/* <View style={styles.googleAutocomplete}>
                <GooglePlacesAutocomplete
                    placeholder="Search"
                    fetchDetails
                    onPress={(data, details = null) => {
                        if (details) {
                            const loc = {
                                latitude: details.geometry.location.lat,
                                longitude: details.geometry.location.lng,
                            };
                            setSelectedLocation(loc);
                        }
                    }}
                    query={{
                        key: "AIzaSyCXI6UDD5VVeeDwYwCFY5SKyTCQjbt3OIY",
                        language: "es",
                        components: "country:es",
                    }}
                />
            </View> */}
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
});

export default AdvancedEventInfo;
