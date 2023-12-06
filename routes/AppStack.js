import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { BottomTab } from "@/components/BottomTab";
import { screens } from "navigation/Screens";

const Stack = createStackNavigator();

export const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{ headerShown: false }}
                name="BottomTab"
                component={BottomTab}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="EventDetailScreen"
                component={screens.EventDetailScreen.component}
                // pass navigation prop to screen
                initialParams={{ navigation: null }}
            />
        </Stack.Navigator>
    );
};
