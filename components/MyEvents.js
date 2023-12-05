import React from "react";
import { useAuth } from "contexts/Auth";
import { FlashList } from "@shopify/flash-list";
import EventCard from "./EventCard";

const ForYouEvent = ({ data, users, navigation }) => {
    const auth = useAuth();
    const user = auth?.authData?.user;
    const [myEvents, setMyEvents] = React.useState([]);

    const handleEventPress = (event, user) => {
        // Navegar a la pantalla de detalles del evento
        navigation.navigate("EventDetailScreen", { event, user });
    };

    React.useEffect(() => {
        if (data.data) {
            const myEvents = data.data.filter((event) =>
                event.user.includes(user.id)
            );
            setMyEvents(myEvents);
        }
    }, [data.data]);

    return (
        <FlashList
            data={myEvents}
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

export default ForYouEvent;
