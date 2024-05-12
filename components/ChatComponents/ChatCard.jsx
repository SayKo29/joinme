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
                <View style={styles.cardLine}>
                    <Animated.Image sharedTransitionTag={event._id} style={styles.image} source={{ uri: event.images ? event.images : 'https://fakeimg.pl/600x400/0cab59/ffffff?text=Sin+imagen' }} />
                    <View style={styles.cardContent}>
                        <Animated.Text sharedTransitionTag={event.name} style={styles.chatroom}>{event.name}</Animated.Text>
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
                </View>
            </Pressable>
        </Animated.View>
    )
}

export default ChatCard

const styles = StyleSheet.create({
    card: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10,
        bottom: 10
    },
    cardContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.chatline,
        paddingBottom: 20,
        paddingLeft: 5
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
    cardLine: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})