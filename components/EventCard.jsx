import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import colors from "@/styles/colors";
import { formatDate } from "../lib/utils";
import Swiper from "react-native-swiper";
import LottieAnimation from "./LottieAnimation";

const EventCard = ({ event, user, onEventPress }) => {
    if (!event || !user) {
        return null;
    }
    const handlePress = () => {
        // Llama a la función de navegación pasada como prop
        onEventPress(event, user);
    };

    let smallDescription = event?.description.substring(0, 23) + "...";

    const eventOwner = user[event.user];
    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View style={styles.userRowContainer}>
                <View style={styles.userLeft}>
                    <Image
                        style={styles.userImage}
                        source={
                            eventOwner && eventOwner.avatar != null
                                ? { uri: eventOwner.avatar }
                                : require("@/assets/avatar.png")
                        }
                    />
                    <View style={styles.userTextContent}>
                        <Text style={styles.title}>{event.name}</Text>
                        <Text style={styles.eventDescription}>
                            {smallDescription}
                        </Text>
                    </View>
                </View>
                <View style={styles.userTextContainer}>
                    <Text style={styles.text}>
                        {formatDate(event.createdAt)}
                    </Text>
                </View>
            </View>
            <View style={styles.eventImageContainer}>
                <Swiper
                    activeDotStyle={styles.activeDotStyle}
                    loadMinimalLoader={<LottieAnimation />}
                >
                    {event.images.map((image, index) => (
                        <View key={index} style={styles.slide}>
                            <Image
                                style={styles.eventImage}
                                resizeMode="cover"
                                source={{
                                    uri: image,
                                }}
                            />
                        </View>
                    ))}
                </Swiper>
            </View>
        </TouchableOpacity>
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
        width: "auto",
    },
    userLeft: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "70%",
    },
    userTextContent: {
        flexDirection: "column",
        justifyContent: "center",
        marginHorizontal: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.accent,
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
        flex: 1,
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    slide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: 10,
    },
    activeDotStyle: {
        backgroundColor: colors.accent,
    },
    eventDescription: {
        width: "100%",
        fontSize: 16,
        color: colors.gray,
    },
});
export default EventCard;
