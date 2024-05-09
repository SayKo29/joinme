import { View, Text, StyleSheet, Platform } from 'react-native'
import React from 'react'
import CustomBottomTab from 'components/ui/CustomBottomTab'
import EventMap from 'components/map/EventMap'
import HeaderNavigationEvent from 'components/HeaderNavigationEvent'
import useEventStore from 'store/EventStore'
import colors from 'styles/colors'
useEventStore

const MainEvents = () => {


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <HeaderNavigationEvent />
            </View>
            <View style={styles.mapContainer}>
                <EventMap />
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
        height: 30
    },
    mapContainer: {
        flex: 1
    },
})

export default MainEvents
