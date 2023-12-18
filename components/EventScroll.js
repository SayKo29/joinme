import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "@/styles/colors";
import EventCard from "./EventCard";
import { FlashList } from "@shopify/flash-list";
import { useAuth } from "contexts/Auth";

const EventScroll = ({ data, users, navigation }) => {
    const handleEventPress = (event, user) => {
        // Navegar a la pantalla de detalles del evento
        navigation.navigate("EventDetailScreen", { event, user });
    };

    const [events, setEvents] = React.useState([]);
    const auth = useAuth();
    const userLogged = auth?.authData?.user;

    React.useEffect(() => {
        if (data.data) {
            const events = data.data.filter(
                (event) => event.user !== userLogged.id
            );
            setEvents(events);
        }
    }, [data.data]);

    const user = users.data;
    if (events.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.noEvents}>No hay eventos disponibles</Text>
            </View>
        );
    }

    return (
        <FlashList
            data={events}
            renderItem={({ item }) => (
                <EventCard
                    event={item}
                    user={user}
                    onEventPress={handleEventPress}
                />
            )}
            estimatedItemSize={20}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        width: "100%",
        height: "100%",
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noEvents: {
        color: colors.text,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default EventScroll;
