import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Platform } from "react-native";

import colors from "../styles/colors";
import EventMap from "../components/EventMap";
import HeaderNavigationEvent from "../components/HeaderNavigationEvent";
import EventScroll from "../components/EventScroll";
import { createStackNavigator } from "@react-navigation/stack";
import { useQuery } from "react-query";
import getEventsData from "../api/EventsData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieAnimation from "../components/LottieAnimation";

const Stack = createStackNavigator();

export default function EventNavigation({ navigation }) {
    //   refetch every 5 minutes
    const { isLoading, isError, data } = useQuery("EVENTS", getEventsData, {
        refetchInterval: 300000,
    });

    const [selected, setSelected] = useState("new");

    const handleSelect = (value) => {
        setSelected(value);
        navigation.navigate(value === "new" ? "EventScroll" : "EventMap");
    };

    if (isLoading) {
        // remove actual storage event data
        AsyncStorage.removeItem("eventData");
        return <LottieAnimation />;
    }
    if (isError) {
        return <Text>Error events...</Text>;
    }

    return (
        <SafeAreaView>
            <View style={styles.headerContainer}>
                <HeaderNavigationEvent
                    selected={selected}
                    setSelected={handleSelect}
                />
            </View>
            <View style={styles.container}>
                <Stack.Navigator
                    initialRouteName="EventScroll"
                    screenOptions={{ headerShown: false }}
                >
                    <Stack.Screen name="EventScroll">
                        {(props) => <EventScroll {...props} data={data} />}
                    </Stack.Screen>
                    <Stack.Screen name="EventMap">
                        {(props) => <EventMap {...props} data={data} />}
                    </Stack.Screen>
                </Stack.Navigator>
            </View>
        </SafeAreaView>
    );
}
// create our styling code:
const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: colors.background,
        height: Platform.OS === "android" ? 80 : 50,
        paddingTop: Platform.OS === "android" ? 25 : 0,
    },
    container: {
        backgroundColor: colors.background,
        height: "100%",
    },
});
