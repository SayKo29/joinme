import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/Auth";
import { io } from "socket.io-client";
import { SOCKET_URL } from "@env";
import { Icon } from "react-native-elements";
import { formatToTimeWithoutSeconds } from "@/services/functions";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import colors from "@/styles/colors";
import LottieAnimation from "@/components/LottieAnimation";
import { FlashList } from "@shopify/flash-list";
import getUserParticipants from "@/api/GetUserParticipants";
getUserParticipants;
import { useQuery } from "react-query";

const ChatScreen = ({ route, navigation }) => {
    const event = route.params.event;
    const chatroomId = route.params.event.chatroom;

    const URL = SOCKET_URL;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const auth = useAuth();
    const flatListRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const userLogged = auth.authData.user;
    const [participants, setParticipants] = useState([]);

    const participantsQuery = useQuery(
        ["PARTICIPANTS", event?.participants],
        () => getUserParticipants(event?.participants),
        {
            enabled: !!event?.participants,
        }
    );

    useEffect(() => {
        if (participantsQuery?.data) {
            setLoading(false);
            setParticipants(participantsQuery?.data);
            console.log("participants", participantsQuery?.data);
        }

        if (participantsQuery?.isLoading) {
            setLoading(true);
        }
    }, [participantsQuery?.data]);

    const socket = useRef(io(URL, { query: { userId: userLogged.id } }));

    const finishChatRoom = () => {
        navigation.goBack();
    };

    useEffect(() => {
        const socketInstance = socket.current;

        const handleConnect = () => {};

        const handleDisconnect = () => {};

        const handleAllMessages = (message) => {
            setMessages(message);
        };

        const handleNewMessage = (message) => {
            console.log("new message", message);
            console.log("messages", messages);
            setMessages((prevMessages) => [message, ...prevMessages]);
        };

        socketInstance.on("connect", handleConnect);
        socketInstance.on("disconnect", handleDisconnect);
        socketInstance.on("allMessages", handleAllMessages);
        socketInstance.on("newMessage", handleNewMessage);

        return () => {
            // Cleanup on component unmount
            socketInstance.off("connect", handleConnect);
            socketInstance.off("disconnect", handleDisconnect);
            socketInstance.off("allMessages", handleAllMessages);
            socketInstance.off("newMessage", handleNewMessage);
        };
    }, [socket]);

    useEffect(() => {
        socket.current.emit("joinRoom", { chatroomId });

        return () => {
            // Cleanup on component unmount
            socket.current.emit("leaveRoom", { chatroomId });
        };
    }, [chatroomId]);

    const sendMessage = () => {
        socket.current.emit("chatroomMessage", { chatroomId, msg: newMessage });
        setNewMessage("");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={finishChatRoom}
                >
                    <Icon name="chevron-left" size={40} color={colors.white} />
                </TouchableOpacity>
                {event?.images ? (
                    <Image
                        style={styles.iconImage}
                        source={{ uri: event.images[0] }}
                    />
                ) : (
                    <Image
                        style={styles.iconImage}
                        source={require("../assets/img/image-placeholder.jpg")}
                    />
                )}
                <Text style={styles.headerText}>{event?.name}</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboard}
                keyboardVerticalOffset={Platform.OS === "ios" ? 45 : 0}
            >
                {loading ? (
                    <LottieAnimation />
                ) : (
                    <FlashList
                        data={messages}
                        inverted
                        estimatedItemSize={40}
                        showsVerticalScrollIndicator={false}
                        ref={flatListRef}
                        keyExtractor={(item) => item?._id}
                        renderItem={({ item }) => {
                            const isUserMessage =
                                item?.user?._id === userLogged.id;

                            return (
                                <View
                                    style={[
                                        styles.message,
                                        isUserMessage
                                            ? styles.messageRight
                                            : styles.messageLeft,
                                    ]}
                                >
                                    {!isUserMessage && (
                                        <>
                                            {/* <Image
                                                style={styles.iconImage}
                                                source={{
                                                    uri: item?.user?.avatar[0],
                                                }}
                                            /> */}
                                            <Text style={styles.userName}>
                                                {item?.user?.name}
                                            </Text>
                                        </>
                                    )}
                                    <Text
                                        style={
                                            isUserMessage
                                                ? styles.messageTextRight
                                                : styles.messageTextLeft
                                        }
                                    >
                                        {item.message}
                                    </Text>
                                    <View
                                        style={
                                            isUserMessage
                                                ? styles.timeContainerRight
                                                : styles.timeContainerLeft
                                        }
                                    >
                                        <Text style={styles.timeText}>
                                            {formatToTimeWithoutSeconds(
                                                new Date(item?.createdAt)
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            );
                        }}
                    />
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe un mensaje"
                        value={newMessage}
                        onChangeText={setNewMessage}
                    />
                    <TouchableOpacity
                        style={styles.sendMessageButton}
                        disabled={!newMessage}
                        onPress={sendMessage}
                    >
                        <Icon
                            name="send"
                            type="font-awesome"
                            size={30}
                            color={colors.white}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.background,
        // paddingtop for android
    },
    header: {
        paddingTop: Platform.OS === "android" ? 25 : 0,
        width: "100%",
        height: 80,
        backgroundColor: colors.accent,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    headerText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: "bold",
    },

    message: {
        borderRadius: 5,
        margin: 0,
        maxWidth: "100%",
    },
    messageTextRight: {
        color: colors.white,
        textAlign: "justify",
    },
    inputContainer: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 10,
        paddingRight: 20,
    },
    input: {
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 5,
        width: "80%",
        height: 50,
    },
    messageRight: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 8,
        borderTopRightRadius: 0,
        margin: 10,
        maxWidth: "80%",
        alignSelf: "flex-end",
    },
    messageLeft: {
        backgroundColor: colors.persianGreen,
        padding: 10,
        borderRadius: 5,
        borderTopLeftRadius: 0,
        margin: 10,
        maxWidth: "80%",
        alignSelf: "flex-start",
    },
    messageTextLeft: {
        color: colors.white,
        textAlign: "left",
    },
    keyboard: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    userName: {
        color: colors.white,
        textAlign: "left",
        fontWeight: "bold",
    },
    timeContainerLeft: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingTop: 5,
    },
    timeText: {
        color: colors.white,
        textAlign: "right",
        fontSize: 10,
    },
    sendMessageButton: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    sendMessageText: {
        color: colors.white,
        fontSize: 12,
    },
    timeContainerRight: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    messageTime: {
        color: colors.white,
        textAlign: "left",
        fontSize: 10,
        paddingTop: 5,
    },
    iconImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
});

export default ChatScreen;
