import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import colors from "../styles/colors";
import EventCard from "./EventCard";

const EventScroll = ({ data, users }) => {
    // get all users data and pass to eventcard the user owner of the event
    const user = users.data;
    return (
        // <View style={styles.container}>
        //     {data.data.map((event) => (
        //         <EventCard key={event._id} event={event} user={user} />
        //     ))}
        // </View>

        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {data.data.map((event) => (
                <EventCard key={event._id} event={event} user={user} />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default EventScroll;
