import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import SelectCategory from "@/components/CreateEvent/SelectCategory";
import colors from "@/styles/colors";
import EventInfo from "components/CreateEvent/EventInfo";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import AdvancedEventInfo from "components/CreateEvent/AdvancedEventInfo";
import CreateEventPost from "api/CreateEventPost";

const CreateEvent = ({ navigation }) => {
    const [category, setCategory] = React.useState("");
    const [errors, setErrors] = React.useState(Boolean);
    const [event, setEvent] = React.useState({
        name: "",
        description: "",
        category: "",
        latitude: "",
        longitude: "",
        images: [],
        user: "",
        startDate: "",
        endDate: "",
        participants: [],
        chatroom: "",
    });
    const handleEvent = (event) => {
        let newEvent = { ...event };
        newEvent.category = category;
        setEvent(newEvent);
    };

    // updateEvent changes the event state with the key and value passed
    const updateEvent = (key, value) => {
        setEvent((oldEvent) => ({
            ...oldEvent,
            [key]: value,
        }));
    };

    const handleEventCreation = () => {
        return async () => {
            console.log(event, "event");
            const response = await CreateEventPost(event);
            console.log(response, "response");
            // if (response.status) {
            //     navigation.navigate("Event", { id: response.event._id });
            // } else {
            //     setErrors(true);
            // }
        };
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Crear evento</Text>
            </View>
            <View style={styles.stepWrapper}>
                <ProgressSteps
                    activeStepNumColor={colors.text}
                    completedProgressBarColor={colors.primary}
                    activeLabelColor={colors.text}
                    completedStepIconColor={colors.primary}
                    completedCheckColor={colors.primary}
                    activeStepIconBorderColor={colors.primary}
                    activeStepIconColor={colors.primary}
                    disabledStepIconColor={colors.disabled}
                    disabledStepNumColor={colors.gray}
                    disabled
                    progressBarColor={colors.disabled}
                >
                    <ProgressStep
                        label="Categoría del evento"
                        nextBtnStyle={styles.nextBtnStyle}
                        nextBtnTextStyle={styles.nextBtnTextStyle}
                        nextBtnText="Siguiente"
                        nextBtnDisabled={category === ""}
                    >
                        <SelectCategory
                            categorySelected={setCategory}
                            activeCategory={category}
                        />
                    </ProgressStep>
                    <ProgressStep
                        label="Información básica"
                        nextBtnStyle={styles.nextBtnStyle}
                        nextBtnTextStyle={styles.nextBtnTextStyle}
                        nextBtnText="Siguiente"
                        previousBtnStyle={styles.previousBtnStyle}
                        previousBtnTextStyle={styles.previousBtnTextStyle}
                        previousBtnText="Atrás"
                    >
                        <EventInfo
                            eventInfo={updateEvent}
                            currentEvent={event}
                        />
                    </ProgressStep>
                    <ProgressStep
                        label="Información avanzada"
                        nextBtnStyle={styles.nextBtnStyle}
                        nextBtnTextStyle={styles.nextBtnTextStyle}
                        previousBtnStyle={styles.previousBtnStyle}
                        previousBtnTextStyle={styles.previousBtnTextStyle}
                        previousBtnText="Atrás"
                        finishBtnText="Crear evento"
                        onSubmit={handleEventCreation()}
                    >
                        <AdvancedEventInfo
                            eventInfo={updateEvent}
                            currentEvent={event}
                        />
                    </ProgressStep>
                </ProgressSteps>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    titleContainer: {
        alignItems: "center",
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.white,
    },
    stepWrapper: {
        flex: 1,
        paddingHorizontal: 20,
    },
    nextBtnStyle: {
        backgroundColor: colors.accent,
        borderRadius: 4,
        paddingHorizontal: 20,
    },
    nextBtnTextStyle: {
        color: colors.white,
    },
    previousBtnStyle: {
        backgroundColor: colors.gray,
        borderRadius: 4,
        paddingHorizontal: 20,
    },
    previousBtnTextStyle: {
        color: colors.white,
    },
});

export default CreateEvent;
