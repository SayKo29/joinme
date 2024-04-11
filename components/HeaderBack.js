import { Image, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const Headerback = () => {
    const inset = useSafeAreaInsets();
    const navigation = useNavigation()
    return (
        <Animated.View
            // style={[styles.container, {top: Platform.OS === 'ios' ? inset.top : 20}]}
            style={[styles.container, { top: inset.top }]}
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
        </Animated.View>
    );
};

export default Headerback;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 20,
        right: 20,
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chevron: {
        width: 44,
        height: 44,
    },
});