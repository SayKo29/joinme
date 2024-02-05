import React, { useEffect, useRef } from "react";
import { SafeAreaView, Text, View, Animated, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import colors from "styles/colors";

const LottieAnimation = () => {
    const progress = useRef(new Animated.Value(0)).current;

    const handleLikeAnimation = () => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();
    };
    useEffect(() => {
        handleLikeAnimation();
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
            clearInterval(interval);
        };
    }, []);

    const interval = setInterval(function () {
        // reset progress
        progress.setValue(0);

        // method to be executed;
        handleLikeAnimation();
    }, 3000);

    return (
        <View style={lottieStyle.fullLottie}>
            <LottieView
                style={lottieStyle.lottie}
                progress={progress}
                source={require("../assets/animations/loader.json")}
            />
        </View>
    );
};

const lottieStyle = StyleSheet.create({
    fullLottie: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    lottie: {
        // SMALL LOTTIE
        backgroundColor: colors.background,
        width: 200,
        height: 200,
    },
});

export default LottieAnimation;
