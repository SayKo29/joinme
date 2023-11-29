import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import {type Event } from "../types/event.type";
import { type User } from "../types/user.type";
import colors from "@/styles/colors";
import { formatDate } from "../lib/utils";
import Swiper from "react-native-swiper";

type Props = {
    event: Event;
    user: User;
};

const EventCard = ({ event, user }: Props) => {
    if (!event || !user) {
        return null;
    }

    const eventOwner = user[event.user];
    return (
        <View style={styles.container}>
            <View style={styles.userRowContainer}>
                <View style={styles.userLeft}>
                <Image
                    style={styles.userImage}
                    source={{
                        uri: eventOwner.avatar
                    }} 
                />
                <View style={styles.userTextContent}>
                    <Text style={styles.title}>{eventOwner.name}</Text>
                    <Text style={styles.text}>{event.name}</Text>
                    </View>
                </View>
                <View style={styles.userTextContainer}>
                    <Text style={styles.text}>{formatDate(event.createdAt)}</Text>
                </View>
            </View>
            <View style={styles.eventImageContainer}>
                <Swiper
                showsButtons={true}
                activeDotStyle={styles.activeDotStyle}
                >
                    {event.images.map((image, index) => (
                        <View key={index} style={styles.slide}>
                            <Image
                                style={styles.eventImage}
                                source={{
                                    uri: image,
                                }}
                            />
                        </View>
                    ))}
                </Swiper>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
    },
    userRowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    userImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    userTextContainer: {
        justifyContent: "center",
        marginHorizontal: 10,
    },
    userLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    userTextContent: {
        flexDirection: "column",
        justifyContent: "center",
        marginHorizontal: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.text,
    },
    text: {
        color: colors.text,
    },
    eventImageContainer: {
        marginTop: 10,
        height: 200,
        width: "100%",
    },
    eventImage: {
        height: 200,
        width: "100%",
        borderRadius: 20,
    },
    slide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    activeDotStyle: {
        backgroundColor: colors.accent,
    },

});
export default EventCard;
