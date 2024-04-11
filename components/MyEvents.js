import React from 'react'
import { useAuth } from '@/contexts/Auth'
import { FlashList } from '@shopify/flash-list'
import EventCard from './EventCard'
import { StyleSheet, Text, View } from 'react-native'
import colors from '@/styles/colors'
import useEventStore from 'store/EventStore'

const MyEvents = ({ navigation }) => {
    const auth = useAuth()
    const user = auth?.authData?.user
    const data = useEventStore((state) => state.events)
    const [myEvents, setMyEvents] = React.useState([])

    const handleEventPress = (event, user) => {
        // Navegar a la pantalla de detalles del evento
        navigation.navigate('EventDetailScreen', { event, user })
    }

    React.useEffect(() => {
        if (data) {
            const myEvents = data.filter((event) =>
                event.user.includes(user._id)
            )
            setMyEvents(myEvents)
        }
    }, [data])

    if (myEvents.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.noEvents}>No tienes eventos creados</Text>
            </View>
        )
    }

    return (
        <FlashList
            data={myEvents}
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
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text
    }
})

export default MyEvents
