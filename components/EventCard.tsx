import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {type Event } from "../types/event.type";

const EventCard = ({ event }: { event: Event }) => {
    return (
        <View>
            <Text style={styles.text}>{event.category}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: "red",
    },
});
export default EventCard;
