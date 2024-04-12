import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import colors from '@/styles/colors'
import getUsersData from '@/api/UsersData'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useAuth } from '@/contexts/Auth'
import JoinEvent from '@/api/EventJoinParticipant'
import Animated from 'react-native-reanimated'
import Headerback from 'components/HeaderBack'
import { useNavigation } from '@react-navigation/native'

export default function EventDetailScreen ({ route }) {
    const navigation = useNavigation();
    const { event, user } = route.params
    const queryClient = useQueryClient()
    const auth = useAuth()
    const userLogged = auth.authData
    const { mutate } = useMutation(JoinEvent)
    const [loading, setLoading] = useState(false)
    const handleJoinEvent = () => {
        setLoading(true)
        mutate({ event: event, participant: userLogged.user }, {
            onSuccess: () => {
                // uncached query 
                setLoading(false)
                queryClient.invalidateQueries('CHATROOMS')
                queryClient.invalidateQueries('EVENTS')
                navigation.navigate('Chats')
            }
        })
    }
    let userHasJoinedEvent = event.participants?.includes(userLogged.user._id)
    const users = useQuery('USERS', getUsersData)
    const { width } = useWindowDimensions()

    const eventCreator = users?.data[event?.user]
    return (
        <View style={styles.container}>
            <Headerback />
            <Animated.Image
                sharedTransitionTag={event.images[0]}
                source={{ uri: event.images[0] }} style={{ width: width, height: width }} />

            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.description}>{event.description}</Text>
            {/* if eventCreator has name */}
            {eventCreator && (
                <Text style={styles.description}>
                    Evento creado por {eventCreator?.name}
                </Text>
            )}

            {/* button to join chat event if u are not creator of the event && you are not a participant of the event */}
            {userLogged.user._id !== event.user &&
                !userHasJoinedEvent && (
                    <TouchableOpacity
                        style={styles.button}
                        disabled={loading}
                        onPress={handleJoinEvent}
                    >
                        <Text style={styles.buttonText}>Unirse al chat del evento</Text>
                    </TouchableOpacity>
                )}
            {
                userHasJoinedEvent && (
                    <Text>Ya te has unido al evento</Text>
                )
            }
        </View>
    )
}

// create our styling code:
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        padding: 10
    },
    galleryContainer: {
        width: '100%',
        height: 200,
        marginBottom: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.white
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        color: colors.white
    },

    button: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 10
    },

    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },

    activeDotStyle: {
        backgroundColor: colors.accent
    }
})
