import React, { useEffect, useRef } from "react";
import { SafeAreaView, Text, View, Animated } from "react-native";
import LottieView from "lottie-react-native";

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
        <SafeAreaView>
            <View style={{ height: "100%", width: "100%" }}>
                <LottieView
                    progress={progress}
                    source={require("../assets/animations/loader.json")}
                />
            </View>
        </SafeAreaView>
    );
};

export default LottieAnimation;
