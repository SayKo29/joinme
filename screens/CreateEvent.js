import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import SelectCategory from "@/components/CreateEvent/SelectCategory";
import colors from "@/styles/colors";
import EventInfo from "components/CreateEvent/EventInfo";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import AdvancedEventInfo from "components/CreateEvent/AdvancedEventInfo";
import CreateEventPost from "api/CreateEventPost";
import { useAuth } from "contexts/Auth";
import { useQuery } from "react-query";
import getEventsData from "api/EventsData";
import LottieAnimation from "components/LottieAnimation";
getEventsData;

const CreateEvent = ({ navigation }) => {
    const eventsQuery = useQuery({
        queryKey: ["EVENTS"],
        queryFn: getEventsData,
        refetchInterval: 300000,
    });

    const [category, setCategory] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState(Boolean);
    const [event, setEvent] = React.useState({
        name: "",
        description: "",
        category: "",
        location: "",
        images: {},
        user: "",
        startDate: "",
        endDate: "",
        participants: [],
        chatroom: "",
    });

    const auth = useAuth();
    const user = auth?.authData?.user;

    // updateEvent changes the event state with the key and value passed
    const updateEvent = (key, value) => {
        setEvent((oldEvent) => ({
            ...oldEvent,
            [key]: value,
        }));
    };

    const handleEventCreation = async () => {
        setLoading(true);
        let eventToSend = {
            ...event,
            category: category,
            startDate: new Date(event.startDate).toISOString(),
            endDate: new Date(event.endDate).toISOString(),
            user: user.id,
        };
        const response = await CreateEventPost(eventToSend);
        if (response.status === 200) {
            // invalidate EVENTS query to refetch data
            eventsQuery.refetch();
            navigation.navigate("Event", { event: response.data });
            setLoading(false);
        } else {
            setLoading(false);
            setErrors(true);
        }
    };

    if (loading) {
        return <LottieAnimation />;
    }

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
                        onSubmit={handleEventCreation}
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
        width: "100%",
        height: "100%",
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
