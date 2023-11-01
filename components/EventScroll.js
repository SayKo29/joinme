import { View, Text, StyleSheet } from "react-native";
import React from "react";
import colors from "../styles/colors";
import EventCard from "./EventCard";

const EventScroll = ({ data }) => {
    return (
        <View style={styles.container}>
            {data.map((event) => (
                <EventCard key={event._id} event={event} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
});

export default EventScroll;
