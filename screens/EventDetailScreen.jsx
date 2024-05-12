import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions, Pressable } from 'react-native';
import React, { useState } from 'react';
import colors from '@/styles/colors';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '@/contexts/Auth';
import JoinEvent from '@/api/EventJoinParticipant';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Headerback from 'components/HeaderBack';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'; // Importa FastImage
import useTabStore from 'store/TabStore';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import LottieAnimation from 'components/LottieAnimation';
import RemoveEventOrParticipant from 'api/RemoveEventOrParticipant';
import { Icon } from 'react-native-elements';
import { formatDateTime, openGoogleMaps } from 'lib/utils';
import { EVENT_CATEGORIES } from 'Constants';
import useUsersStore from 'store/UsersStore';

export default function EventDetailScreen ({ route }) {
    const navigation = useNavigation();
    const { event, user } = route.params;
    const queryClient = useQueryClient();
    const auth = useAuth();
    const userLogged = auth.authData;
    const { mutate } = useMutation(JoinEvent);
    const removeEventOrParticipant = useMutation(RemoveEventOrParticipant);
    const [loading, setLoading] = useState(false);
    const handleJoinEvent = () => {
        // low haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        setLoading(true);
        mutate({ event: event, participant: userLogged.user }, {
            onSuccess: () => {
                // invalida las queries
                queryClient.invalidateQueries('CHATROOMS');
                queryClient.invalidateQueries('events');
                navigation.navigate('ChatScreen', { event });
                useTabStore.setState({ tab: 1 });
                setLoading(false);
            }
        });
    };
    let userHasJoinedEvent = event.participants?.includes(userLogged.user._id);
    const users = useUsersStore((state) => state.users);
    const { width } = useWindowDimensions();
    const eventCategory = EVENT_CATEGORIES.find(
        (category) => category._id === event?.category
    )

    const eventCreator = users[event?.user];
    const isEventCreator = eventCreator?._id === userLogged.user._id;

    const handleSendPress = (param) => {
        if (param === 1) {
            setLoading(true);
            // exit group action
            let eventToUpdate = { ...event, participants: event.participants.filter(participant => participant !== userLogged.user._id) };
            removeEventOrParticipant.mutate(eventToUpdate, {
                onSettled: async () => {
                    await queryClient.invalidateQueries('events');
                    await queryClient.invalidateQueries('CHATROOMS');
                    setLoading(false);
                    navigation.goBack();
                    Toast.show({
                        position: 'bottom',
                        type: 'success',
                        position: 'bottom',
                        text1: 'Has salido del evento',
                        text2: 'Has salido del evento correctamente'
                    });
                }
            });
        }
        if (param === 2) {
            // update Event.status to 2 for delete it
            setLoading(true);
            let eventToUpdate = { ...event, status: 2 };
            removeEventOrParticipant.mutate(eventToUpdate, {
                onSuccess: () => {
                    queryClient.invalidateQueries('events');
                    queryClient.invalidateQueries('CHATROOMS');
                    setLoading(false);
                    navigation.goBack();
                    Toast.show({
                        position: 'bottom',
                        type: 'success',
                        position: 'bottom',
                        text1: 'Evento eliminado',
                        text2: 'El evento ha sido eliminado correctamente'
                    });
                }
            });
        }
        if (param === 3) {
            navigation.navigate('CreateEvent', { eventEdit: event });
        }
    }

    return (
        <View style={styles.container}>
            {loading && <LottieAnimation />}
            {!loading && (
                <>
                    <Headerback isEventCreator={isEventCreator} userHasJoinedEvent={userHasJoinedEvent} sendPress={handleSendPress} />
                    <View>
                        <View>
                            <Animated.View
                                sharedTransitionTag={event._id}
                                style={{ width: width, height: width }}
                            >
                                {/* Usa FastImage en lugar de Image */}
                                <FastImage
                                    source={{ uri: event.images ? event.images : 'https://fakeimg.pl/600x400/0cab59/ffffff?text=Sin+imagen' }}
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
                        <Animated.ScrollView style={styles.eventInfo} entering={FadeInUp.delay(800)} >
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
                            <Text style={styles.descriptionTitle}>Descripción del evento:</Text>
                            <Text style={[styles.text, styles.space]}>{event.description}</Text>
                            {/* Si el evento tiene un creador */}
                            {eventCreator && (
                                <Text style={[styles.space, styles.descriptionTitle]}>
                                    Evento creado por: <Text style={styles.text}>{eventCreator?.name}</Text>
                                </Text>
                            )}

                            <View style={styles.date}>
                                <Icon name='date-range' size={24} color={colors.primary} style={{ marginRight: 10 }} />
                                <Text style={styles.text}>
                                    {/* format string to date */}
                                    Del {formatDateTime(new Date(event.startDate))} al{' '}
                                    {formatDateTime(new Date(event.endDate))}
                                </Text>
                            </View>

                            {/* event location */}
                            {event.isRemote
                                ? (
                                    <View style={styles.date}>
                                        <Icon name='place' size={20} color={colors.primary} style={{ marginRight: 10 }} />
                                        <Text style={styles.remote}>Es un evento en remoto</Text>
                                    </View>
                                )
                                : (
                                    <Pressable
                                        onPress={() => openGoogleMaps(event.location)}
                                        style={styles.date}
                                    >
                                        <Icon name='place' size={25} color={colors.primary} style={{ marginRight: 10 }} />
                                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.text}>
                                            {event.location}
                                        </Text>
                                    </Pressable>
                                )}
                        </Animated.ScrollView>
                    </View>
                </>
            )}
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
        borderRadius: 10,
        marginVertical: 10,
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
        paddingTop: 10,
        position: 'relative'
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
        fontFamily: 'SignikaRegular',
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
    descriptionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: 'SignikaBold',
        color: 'white'
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'SignikaRegular'
    },
    space: {
        paddingBottom: 10
    },
    date: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        width: '92%',
        height: 50,
    },
    remote: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'SignikaBold'
    }
});
