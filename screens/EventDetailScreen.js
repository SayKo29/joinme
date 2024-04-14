import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import colors from '@/styles/colors';
import getUsersData from '@/api/UsersData';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAuth } from '@/contexts/Auth';
import JoinEvent from '@/api/EventJoinParticipant';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Headerback from 'components/HeaderBack';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'; // Importa FastImage
import useCategoryStore from 'store/CategoryStore';
import useTabStore from 'store/TabStore';

export default function EventDetailScreen ({ route }) {
    const navigation = useNavigation();
    const { event, user } = route.params;
    const queryClient = useQueryClient();
    const auth = useAuth();
    const userLogged = auth.authData;
    const { mutate } = useMutation(JoinEvent);
    const [loading, setLoading] = useState(false);
    const handleJoinEvent = () => {
        setLoading(true);
        mutate({ event: event, participant: userLogged.user }, {
            onSuccess: () => {
                // invalida las queries
                queryClient.invalidateQueries('CHATROOMS');
                queryClient.invalidateQueries('EVENTS');
                navigation.navigate('ChatScreen', { event });
                useTabStore.setState({ tab: 1 });
                setLoading(false);
            }
        });
    };
    let userHasJoinedEvent = event.participants?.includes(userLogged.user._id);
    const users = useQuery('USERS', getUsersData);
    const { width } = useWindowDimensions();
    const { categories } = useCategoryStore()
    const eventCategory = categories.find(
        (category) => category._id === event?.category
    )

    const eventCreator = users?.data[event?.user];
    return (
        <View style={styles.container}>
            <Headerback />
            <View>
                <View>
                    <Animated.View
                        sharedTransitionTag={event._id}
                        style={{ width: width, height: width }}
                    >
                        {/* Usa FastImage en lugar de Image */}
                        <FastImage
                            source={{ uri: event.images[0] ? event.images[0] : 'https://fakeimg.pl/600x400/0cab59/ffffff?text=Sin+imagen' }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode={FastImage.resizeMode.cover} // Ajusta el modo de redimensionamiento según tu necesidad
                        />
                    </Animated.View>
                    <Animated.View
                        style={styles.textContainer}
                        entering={FadeInUp.delay(600)}>
                        <Text style={styles.textName}>{event.name}</Text>
                        <Text style={styles.textDescription}>{eventCategory?.name}</Text>
                    </Animated.View>
                </View>
                <View style={styles.eventInfo}>
                    <Text style={styles.textDescription}>{event.description}</Text>
                    {/* Si el evento tiene un creador */}
                    {eventCreator && (
                        <Text style={styles.textCreatedBy}>
                            Evento creado por <Text style={styles.bolderText}>{eventCreator?.name}</Text>
                        </Text>
                    )}

                    {/* Botón para unirse al evento si no eres el creador del evento y no eres un participante del evento */}
                    {userLogged.user._id !== event.user &&
                        !userHasJoinedEvent && (
                            <TouchableOpacity
                                style={styles.buttonJoin}
                                disabled={loading}
                                onPress={handleJoinEvent}
                            >
                                <Text style={styles.buttonText}>Unirse al chat del evento</Text>
                            </TouchableOpacity>
                        )}
                    {
                        userHasJoinedEvent && (
                            <TouchableOpacity
                                style={styles.buttonJoin}
                                disabled
                            >
                                <Text style={styles.buttonText}>Ya te has unido al evento</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
        </View>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        bottom: 10,
        left: 10,
        right: 10,
        padding: 16,
        borderRadius: 10,
    },
    buttonJoin: {
        backgroundColor: colors.accent,
        padding: 10,
        borderRadius: 5,
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'SignikaBold',
        fontWeight: 'bold',
        fontSize: 16
    },
    eventInfo: {
        flex: 1,
        padding: 10,
        paddingTop: 20,
    },
    textName: {
        color: colors.primary,
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'SignikaBold',
        paddingBottom: 10
    },
    textDescription: {
        color: colors.text,
        fontSize: 16,
        fontFamily: 'SignikaBold',
        fontWeight: 'bold'
    },
    textCreatedBy: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'SignikaRegular'
    },
    bolderText: {
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'SignikaBold'
    },
});
