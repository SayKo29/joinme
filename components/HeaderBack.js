import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import UserActionsButtons from './ui/UserActionsButtons';

const Headerback = ({ isEventCreator, userHasJoinedEvent }) => {
    const inset = useSafeAreaInsets();
    const navigation = useNavigation()
    return (
        <Animated.View
            style={[styles.container, { top: Platform.OS === 'ios' ? inset.top : 20 }]}
            // style={[styles.container, { top: inset.top }]}
            entering={FadeIn.delay(400)}>
            <Pressable
                onPress={() => {
                    navigation.goBack();
                }}>
                <Image
                    source={require('../assets/img/chevron.png')}
                    style={styles.chevron}
                />
            </Pressable>
            <View style={{ position: 'relative', width: 44, height: 44 }}>
                <UserActionsButtons isEventCreator={isEventCreator} userHasJoinedEvent={userHasJoinedEvent} />
            </View>
        </Animated.View>
    );
};

export default Headerback;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chevron: {
        width: 44,
        height: 44,
        position: 'relative',
        borderRadius: 22,
    },
});