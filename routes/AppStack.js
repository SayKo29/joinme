import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { BottomTab } from "@/components/BottomTab";

const Stack = createStackNavigator();

export const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{ headerShown: false }}
                name="Home"
                component={BottomTab}
            />
        </Stack.Navigator>
    );
};
