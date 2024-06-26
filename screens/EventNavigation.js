import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Platform } from "react-native";

import colors from "@/styles/colors";
// import EventMap from "@/components/EventMap";
import HeaderNavigationEvent from "@/components/HeaderNavigationEvent";
import EventScroll from "@/components/EventScroll";
import { useQuery } from "react-query";
import getEventsData from "@/api/EventsData";
import LottieAnimation from "@/components/LottieAnimation";
import getUsersData from "@/api/UsersData";
import MyEvents from "@/components/MyEvents";

const MemoizedEventScroll = React.memo(EventScroll);
const MemoizedMyEvents = React.memo(MyEvents);

export default function EventNavigation({ navigation }) {
    //   refetch every 5 minutes

    const eventsQuery = useQuery({
        queryKey: ["EVENTS"],
        queryFn: getEventsData,
        refetchInterval: 300000,
    });

    const usersQuery = useQuery({
        queryKey: ["USERS"],
        queryFn: getUsersData,
        refetchInterval: 300000,
    });

    const [selected, setSelected] = useState("new");

    const handleSelect = (value) => {
        setSelected(value);
        // navigation.navigate(value === "new" ? "EventScroll" : "EventMap");
    };

    if (eventsQuery.isLoading) {
        return <LottieAnimation />;
    }
    if (eventsQuery.isError) {
        return <Text>Error events...</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <HeaderNavigationEvent
                    selected={selected}
                    setSelected={handleSelect}
                />
            </View>
            <View style={styles.container}>
                {selected === "new" ? (
                    <MemoizedEventScroll
                        navigation={navigation}
                        data={eventsQuery}
                        users={usersQuery}
                    />
                ) : (
                    <MemoizedMyEvents
                        navigation={navigation}
                        data={eventsQuery}
                        users={usersQuery}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

// create our styling code:
const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: colors.background,
        height: Platform.OS === "android" ? 70 : 50,
        paddingTop: Platform.OS === "android" ? 25 : 0,
    },
    container: {
        backgroundColor: colors.background,
        height: "100%",
        flex: 1,
    },
});
