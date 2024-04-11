import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Platform } from 'react-native';
import { useQuery } from 'react-query';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from '@/styles/colors';
import getEventsData from '@/api/EventsData';
import getUsersData from '@/api/UsersData';
import LottieAnimation from '@/components/LottieAnimation';
import HeaderNavigationEvent from '@/components/HeaderNavigationEvent';
import EventScroll from '@/components/EventScroll';
import EventMap from 'components/EventMap';
import MyEvents from '@/components/MyEvents';

const Stack = createNativeStackNavigator();

export default function EventNavigation () {
    const eventsQuery = useQuery({
        queryKey: ['EVENTS'],
        queryFn: getEventsData,
        refetchInterval: 300000
    });

    const usersQuery = useQuery({
        queryKey: ['USERS'],
        queryFn: getUsersData,
        refetchInterval: 300000
    });

    const [selected, setSelected] = useState('map');

    const handleSelect = (value) => {
        setSelected(value);
    };

    if (eventsQuery.isLoading) {
        return <LottieAnimation />;
    }
    if (eventsQuery.isError) {
        return <Text>Error events...</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <HeaderNavigationEvent selected={selected} setSelected={handleSelect} />
            </View>
            <Stack.Navigator initialRouteName='EventMap' screenOptions={{
                headerShown: false,

            }}
            >
                <Stack.Screen name="EventScroll">
                    {(props) => (
                        <EventScroll
                            {...props}
                            data={eventsQuery}
                            users={usersQuery}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="EventMap">
                    {(props) => (
                        <EventMap
                            {...props}
                            navigation={props.navigation}
                            data={eventsQuery}
                            users={usersQuery}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="MyEvents">
                    {(props) => (
                        <MyEvents
                            {...props}
                            navigation={props.navigation}
                            data={eventsQuery}
                            users={usersQuery}
                        />
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: colors.background,
        height: Platform.OS === 'android' ? 70 : 50,
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
    container: {
        backgroundColor: colors.background,
        height: '100%',
        flex: 1
    }
});
