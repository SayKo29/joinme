import React from 'react'
import { useAuth } from '@/contexts/Auth'
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Pressable
} from 'react-native'
import getEventsByParticipant from '@/api/GetParticipantEvents'
import { useQuery } from 'react-query'
import LottieAnimation from '@/components/LottieAnimation'
import colors from '@/styles/colors'
import { FlashList } from '@shopify/flash-list'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import CustomBottomTab from 'components/ui/CustomBottomTab'

const ChatRooms = () => {
    const navigation = useNavigation()
    const auth = useAuth()
    const loggedUser = auth.authData.user
    // console.log(auth.authData.user._id)
    const { isLoading, isError, data } = useQuery('CHATROOMS', () =>
        getEventsByParticipant(loggedUser._id)
    )

    const handleSelectChatroom = (event) => {
        navigation.navigate('ChatScreen', { event })
    }

    if (isLoading || isError) {
        return isLoading ? <LottieAnimation /> : <Text>Error</Text>
    }
    const events = data ?? []

    // sort events by date
    events?.sort((a, b) => {
        return new Date(b.endDate) - new Date(a.endDate)
    })

    if (events.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <TouchableOpacity
                    style={styles.emptyContainer}
                    onPress={() => navigation.navigate('Eventos')}
                >
                    <Text style={styles.text}>
                        No hay chats disponibles, para unirte a alguno,
                    </Text>
                    <Text style={styles.btn}>únete a un evento</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={[styles.container]}>
            <View style={styles.title}>
                <Text style={styles.titleText}>Chats de eventos</Text>
            </View>
            <FlashList
                data={events}
                estimatedItemSize={20}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(50 * index)} >
                        <Pressable
                            disabled={new Date(item.endDate) < new Date()}
                            style={[
                                styles.card,
                                {
                                    backgroundColor:
                                        new Date(item.endDate) < new Date()
                                            ? colors.disabled
                                            : colors.primary
                                }
                            ]}
                            onPress={() => handleSelectChatroom(item)}
                        >

                            <Animated.Image sharedTransitionTag={item._id} style={styles.image} source={{ uri: item.images[0] ? item.images[0] : 'https://fakeimg.pl/600x400/0cab59/ffffff?text=Sin+imagen' }} />
                            <View style={styles.cardContent}>
                                <Text style={styles.chatroom}>{item.name}</Text>
                                <Text style={styles.participants}>
                                    {item.participants.length + 1}{' '}
                                    {item.participants.length + 1 === 1
                                        ? 'participante'
                                        : 'participantes'}
                                </Text>
                                {new Date(item.endDate) < new Date() && (
                                    <Text style={styles.participants}>Evento finalizado</Text>
                                )}
                            </View>
                        </Pressable>
                    </Animated.View>
                )}
            />
            <CustomBottomTab />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 60,
        backgroundColor: colors.background
    },
    card: {
        backgroundColor: colors.primary,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10
    },
    cardContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    chatroom: {
        fontSize: 18,
        color: colors.white
    },
    participants: {
        fontSize: 14,
        color: colors.white
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
    },
    title: {
        alignItems: 'center',
        paddingBottom: 10
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        fontFamily: 'SignikaBold'
    },
    text: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 10,
        fontFamily: 'SignikaBold'
    },
    btn: {
        color: colors.accent,
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 10,
        fontFamily: 'SignikaBold'
    },

})

export default ChatRooms
