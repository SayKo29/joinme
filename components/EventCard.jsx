import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import colors from "@/styles/colors";
import { formatDate, formatDateTime, openGoogleMaps } from "@/lib/utils";
// import Swiper from "react-native-swiper";
import LottieAnimation from "./LottieAnimation";
import useEventStore from "@/store/EventStore";
import { Icon } from "react-native-elements";

const EventCard = ({ event, user, onEventPress }) => {
    if (!event || !user) {
        return null;
    }
    const handlePress = () => {
        // Llama a la función de navegación pasada como prop
        onEventPress(event, user);
    };

    const shortDescription =
        event.description.length > 23
            ? `${event.description.substring(0, 23)}...`
            : event.description;

    const { categories, isInitialized, fetchCategories } = useEventStore();

    let eventCategory = categories.find(
        (category) => category._id === event.category
    );

    // validate if image exist

    React.useEffect(() => {
        if (!isInitialized) {
            fetchCategories();
        }
    }, [isInitialized]);

    const eventOwner = user[event.user];
    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View style={styles.userRowContainer}>
                <View style={styles.userLeft}>
                    <Image
                        style={styles.userImage}
                        source={
                            eventCategory?.icon
                                ? { uri: eventCategory.icon }
                                : require("../assets/img/google.png")
                        }
                    />
                    <View style={styles.userTextContent}>
                        <Text style={styles.title}>{event.name}</Text>
                        <Text style={styles.eventDescription}>
                            {shortDescription}
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
                {/* <Swiper
                    activeDotStyle={styles.activeDotStyle}
                    loadMinimalLoader={<LottieAnimation />}
                >
                    {event.images.map((image, index) => (
                        <View key={index} style={styles.slide}>
                            <Image
                                style={styles.eventImage}
                                resizeMode="cover"
                                source={{
                                    uri:
                                        image ||
                                        "https://s3joinme.s3.eu-north-1.amazonaws.com/eventImages/image-placeholder.jpg",
                                }}
                            />
                        </View>
                    ))}
                </Swiper> */}
            </View>
            <View style={styles.eventInfoContainer}>
                {/* event category */}
                <View style={styles.eventInfoRow}>
                    <Text style={styles.categoryText}>
                        {eventCategory?.name}
                    </Text>
                </View>
                {/* event startDate and endDate */}
                <View style={styles.eventInfoRow}>
                    <Text style={styles.text}>
                        {/* format string to date */}
                        Del {formatDateTime(new Date(event.startDate))} al{" "}
                        {formatDateTime(new Date(event.endDate))}
                    </Text>
                </View>
                {/* event location */}
                <TouchableOpacity
                    onPress={() => openGoogleMaps(event.location)}
                    style={styles.linkMaps}
                >
                    <Icon name="place" size={20} color={colors.text} />

                    <Text style={styles.linkGoogleMaps}>{event.location}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 10,
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
        fontSize: 12,
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
    eventInfoContainer: {
        marginTop: 10,
    },
    eventInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
    },
    linkMaps: {
        flexDirection: "row",
        width: "100%",
        height: 40,
    },
    linkGoogleMaps: {
        paddingLeft: 5,
        color: colors.text,
        textDecorationLine: "underline",
        fontSize: 12,
        fontWeight: "bold",
    },
    categoryText: {
        color: colors.accent,
        fontSize: 14,
        fontWeight: "bold",
    },
});
export default EventCard;
