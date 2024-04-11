import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '@/styles/colors'
import EventCard from './EventCard'
import { FlashList } from '@shopify/flash-list'
import { useAuth } from '@/contexts/Auth'
import { useNavigation } from '@react-navigation/native'
import useEventStore from 'store/EventStore'
import useUsersStore from 'store/UsersStore'

const EventScroll = () => {
    const navigation = useNavigation();

    const handleEventPress = (event, user) => {
        navigation.navigate('EventDetailScreen', { event, user })
    }
    const data = useEventStore((state) => state.events)
    const users = useUsersStore((state) => state.users)
    const auth = useAuth()
    //   console.log(auth?.authData, "hola")
    const userLogged = auth?.authData.user

    const events = data
        ? data.filter((event) => event.user !== userLogged._id)
        : []

    const user = users
    if (events.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.noEvents}>No hay eventos disponibles</Text>
            </View>
        )
    }

    return (
        <FlashList
            data={events}
            renderItem={({ item, index }) => (
                <EventCard event={item} user={user} onEventPress={handleEventPress} index={index} />
            )}
            estimatedItemSize={20}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        width: '100%',
        height: '100%',
        flex: 1
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noEvents: {
        color: colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})

export default EventScroll
