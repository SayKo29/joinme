import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTab } from '@/components/BottomTab'
import { screens } from '@/navigation/Screens'
import { NavigationContext } from '@react-navigation/native';

const Stack = createNativeStackNavigator()

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
