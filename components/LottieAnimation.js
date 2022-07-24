import React from "react";
import Lottie from "lottie-react-native";

export default function LottieAnimation(url) {
    return (
        <Lottie source={require("../assets/json/loader.json")} autoPlay loop />
    );
}
