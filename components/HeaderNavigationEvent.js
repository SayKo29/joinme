import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import colors from '@/styles/colors'
import { useNavigation } from '@react-navigation/native'
import useHeaderEventStore from 'store/HeaderEventStore'
import * as Haptics from 'expo-haptics'

const HeaderNavigationEvent = () => {
    const navigation = useNavigation()
    const tab = useHeaderEventStore((state) => state.tab)
    const tabs = [
        { title: 'Mapa', value: 'EventMap' },
        { title: 'Descubrir Nuevos', value: 'EventScroll' },
        { title: 'Mis eventos', value: 'MyEvents' }
    ]

    const handleSelect = (value) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        navigation.navigate(value)
        useHeaderEventStore.setState({ tab: value })
    }

    return (
        <View style={styles.container}>
            {tabs.map(({ title, value }) => (
                <Pressable
                    key={value}
                    onPress={() => handleSelect(value)}
                    style={[
                        styles.tab,
                        tab === value ? styles.selected : styles.unselected
                    ]}
                >
                    <Text style={tab === value ? styles.selectedText : styles.unselectedText}>{title}</Text>
                </Pressable>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.background
    },
    tab: {
        flex: 1,
        alignItems: 'center',
    },
    selectedText: {
        fontWeight: 'bold',
        color: colors.primary,
        fontSize: 16,
        fontFamily: 'SignikaBold',
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    unselectedText: {
        fontWeight: 'bold',
        color: colors.gray,
        fontSize: 16,
        fontFamily: 'SignikaBold',
        borderBottomWidth: 1,
        borderBottomColor: colors.background,
    },
    unselected: {
        borderBottomWidth: 0, // Se elimina el borde inferior para los no seleccionados
    },
})

export default HeaderNavigationEvent
