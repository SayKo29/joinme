import { View, StyleSheet, Text, Image, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import colors from '@/styles/colors'
import getUsersData from '@/api/UsersData'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useAuth } from '@/contexts/Auth'
import JoinEvent from '@/api/EventJoinParticipant'
import Swiper from 'react-native-swiper'

export default function EventDetailScreen ({ route, navigation }) {
    const { event, user } = route.params
    const queryClient = useQueryClient()
    const auth = useAuth()
    const userLogged = auth.authData
    const { mutate } = useMutation(JoinEvent)
    const [loading, setLoading] = useState(false)
    const handleJoinEvent = () => {
        setLoading(true)
        // add participant to event
        event.participants.push(auth.authData.user._id)
        mutate(event, {
            onSuccess: () => {
                // uncached query
                setLoading(false)
                queryClient.invalidateQueries('CHATROOMS')
                navigation.navigate('Chats')
            }
        })
    }

    const users = useQuery('USERS', getUsersData)

    const eventCreator = users?.data[event?.user]
    return (
        <SafeAreaView style={styles.cardContainer}>
            <View style={styles.container}>
                {/* /* show gallery images if have it* */}
                {event.images.length > 0 && (
                    <View style={styles.galleryContainer}>
                        <Swiper
                            style={styles.wrapper}
                            activeDotStyle={styles.activeDotStyle}
                        >
                            {event.images.map((image, index) => {
                                return (
                                    <View style={styles.slide1} key={index}>
                                        <Image source={{ uri: image }} style={styles.image} />
                                    </View>
                                )
                            })}
                        </Swiper>
                    </View>
                )}

                <Text style={styles.title}>{event.name}</Text>
                <Text style={styles.description}>{event.description}</Text>
                {/* if eventCreator has name */}
                {eventCreator && (
                    <Text style={styles.description}>
                        Evento creado por {eventCreator?.name}
                    </Text>
                )}

                {/* button to join chat event if u are not creator of the event && you are not a participant of the event */}
                {auth.authData.id !== event &&
                    !event.participants?.includes(auth.authData.id) && (
                        <TouchableOpacity
                            style={styles.button}
                            disabled={loading}
                            onPress={handleJoinEvent}
                        >
                            <Text style={styles.buttonText}>Unirse al chat del evento</Text>
                        </TouchableOpacity>
                    )}
            </View>
        </SafeAreaView>
    )
}

// create our styling code:
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.background,
        width: '100%',
        height: '100%'
    },
    container: {
        backgroundColor: colors.background,
        width: '100%',
        height: '100%',
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
