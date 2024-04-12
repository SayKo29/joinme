import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import colors from '@/styles/colors'
import { useNavigation } from '@react-navigation/native'
import useHeaderEventStore from 'store/HeaderEventStore'
useHeaderEventStore


const HeaderNavigationEvent = () => {
    const navigation = useNavigation()
    const tab = useHeaderEventStore((state) => state.tab)
    const handleSelect = (value) => {
        navigation.navigate(value)
        useHeaderEventStore.setState({ tab: value })
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => handleSelect('EventMap')}
                style={[tab === 'EventMap' ? styles.tab : styles.unselected]}
            >
                <Text
                    style={[tab === 'EventMap' ? styles.tab : styles.unselected]}
                >
                    Mapa
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleSelect('EventScroll')}
                style={[tab === 'EventScroll' ? styles.tab : styles.unselected]}
            >
                <Text
                    style={[tab === 'EventScroll' ? styles.tab : styles.unselected]}
                >
                    Descubrir Nuevos
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleSelect('MyEvents')}
                testID='MyEvents-button'
                style={[tab === 'MyEvents' ? styles.tab : styles.unselected]}
            >
                <Text
                    style={[
                        tab === 'MyEvents' ? styles.tab : styles.unselected
                    ]}
                >
                    Mis eventos
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 10,
        backgroundColor: colors.background
    },
    tab: {
        fontWeight: 'bold',
        color: colors.text,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        fontSize: 16
    },
    unselected: {
        fontWeight: 'bold',
        color: colors.gray,
        fontSize: 16
    }
})

export default HeaderNavigationEvent
