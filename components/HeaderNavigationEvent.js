import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import colors from '@/styles/colors'
import { useNavigation } from '@react-navigation/native'

const HeaderNavigationEvent = () => {
    const navigation = useNavigation()
    const [selected, setSelected] = useState('EventMap')
    const handleSelect = (value) => {
        navigation.navigate(value)
        setSelected(value)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => handleSelect('EventMap')}
                style={[selected === 'EventMap' ? styles.selected : styles.unselected]}
            >
                <Text
                    style={[selected === 'EventMap' ? styles.selected : styles.unselected]}
                >
                    Mapa
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleSelect('EventScroll')}
                style={[selected === 'EventScroll' ? styles.selected : styles.unselected]}
            >
                <Text
                    style={[selected === 'EventScroll' ? styles.selected : styles.unselected]}
                >
                    Descubrir Nuevos
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleSelect('MyEvents')}
                testID='MyEvents-button'
                style={[selected === 'MyEvents' ? styles.selected : styles.unselected]}
            >
                <Text
                    style={[
                        selected === 'MyEvents' ? styles.selected : styles.unselected
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
    selected: {
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
