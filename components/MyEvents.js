import React from 'react'
import { useAuth } from '@/contexts/Auth'
import { FlashList } from '@shopify/flash-list'
import EventCard from './EventCard'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import colors from '@/styles/colors'
import useEventStore from 'store/EventStore'
import CustomBottomTab from './ui/CustomBottomTab'
import HeaderNavigationEvent from './HeaderNavigationEvent'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { uiStyles } from 'styles/uiStyles'
import useTabStore from 'store/TabStore'
import { Platform } from 'react-native'

const MyEvents = ({ navigation }) => {
    const inset = useSafeAreaInsets()
    const auth = useAuth()
    const user = auth?.authData?.user
    const data = useEventStore((state) => state.events)
    const [myEvents, setMyEvents] = React.useState([])

    const handleEventPress = (event, user) => {
        // Navegar a la pantalla de detalles del evento
        navigation.navigate('EventDetailScreen', { event, user })
    }

    const handleCreateEvent = () => {
        // Navegar a la pantalla de creación de evento
        navigation.navigate('CreateEvent')
        useTabStore.setState({ tab: 2 })
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
            <View style={[styles.container]}>
                <HeaderNavigationEvent />
                <View style={styles.center}>
                    <Text style={styles.noEvents}>No tienes eventos creados</Text>
                    <TouchableOpacity style={uiStyles.button} onPress={handleCreateEvent}>
                        <Text style={uiStyles.buttonText}>Crea un evento</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomTab}>
                    <CustomBottomTab />
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.container]}>
            <HeaderNavigationEvent />
            <FlashList
                data={myEvents}
                renderItem={({ item, index }) => (
                    <EventCard event={item} user={user} onEventPress={handleEventPress} index={index} />
                )}
                estimatedItemSize={20}
            />
            <View style={styles.bottomTab}>
                <CustomBottomTab />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 0 : 55
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noEvents: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        paddingBottom: 20
    },
})

export default MyEvents
