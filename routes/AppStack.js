import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainEvents from 'screens/MainEvents';
import EventScroll from 'components/EventScroll';
import MyEvents from 'components/MyEvents';
import EventDetailScreen from 'screens/EventDetailScreen';
import ChatScreen from 'screens/ChatScreen';
import Profile from 'screens/Profile';
import ChatRooms from 'screens/Chatroom';
import CreateEvent from 'screens/CreateEvent';
import { getEvents, getUsers } from 'services/queries';
import useEventStore from 'store/EventStore';
import useUsersStore from 'store/UsersStore';

const Stack = createNativeStackNavigator()

export const AppStack = () => {

    const { data: eventsData, isLoading: eventsLoading } = getEvents();
    const { data: usersData, isLoading: usersLoading } = getUsers();

    useEffect(() => {
        // Verificar si los datos de eventos han cargado y no están en estado de carga
        if (!eventsLoading && eventsData) {
            // Actualizar el estado global de eventos
            useEventStore.getState().setEvents(eventsData);
        }
    }, [eventsData, eventsLoading]);

    useEffect(() => {
        // Verificar si los datos de usuarios han cargado y no están en estado de carga
        if (!usersLoading && usersData) {
            // Actualizar el estado global de usuarios
            useUsersStore.getState().setUsers(usersData);
        }
    }, [usersData, usersLoading]);

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
                    name='EventMap'
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
