import React from "react";
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from "@react-navigation/native";

import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { useAuth } from "../contexts/Auth";
import { Loading } from "@/components/Loading";
import { useColorScheme } from "react-native";
import colors from "@/styles/colors";

export const Router = () => {
    const { authData, loading } = useAuth();
    const scheme = useColorScheme();

    const MyTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            primary: "rgb(255, 45, 85)",
            background: colors.background,
            card: "rgb(255, 255, 255)",
            text: "rgb(28, 28, 30)",
            border: "rgb(199, 199, 204)",
            notification: "rgb(255, 69, 58)",
        },
    };

    if (loading) {
        return <Loading />;
    }
    return (
        <NavigationContainer theme={scheme === "dark" ? MyTheme : DefaultTheme}>
            {authData ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};
