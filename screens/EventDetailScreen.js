import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import colors from '@/styles/colors';
import getUsersData from '@/api/UsersData';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAuth } from '@/contexts/Auth';
import JoinEvent from '@/api/EventJoinParticipant';
import Animated, { FadeIn } from 'react-native-reanimated';
import Headerback from 'components/HeaderBack';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'; // Importa FastImage

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
                setLoading(false);
                queryClient.invalidateQueries('CHATROOMS');
                queryClient.invalidateQueries('EVENTS');
                navigation.navigate('Chats');
            }
        });
    };
    let userHasJoinedEvent = event.participants?.includes(userLogged.user._id);
    const users = useQuery('USERS', getUsersData);
    const { width } = useWindowDimensions();

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
                            source={{ uri: event.images[0] }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode={FastImage.resizeMode.cover} // Ajusta el modo de redimensionamiento según tu necesidad
                        />
                    </Animated.View>
                    <Animated.View
                        style={styles.textContainer}
                        entering={FadeIn.delay(600)}>
                        <Text style={styles.textName}>{event.name}</Text>
                        <Text style={styles.textDescription}>{event.description}</Text>
                    </Animated.View>
                </View>
                {/* Si el evento tiene un creador */}
                {eventCreator && (
                    <Text style={styles.description}>
                        Evento creado por {eventCreator?.name}
                    </Text>
                )}

                {/* Botón para unirse al evento si no eres el creador del evento y no eres un participante del evento */}
                {userLogged.user._id !== event.user &&
                    !userHasJoinedEvent && (
                        <TouchableOpacity
                            style={styles.button}
                            disabled={loading}
                            onPress={handleJoinEvent}
                        >
                            <Text style={styles.buttonText}>Unirse al chat del evento</Text>
                        </TouchableOpacity>
                    )}
                {
                    userHasJoinedEvent && (
                        <Text>Ya te has unido al evento</Text>
                    )
                }
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        bottom: 10,
        left: 10,
        right: 10,
        padding: 16,
        borderRadius: 20,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 10
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    eventInfo: {
        padding: 10
    },
    textName: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    textDescription: {
        color: 'white',
        fontSize: 16,
    },
});
