import { View, StyleSheet, Text } from "react-native";
import Gallery from "react-native-image-gallery";
import React, { useState } from "react";
import colors from "@/styles/colors";
import getUsersData from "../api/UsersData";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuth } from "../contexts/Auth";
import JoinEvent from "../api/EventJoinParticipant";

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
    if (users.data) {
        // console.log(users.data)

        const eventCreator = users.data[markerPressed?.user];
        // console.log(eventCreator)

        return (
            <View style={styles.cardContainer}>
                {/* /* show gallery images if have it* */}
                {markerPressed.images.length > 0 && (
                    <View style={styles.galleryContainer}>
                        <Gallery
                            style={{ flex: 1, backgroundColor: "#fff" }}
                            images={[
                                // map images to gallery
                                ...markerPressed.images.map((image) => {
                                    return {
                                        source: {
                                            uri: image,
                                        },
                                    };
                                }),
                            ]}
                        />
                    </View>
                )}

                <Text style={styles.title}>{markerPressed.name}</Text>
                <Text style={styles.description}>
                    {markerPressed.description}
                </Text>
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
    return (
        <View style={styles.cardContainer}>
            {/* /* show gallery images if have it* */}
            {markerPressed.images.length > 0 && (
                <View style={styles.galleryContainer}>
                    <Gallery
                        style={{ flex: 1, backgroundColor: "black" }}
                        images={[
                            // map images to gallery
                            ...markerPressed.images.map((image) => {
                                return {
                                    source: {
                                        uri: image,
                                    },
                                };
                            }),
                        ]}
                    />
                </View>
            )}

            <Text style={styles.title}>{markerPressed.name}</Text>
            <Text style={styles.description}>{markerPressed.description}</Text>
            {/* <Text style={styles.description}>Evento creado por {users.data[props.markerPressed.user]}</Text> */}
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
});
