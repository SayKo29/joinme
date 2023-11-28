import { View, StyleSheet, Text, Image } from "react-native";
import React, { useState } from "react";
import colors from "@/styles/colors";
import getUsersData from "@/api/UsersData";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuth } from "@/contexts/Auth";
import JoinEvent from "@/api/EventJoinParticipant";
import Swiper from "react-native-swiper";

export default function EventDetail({ markerPressed, navigation }) {
    const queryClient = useQueryClient();
    const auth = useAuth();
    const { mutate } = useMutation(JoinEvent);
    const [loading, setLoading] = useState(false);

    const handleJoinEvent = () => {
        const event = {
            id: markerPressed._id,
            participants: [
                ...(markerPressed.participants
                    ? markerPressed.participants
                    : []),
                auth.authData.user.id,
            ],
        };
        setLoading(true);
        mutate(event, {
            onSuccess: () => {
                // uncached query
                setLoading(false);
                queryClient.invalidateQueries("CHATROOMS");
                navigation.navigate("Chat");
            },
        });
    };

    const users = useQuery("USERS", getUsersData);

    if (users.isLoading) {
        return <Text>Loading users...</Text>;
    }
    if (users.isError) {
        return <Text>Error users...</Text>;
    }
    const eventCreator = users.data[markerPressed?.user];
    return (
        <View style={styles.cardContainer}>
            {/* /* show gallery images if have it* */}
            {markerPressed.images.length > 0 && (
                <View style={styles.galleryContainer}>
                    <Swiper
                        style={styles.wrapper}
                        activeDotStyle={styles.activeDotStyle}
                    >
                        {markerPressed.images.map((image, index) => {
                            return (
                                <View style={styles.slide1} key={index}>
                                    <Image
                                        source={{ uri: image }}
                                        style={styles.image}
                                    />
                                </View>
                            );
                        })}
                    </Swiper>
                </View>
            )}

            <Text style={styles.title}>{markerPressed.name}</Text>
            <Text style={styles.description}>{markerPressed.description}</Text>
            {/* if eventCreator has name */}
            {eventCreator && (
                <Text style={styles.description}>
                    Evento creado por {eventCreator?.name}
                </Text>
            )}

            {/* button to join chat event if u are not creator of the event && you are not a participant of the event */}
            {auth.authData.user.id !== markerPressed.user &&
                !markerPressed.participants?.includes(
                    auth.authData.user.id
                ) && (
                    <TouchableOpacity
                        style={styles.button}
                        disabled={loading}
                        onPress={handleJoinEvent}
                    >
                        <Text style={styles.buttonText}>
                            Unirse al chat del evento
                        </Text>
                    </TouchableOpacity>
                )}
        </View>
    );
}

// create our styling code:
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.background,
        padding: 10,
        borderRadius: 10,
        width: "100%",
        height: "100%",
    },
    galleryContainer: {
        width: "100%",
        height: 200,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: colors.white,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        color: colors.white,
    },

    button: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 10,
    },

    buttonText: {
        color: colors.white,
        fontWeight: "bold",
        textAlign: "center",
    },

    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },

    activeDotStyle: {
        backgroundColor: colors.accent,
    },
});
