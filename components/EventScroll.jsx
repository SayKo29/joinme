import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import colors from "@/styles/colors";
import EventCard from "./EventCard";
import { FlashList } from "@shopify/flash-list";
import { useAuth } from "@/contexts/Auth";
import { useNavigation } from "@react-navigation/native";
import useEventStore from "store/EventStore";
import useUsersStore from "store/UsersStore";
import CustomBottomTab from "./ui/CustomBottomTab";
import HeaderNavigationEvent from "./HeaderNavigationEvent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sortEventsByCloser } from "lib/utils";

const EventScroll = () => {
  const navigation = useNavigation();

  const handleEventPress = (event, user) => {
    navigation.navigate("EventDetailScreen", { event, user });
  };
  const data = useEventStore((state) => state.events);
  const users = useUsersStore((state) => state.users);
  const auth = useAuth();
  const userLogged = auth?.authData.user;

  const events = data
    ? data.filter((event) => event.user !== userLogged._id)
    : [];
  const [eventsSorted, setEventsSorted] = useState([]);
  // sort events by distance
  // get user location from async storage
  const getUserLocation = async () => {
    try {
      const userLocation = await AsyncStorage.getItem("region");
      return JSON.parse(userLocation);
    } catch (error) {
      console.log(error);
    }
  };

  const sortEventsByDistance = async () => {
    try {
      const userLocation = await getUserLocation();
      const { latitude, longitude } = userLocation;
      const eventsSorted = sortEventsByCloser(latitude, longitude, events);
      setEventsSorted(eventsSorted);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect((effect) => {
    sortEventsByDistance();
  }, []);

  const user = users;
  if (eventsSorted.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <HeaderNavigationEvent />
        </View>
        <View style={styles.center}>
          <Text style={styles.noEvents}>No hay eventos disponibles</Text>
        </View>
        <View style={styles.bottomTab}>
          <CustomBottomTab />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.headerContainer}>
        <HeaderNavigationEvent />
      </View>
      <FlashList
        data={eventsSorted}
        renderItem={({ item, index }) => (
          <EventCard
            event={item}
            user={user}
            onEventPress={handleEventPress}
            index={index}
          />
        )}
        estimatedItemSize={20}
      />
      <View style={styles.bottomTab}>
        <CustomBottomTab />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? 0 : 55,
    width: "100%",
    height: "100%",
    flex: 1,
  },
  headerContainer: {
    height: 30,
  },
  center: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
  },
  noEvents: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EventScroll;
