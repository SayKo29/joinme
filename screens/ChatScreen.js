import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/Auth'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '@env'
import { Icon } from 'react-native-elements'
import { formatToTimeWithoutSeconds } from '@/services/functions'
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import colors from '@/styles/colors'
import LottieAnimation from '@/components/LottieAnimation'
import { FlashList } from '@shopify/flash-list'
import getUserParticipants from '@/api/GetUserParticipants'
import { useQuery } from 'react-query'
getUserParticipants


const ChatScreen = ({ route, navigation }) => {
    const event = route.params.event
    const chatroomId = route.params.event.chatroom

    const URL = SOCKET_URL
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const auth = useAuth()
    const flatListRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const userLogged = auth.authData.user
    const [participants, setParticipants] = useState([])
    const [error, setError] = useState(null)
    const [messageQueue, setMessageQueue] = useState([])

    const participantsQuery = useQuery(
        ['PARTICIPANTS', event?.participants],
        () => getUserParticipants(event?._id),
        {
            enabled: !!event?.participants
        }
    )

    useEffect(() => {
        if (participantsQuery?.data) {
            setLoading(false)
            setParticipants(participantsQuery?.data)
        }

        if (participantsQuery?.isLoading) {
            setLoading(true)
        }
    }, [participantsQuery?.data])

    const socket = useRef(null)

    const finishChatRoom = () => {
        handleDisconnect()
        navigation.goBack()
    }

    const handleConnect = () => {
        // primera conexión
        console.log('primera conexión')
        // Pedir al socket todos los mensajes de la sala
        socket.current.emit('getAllMessages', chatroomId)
        // Unirse a la sala
        socket.current.emit('joinRoom', chatroomId)
        // Enviar mensajes en la cola al conectarse
        sendQueuedMessages()
    }

    const handleDisconnect = () => {
        console.log('disconnected')
        socket.current.emit('leaveRoom', chatroomId)
        socket.current.disconnect()
    }

    const handleAllMessages = async (message) => {
        console.log('recibo mensajes')
        setMessages(message)
    }

    const handleNewMessage = (message) => {
        console.log('recibo nuevo mensaje', userLogged)
        setMessages((prevMessages) => [message, ...prevMessages])
    }

    const handleChatroomMessageError = (error) => { }

    const sendQueuedMessages = () => {
        // Enviar mensajes en la cola
        messageQueue.forEach((queuedMessage) => {
            socket.current.emit('chatroomMessage', {
                chatroom: chatroomId,
                message: queuedMessage,
                user: userLogged
            })
        })

        // Limpiar la cola después de enviar los mensajes
        setMessageQueue([])
    }

    useEffect(() => {
        socket.current = io(URL, {
            transports: ['websocket'],
            query: { userId: userLogged.id }
        })

        const socketInstance = socket.current

        socketInstance.on('connect', handleConnect)
        socketInstance.on('disconnect', handleDisconnect)
        socketInstance.on('allMessages', handleAllMessages)
        socketInstance.on('newMessage', handleNewMessage)
        socketInstance.on('chatroomMessageError', handleChatroomMessageError)
        socketInstance.on('connect_error', (error) => {
            // Volvemos a intentar conectarnosq
            console.error('Error de conexión', error)
        })

        socketInstance.on('connect_timeout', () => {
            console.error('Tiempo de conexión agotado')
        })

        // Manejar reconexión
        socketInstance.on('reconnect', () => {
            socketInstance.emit('reconnect', chatroomId)
            // Enviar mensajes en la cola al reconectar
            sendQueuedMessages()
        })

        return () => {
            // Limpiar al desmontar el componente
            socketInstance.off('connect', handleConnect)
            socketInstance.off('disconnect', handleDisconnect)
            socketInstance.off('allMessages', handleAllMessages)
            socketInstance.off('newMessage', handleNewMessage)
            socketInstance.off('chatroomMessageError', handleChatroomMessageError)
            socketInstance.off('reconnect')
            socketInstance.off('connect_error')
            socketInstance.off('connect_timeout')
        }
    }, [socket, chatroomId])

    const sendMessage = () => {
        // Enviar mensaje inmediatamente si hay conexión
        if (socket.current.connected) {
            console.log('enviando mensaje')
            socket.current.emit('chatroomMessage', {
                chatroom: chatroomId,
                message: newMessage,
                user: userLogged
            })

            // Mostrar mensaje en el chat como enviado
            setMessages((prevMessages) => [
                {
                    _id: new Date().getTime().toString(),
                    message: newMessage,
                    user: userLogged,
                    createdAt: new Date().toISOString()
                },
                ...prevMessages
            ])
        } else {
            // Agregar el mensaje a la cola si no hay conexión
            setMessageQueue((prevQueue) => [...prevQueue, newMessage])
            // Mostrar mensaje en el chat como enviado
            setMessages((prevMessages) => [
                {
                    _id: new Date().getTime().toString(),
                    message: newMessage,
                    user: userLogged,
                    createdAt: new Date().toISOString()
                },
                ...prevMessages
            ])
        }

        // Limpiar el campo de nuevo mensaje
        setNewMessage('')
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={finishChatRoom}>
                    <Icon name='chevron-left' size={40} color={colors.white} />
                </TouchableOpacity>
                {event?.images
                    ? (
                        <Image style={styles.iconImage} source={{ uri: event.images[0] }} />
                    )
                    : (
                        <Image
                            style={styles.iconImage}
                            source={require('../assets/img/image-placeholder.jpg')}
                        />
                    )}
                <Text style={styles.headerText}>{event?.name}</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboard}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
            >
                {loading
                    ? (
                        <LottieAnimation />
                    )
                    : (
                        <FlashList
                            data={messages}
                            estimatedItemSize={40}
                            inverted
                            showsVerticalScrollIndicator={false}
                            ref={flatListRef}
                            keyExtractor={(item) => item?._id}
                            renderItem={({ item }) => {
                                const isUserMessage =
                                    item?.user?._id === userLogged.id ||
                                    item?.user?.id === userLogged.id

                                return (
                                    <View
                                        style={[
                                            styles.message,
                                            isUserMessage ? styles.messageRight : styles.messageLeft
                                        ]}
                                    >
                                        {!isUserMessage && (
                                            <>
                                                <Text style={styles.userName}>{item?.user?.name}</Text>
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
                                                {formatToTimeWithoutSeconds(new Date(item?.createdAt))}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    )}

                <View style={styles.errorBox}>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Escribe un mensaje'
                        value={newMessage}
                        onChangeText={setNewMessage}
                    />
                    <TouchableOpacity
                        style={styles.sendMessageButton}
                        disabled={!newMessage}
                        onPress={sendMessage}
                    >
                        <Icon
                            name='send'
                            type='font-awesome'
                            size={30}
                            color={colors.white}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.background
        // paddingtop for android
    },
    header: {
        paddingTop: Platform.OS === 'android' ? 25 : 0,
        width: '100%',
        height: 80,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    headerText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold'
    },

    message: {
        borderRadius: 5,
        margin: 0,
        maxWidth: '100%'
    },
    messageTextRight: {
        color: colors.white,
        textAlign: 'justify'
    },
    inputContainer: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        paddingRight: 20
    },
    input: {
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 5,
        width: '80%',
        height: 50
    },
    messageRight: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 8,
        borderTopRightRadius: 0,
        margin: 10,
        maxWidth: '80%',
        alignSelf: 'flex-end'
    },
    messageLeft: {
        backgroundColor: colors.secondary,
        padding: 10,
        borderRadius: 5,
        borderTopLeftRadius: 0,
        margin: 10,
        maxWidth: '80%',
        alignSelf: 'flex-start'
    },
    messageTextLeft: {
        color: colors.white,
        textAlign: 'left'
    },
    keyboard: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    userName: {
        color: colors.white,
        textAlign: 'left',
        fontWeight: 'bold'
    },
    timeContainerLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 5
    },
    timeText: {
        color: colors.white,
        textAlign: 'right',
        fontSize: 10
    },
    sendMessageButton: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
    sendMessageText: {
        color: colors.white,
        fontSize: 12
    },
    timeContainerRight: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    messageTime: {
        color: colors.white,
        textAlign: 'left',
        fontSize: 10,
        paddingTop: 5
    },
    iconImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10
    },
    backButton: {
        marginLeft: 10
    },
    errorBox: {
        width: '100%',
        height: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorText: {
        color: colors.accent,
        fontSize: 12
    }
})

export default ChatScreen
