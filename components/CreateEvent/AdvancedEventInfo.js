import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import colors from "styles/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate } from "lib/utils";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const AdvancedEventInfo = ({ eventInfo, currentEvent }) => {
    const [event, setEvent] = React.useState(currentEvent);

    const [isDatePickerVisible, setDatePickerVisibility] =
        React.useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        updateEvent("startDate", date);
    };

    const updateEvent = (key, value) => {
        setEvent((oldEvent) => ({
            ...oldEvent,
            [key]: value,
        }));
        eventInfo(key, value);
    };

    const formatDate = (date) => {
        // format date to 01/01/2021 12:00
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Sumar 1 porque los meses van de 0 a 11
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

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
                <TouchableOpacity onPress={showDatePicker} style={styles.input}>
                    {event.startDate ? (
                        <Text style={styles.label}>
                            Fecha y hora del evento:{" "}
                            {formatDate(event.startDate)}
                        </Text>
                    ) : (
                        <Text style={styles.label}>
                            Selecciona la fecha u hora del evento
                        </Text>
                    )}
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirm}
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
    },
});

export default AdvancedEventInfo;
