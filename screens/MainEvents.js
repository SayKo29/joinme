import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import CustomBottomTab from 'components/ui/CustomBottomTab'
import EventMap from 'components/EventMap'
import { useQuery } from 'react-query'
import LottieAnimation from 'components/LottieAnimation'
import getUsersData from 'api/UsersData'
import getEventsData from 'api/EventsData'
import HeaderNavigationEvent from 'components/HeaderNavigationEvent'
import useEventStore from 'store/EventStore'
import useUsersStore from 'store/UsersStore'
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
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <HeaderNavigationEvent />
            </View>
            <View style={styles.mapContainer}>
                <EventMap data={eventsQuery} users={usersQuery} />
            </View>
            <View style={styles.bottomTab}>
                <CustomBottomTab />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {

    },
    mapContainer: {
        height: '80%'
    },
    bottomTab: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
})

export default MainEvents
