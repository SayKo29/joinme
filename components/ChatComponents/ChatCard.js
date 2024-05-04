import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import colors from 'styles/colors'

const ChatCard = ({ event, onPress, index }) => {
    return (
        <Animated.View entering={FadeInDown.delay(50 * index)} >
            <Pressable
                disabled={new Date(event.endDate) < new Date()}
                style={[
                    styles.card,
                ]}
                onPress={(event) => onPress(event)}
            >

                <Animated.Image sharedTransitionTag={event._id} style={styles.image} source={{ uri: event.images ? event.images : 'https://fakeimg.pl/600x400/0cab59/ffffff?text=Sin+imagen' }} />
                <View style={styles.cardContent}>
                    <Text style={styles.chatroom}>{event.name}</Text>
                    <Text style={styles.participants}>
                        {event.participants.length + 1}{' '}
                        {event.participants.length + 1 === 1
                            ? 'participante'
                            : 'participantes'}
                    </Text>
                    {new Date(event.endDate) < new Date() && (
                        <Text style={styles.participants}>Evento finalizado</Text>
                    )}
                </View>
            </Pressable>
        </Animated.View>
    )
}

export default ChatCard

const styles = StyleSheet.create({
    card: {
        padding: 10,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.black,
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
        justifyContent: 'center',
    },
    chatroom: {
        fontSize: 18,
        color: colors.white,
        fontWeight: 'bold',
        fontFamily: 'SignikaBold'
    },
    participants: {
        fontSize: 14,
        color: colors.white,
        fontFamily: 'SignikaRegular'
    },
})