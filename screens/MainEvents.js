import { View, Text, StyleSheet, Platform } from 'react-native'
import React, { useState } from 'react'
import CustomBottomTab from 'components/ui/CustomBottomTab'
import EventMap from 'components/map/EventMap'
import { useQuery } from 'react-query'
import LottieAnimation from 'components/LottieAnimation'
import getUsersData from 'api/UsersData'
import getEventsData from 'api/EventsData'
import HeaderNavigationEvent from 'components/HeaderNavigationEvent'
import useEventStore from 'store/EventStore'
import useUsersStore from 'store/UsersStore'
import colors from 'styles/colors'
useEventStore

const MainEvents = () => {

    const eventsQuery = useQuery({
        queryKey: ['EVENTS'],
        queryFn: getEventsData,
        refetchInterval: 300000,
        onSuccess: (data) => useEventStore.getState().setEvents(data)
    });

    const usersQuery = useQuery({
        queryKey: ['USERS'],
        queryFn: getUsersData,
        refetchInterval: 300000,
        onSuccess: (data) => useUsersStore.getState().setEvents(data)
    });

    if (eventsQuery.isLoading) {
        return <LottieAnimation />;
    }
    if (eventsQuery.isError) {
        return <Text>Error events...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <HeaderNavigationEvent />
            </View>
            <View style={styles.mapContainer}>
                <EventMap data={eventsQuery} users={usersQuery} />
            </View>
            <CustomBottomTab />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 0 : 55,
        backgroundColor: colors.background
    },
    headerContainer: {
        height: 40
    },
    mapContainer: {
        flex: 1
    },
})

export default MainEvents
