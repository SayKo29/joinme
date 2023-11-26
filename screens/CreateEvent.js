import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Stepper from "react-native-stepper-ui";
import SelectCategory from "@/components/CreateEvent/SelectCategory";
import colors from "@/styles/colors";

const CreateEvent = ({ navigation }) => {
    const [active, setActive] = React.useState(0);
    const content = [
        <SelectCategory navigation={navigation} />,
        <SelectCategory navigation={navigation} />,
        <SelectCategory navigation={navigation} />,
        <SelectCategory navigation={navigation} />,
    ];
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Crear evento</Text>
            </View>
            <Stepper
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
            />
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
    wrapperStyle: {
        backgroundColor: colors.background,
        flex: 1,
    },
});

export default CreateEvent;
