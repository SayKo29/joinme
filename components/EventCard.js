import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import colors from '@/styles/colors'
import {
    formatDateRelative,
    formatDateTime,
    openGoogleMaps
} from '@/lib/utils'
import { Icon } from 'react-native-elements'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { EVENT_CATEGORIES } from 'Constants'

const EventCard = ({ event, user, onEventPress, index }) => {
    if (!event || !user) {
        return null
    }
    const handlePress = () => {
        // Llama a la función de navegación pasada como prop
        onEventPress(event, user)
    }

    const shortDescription =
        event.description.length > 23
            ? `${event.description.substring(0, 23)}...`
            : event.description


    const eventCategory = EVENT_CATEGORIES.find(
        (category) => category._id === event.category
    )


    const eventOwner = user[event.user]
    return (
        <Animated.View entering={FadeInDown.delay(300 * index)}>
            <Pressable style={styles.container} onPress={handlePress}>
                <View style={styles.userRowContainer}>
                    <View style={styles.userLeft}>
                        <Image
                            style={styles.userImage}
                            source={
                                eventCategory?.icon
                                    ? eventCategory.icon
                                    : require('../assets/img/google.png')
                            }
                        />
                        <View style={styles.userTextContent}>
                            <Text style={styles.title}>{event.name}</Text>
                            <Text style={styles.eventDescription}>{shortDescription}</Text>
                        </View>
                    </View>
                    <View style={styles.userTextContainer}>
                        <Text style={styles.text}>{formatDateRelative(event.createdAt)}</Text>
                    </View>
                </View>
                <View style={styles.eventImageContainer}>
                    <Animated.Image
                        sharedTransitionTag={event._id}
                        style={styles.eventImage}
                        resizeMode='cover'
                        source={{
                            uri:
                                event.images ? event.images : 'https://fakeimg.pl/600x400/0cab59/ffffff?text=Sin+imagen'
                        }}
                    />
                </View>
                <View style={styles.eventInfoContainer}>
                    {/* event category */}
                    <View style={styles.eventInfoRow}>
                        <Text style={styles.categoryText}>{eventCategory?.name}</Text>
                    </View>
                    {/* number of actual participants */}
                    <View style={styles.date}>
                        <Icon name='people' size={24} color={colors.primary} />
                        <Text style={styles.linkGoogleMaps}>
                            {event.participants.length + 1} {event.participants.length + 1 === 1 ? 'participante' : 'participantes'}
                        </Text>
                    </View>
                    {/* event startDate and endDate */}
                    <View style={styles.date}>
                        <Icon name='date-range' size={25} color={colors.primary} />
                        <Text style={styles.linkGoogleMaps}>
                            {/* format string to date */}
                            Del {formatDateTime(new Date(event.startDate))} al{' '}
                            {formatDateTime(new Date(event.endDate))}
                        </Text>
                    </View>
                    {/* event location */}
                    {event.isRemote
                        ? (
                            <View style={styles.linkMaps}>
                                <Icon name='place' size={20} color={colors.primary} />
                                <Text style={styles.remote}>Es un evento remoto</Text>
                            </View>
                        )
                        : (
                            <TouchableOpacity
                                onPress={() => openGoogleMaps(event.location)}
                                style={styles.linkMaps}
                            >
                                <Icon name='place' size={25} color={colors.primary} />
                                <Text style={styles.linkGoogleMaps}>{event.location}</Text>
                            </TouchableOpacity>
                        )}
                </View>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 10,
        backgroundColor: colors.background,
        paddingBottom: 20,
    },
    userRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userImage: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    userTextContainer: {
        justifyContent: 'center',
        width: 'auto'
    },
    userLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '70%'
    },
    userTextContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'SignikaBold',
        color: colors.white
    },
    text: {
        color: colors.text,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'SignikaRegular'
    },
    eventImageContainer: {
        marginTop: 10,
        height: 180,
        width: '100%'
    },
    eventImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 10
    },
    eventDescription: {
        width: '100%',
        fontSize: 16,
        color: colors.gray,
        fontFamily: 'SignikaRegular'
    },
    eventInfoContainer: {
        marginTop: 10
    },
    eventInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5
    },
    linkMaps: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    },
    remote: {
        paddingLeft: 5,
        paddingTop: 2,
        color: colors.text,
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'SignikaRegular'
    },
    linkGoogleMaps: {
        paddingLeft: 5,
        color: colors.text,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'SignikaRegular'
    },
    categoryText: {
        color: colors.accent,
        fontSize: 16,
        fontWeight: '900',
        fontFamily: 'SignikaBold'
    },
    date: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
    }
})
export default EventCard
