import { StyleSheet, FlatList, Text, View } from "react-native";
import React from "react";
import colors from "@/styles/colors";
import EventCard from "./EventCard";

const EventScroll = ({ data, users }) => {
    const user = users.data;

    if (data.isLoading) {
        return <LottieAnimation />;
    }
    console.log(data);
    if (data.data.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.noEvents}>No hay eventos disponibles</Text>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.container}
            data={data.data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <EventCard event={item} user={user} />}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        width: "100%",
        height: "100%",
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noEvents: {
        color: colors.text,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default EventScroll;
