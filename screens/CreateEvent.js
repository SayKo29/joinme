import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Stepper from "react-native-stepper-ui";
import SelectCategory from "@/components/CreateEvent/SelectCategory";
import colors from "@/styles/colors";
import EventInfo from "components/CreateEvent/EventInfo";

const CreateEvent = ({ navigation }) => {
    const stepperRef = React.useRef(null);
    const [active, setActive] = React.useState(0);
    const [category, setCategory] = React.useState("");
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

    const handleEventInfo = (eventInfo) => {
        let newEvent = { ...event };
        newEvent = { ...newEvent, ...eventInfo };
        setEvent(newEvent);
    };

    // when select category change active to 1
    React.useEffect(() => {
        if (category !== "") {
            setActive(1);
        }
    }, [category]);

    const content = [
        <SelectCategory
            navigation={navigation}
            categorySelected={setCategory}
        />,
        <EventInfo eventInfo={handleEventInfo} />,
    ];
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Crear evento</Text>
            </View>
            <Stepper
                ref={stepperRef}
                active={active}
                content={content}
                onBack={() => setActive((p) => p - 1)}
                onFinish={() => alert("Finish")}
                onNext={() => setActive((p) => p + 1)}
                nextBtnLabel="Siguiente"
                buttonTextStyle={{ color: colors.white }}
                wrapperStyle={styles.wrapperStyle}
                buttonStyle={{ backgroundColor: colors.primary }}
                stepStyle={{ backgroundColor: colors.accent }}
                stepTextStyle={{ color: colors.white }}
                showButton={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        marginHorizontal: 20,
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
    wrapperStyle: {
        backgroundColor: colors.background,
        flex: 1,
    },
});

export default CreateEvent;
