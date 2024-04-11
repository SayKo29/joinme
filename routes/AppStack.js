import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import { BottomTab } from '@/components/BottomTab'
import { screens } from '@/navigation/Screens'

const Stack = createStackNavigator()

export const AppStack = () => {
    return (
        <Stack.Navigator
            screenOptions={
                {
                    headerShown: false,
                    gestureEnabled: true
                }
            }
        >
            <Stack.Screen
                options={{ headerShown: false }}
                name='BottomTab'
                component={BottomTab}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name='EventDetailScreen'
                component={screens.EventDetailScreen.component}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name='ChatScreen'
                component={screens.ChatScreen.component}
            />
        </Stack.Navigator>
    )
}
