import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainEvents from 'screens/MainEvents';
import EventScroll from 'components/EventScroll';
import MyEvents from 'components/MyEvents';
import EventDetailScreen from 'screens/EventDetailScreen';
import ChatScreen from 'screens/ChatScreen';
import Profile from 'screens/Profile';
import ChatRooms from 'screens/Chatroom';
import CreateEvent from 'screens/CreateEvent';

const Stack = createNativeStackNavigator()

export const AppStack = () => {
    return (
        <Stack.Navigator
            screenOptions={
                {
                    headerShown: false,
                }
            }
        >
            <Stack.Group>
                <Stack.Screen
                    options={{ headerShown: false, animation: 'fade' }}
                    name='Events'
                    component={MainEvents}
                />
                <Stack.Screen
                    options={{ headerShown: false, animation: 'fade' }}
                    name='EventScroll'
                    component={EventScroll}
                />
                <Stack.Screen
                    options={{ headerShown: false, animation: 'fade' }}
                    name='MyEvents'
                    component={MyEvents}
                />
                <Stack.Screen
                    options={{ headerShown: false, animation: 'fade' }}
                    name='EventDetailScreen'
                    component={EventDetailScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='ChatScreen'
                    component={ChatScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false, animation: 'fade' }}
                    name='ChatRoom'
                    component={ChatRooms}
                />
                <Stack.Screen
                    options={{ headerShown: false, animation: 'fade' }}
                    name='CreateEvent'
                    component={CreateEvent}
                />
                <Stack.Screen
                    options={{ headerShown: false, animation: 'fade' }}
                    name='Profile'
                    component={Profile}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}
