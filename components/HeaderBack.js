import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import UserActionsButtons from './ui/UserActionsButtons';
import * as Haptics from 'expo-haptics';

const Headerback = ({ isEventCreator, userHasJoinedEvent, sendPress }) => {
    const inset = useSafeAreaInsets();
    const navigation = useNavigation()
    const handleBackPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        navigation.goBack()
    }
    return (
        <Animated.View
            style={[styles.container, { top: Platform.OS === 'ios' ? inset.top : 20 }]}
            // style={[styles.container, { top: inset.top }]}
            entering={FadeIn.delay(400)}>
            <Pressable
                onPress={() => {
                    handleBackPress();
                }}>
                <Image
                    source={require('../assets/img/chevron.png')}
                    style={styles.chevron}
                />
            </Pressable>
            {(isEventCreator || userHasJoinedEvent) && (
                <View style={{ position: 'relative', width: 44, height: 44 }}>
                    <UserActionsButtons isEventCreator={isEventCreator} userHasJoinedEvent={userHasJoinedEvent} sendPress={sendPress} />
                </View>
            )}
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