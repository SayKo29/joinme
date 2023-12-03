import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/Auth";
import {
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import getEventsByParticipant from "@/api/GetParticipantEvents";
import { useQuery } from "react-query";
import LottieAnimation from "@/components/LottieAnimation";
import Chat from "@/components/messageChat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "@/styles/colors";
// import .env socketUrl variable

const ChatRooms = ({ navigation }) => {
    // show chat rooms
    //   const [chatRooms, setChatRooms] = useState([])
    const auth = useAuth();
    const { isLoading, isError, data } = useQuery("CHATROOMS", () =>
        getEventsByParticipant(auth.authData.user.id)
    );
    const [chatroomId, setChatroomId] = useState(null);
    const [events, setEvents] = useState([]);

    const handleBack = () => {
        setChatroomId(null);
    };

    if (isLoading) {
        return <LottieAnimation />;
    }
    if (isError) {
        return <Text>Error</Text>;
    }

    if (data.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={styles.content}
                    onPress={() => navigation.navigate("Eventos")}
                >
                    <View style={styles.title}>
                        <Text style={styles.text}>
                            No hay chats disponibles, para crear uno,
                        </Text>
                        <Text style={styles.btn}>únete a un evento</Text>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (data) {
        return (
            <SafeAreaView style={styles.container}>
                {/* show if not chatroom id */}
                {!chatroomId && (
                    // flatlist of events
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => {
                            return (
                                // if chatroom end date is passed disable chatroom
                                <TouchableOpacity
                                    disabled={
                                        new Date(item.endDate) < new Date()
                                    }
                                    style={[
                                        styles.card,
                                        {
                                            backgroundColor:
                                                new Date(item.endDate) <
                                                new Date()
                                                    ? colors.gray
                                                    : colors.accent,
                                        },
                                    ]}
                                    onPress={() => setChatroomId(item.chatroom)}
                                >
                                    {/* if chatroom has image show it at left */}
                                    {item.images.length > 0 && (
                                        <Image
                                            style={styles.image}
                                            source={{ uri: item.images[0] }}
                                        />
                                    )}
                                    {/* show default image for event if doesnt have */}
                                    {item.images.length === 0 && (
                                        <Image
                                            style={styles.image}
                                            source={require("../assets/img/logo.png")}
                                        />
                                    )}
                                    <View style={styles.cardContent}>
                                        <Text
                                            key={item.id}
                                            style={styles.chatroom}
                                        >
                                            {item.name}
                                        </Text>
                                        {/* número de participantes */}
                                        <Text style={styles.participants}>
                                            {item.participants.length}{" "}
                                            {item.participants.length == 1
                                                ? "participante"
                                                : "participantes"}
                                        </Text>
                                        {/* if event has ended show text */}
                                        {new Date(item.endDate) <
                                            new Date() && (
                                            <Text style={styles.participants}>
                                                Evento finalizado
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                )}
                {chatroomId && (
                    <Chat
                        chatroomId={chatroomId}
                        onBack={handleBack}
                        event={events.find(
                            (event) => event.chatroomId === chatroomId
                        )}
                    />
                )}

                {/* {chatroomId && <Chat onBack={handleBack} chatroomId={chatroomId}  />} */}
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? 25 : 0,
        backgroundColor: colors.background,
    },
    card: {
        backgroundColor: colors.primary,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10,
    },
    cardContent: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    chatroom: {
        fontSize: 18,
        color: colors.white,
    },
    participants: {
        fontSize: 14,
        color: colors.white,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        alignItems: "center",
    },
    text: {
        color: colors.white,
        fontSize: 18,
    },
    btn: {
        color: colors.accent,
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ChatRooms;
