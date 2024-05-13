import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import SelectCategory from "@/components/CreateEvent/SelectCategory";
import colors from "@/styles/colors";
import EventInfo from "@/components/CreateEvent/EventInfo";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import AdvancedEventInfo from "@/components/CreateEvent/AdvancedEventInfo";
import CreateEventPost from "@/api/CreateEventPost";
import { useAuth } from "@/contexts/Auth";
import LottieAnimation from "@/components/LottieAnimation";
import CustomBottomTab from "components/ui/CustomBottomTab";
import useHeaderEventStore from "store/HeaderEventStore";
import useTabStore from "store/TabStore";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useQueryClient } from "react-query";
import EditEvent from "api/EditEvent";

const CreateEvent = ({ route }) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [category, setCategory] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [event, setEvent] = React.useState({
    name: "",
    description: "",
    category: "",
    location: "",
    images: {},
    isRemote: false,
    user: "",
    startDate: "",
    endDate: "",
    participants: [],
    chatroom: "",
  });

  useEffect(() => {
    if (route.params?.eventEdit) {
      setEvent(route.params.eventEdit);
      setCategory(route.params.eventEdit.category);
      setIsEditing(true);
    }
  }, [route.params]);

  const auth = useAuth();
  const user = auth?.authData?.user;

  // updateEvent changes the event state with the key and value passed
  const updateEvent = (key, value) => {
    setEvent((oldEvent) => ({
      ...oldEvent,
      [key]: value,
    }));
  };

  const handleEventCreation = async () => {
    await createEvent();
  };

  const editEvent = async () => {
    const eventToSend = {
      ...event,
      category,
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString(),
      user: user._id,
    };

    try {
      await EditEvent(eventToSend);
      // invalidate the query to get the new data
      queryClient.invalidateQueries("events");
      setEvent({
        /* estado inicial del evento */
      });
      useHeaderEventStore.setState({ tab: "MyEvents" });
      useTabStore.setState({ tab: 0 });
      navigation.navigate("MyEvents");
      Toast.show({
        position: "bottom",
        type: "success",
        text1: "Evento editado correctamente",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Error al editar el evento:", error);
      Toast.show({
        type: "error",
        text1: "Error al editar el evento",
        text2: "Por favor, inténtalo de nuevo más tarde",
        visibilityTime: 3000,
      });
    }
  };

  const createEvent = async () => {
    setLoading(true);

    const eventToSend = {
      ...event,
      category,
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString(),
      user: user._id,
    };

    try {
      await CreateEventPost(eventToSend);
      // invalidate the query to get the new data
      queryClient.invalidateQueries("events");
      setEvent({
        /* estado inicial del evento */
      });
      useHeaderEventStore.setState({ tab: "MyEvents" });
      useTabStore.setState({ tab: 0 });
      navigation.navigate("MyEvents");
      Toast.show({
        position: "bottom",
        type: "success",
        text1: "Evento creado correctamente",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Error al crear el evento:", error);
      Toast.show({
        type: "error",
        text1: "Error al crear el evento",
        text2: "Por favor, inténtalo de nuevo más tarde",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const resetEventState = () => {
      setEvent({
        name: "",
        description: "",
        category: "",
        location: "",
        images: {},
        user: "",
        startDate: "",
        endDate: "",
        participants: [],
        chatroom: "",
      });
    };

    const unsubscribe = navigation.addListener("beforeRemove", resetEventState);

    return () => {
      unsubscribe();
      resetEventState(); // Limpia el estado cuando se desmonta el componente
    };
  }, [navigation]);

  return (
    <View style={[styles.container]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {isEditing ? "Editar evento" : "Crear evento"}
        </Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LottieAnimation />
        </View>
      ) : (
        <View style={styles.stepWrapper}>
          <ProgressSteps
            activeStepNumColor={colors.text}
            completedProgressBarColor={colors.primary}
            activeLabelColor={colors.text}
            completedStepIconColor={colors.primary}
            completedCheckColor={colors.primary}
            activeStepIconBorderColor={colors.primary}
            activeStepIconColor={colors.primary}
            disabledStepIconColor={colors.disabled}
            disabledStepNumColor={colors.white}
            progressBarColor={colors.disabled}
            labelFontFamily="SignikaRegular"
          >
            <ProgressStep
              label="Categoría del evento"
              nextBtnStyle={styles.nextBtnStyle}
              nextBtnTextStyle={styles.nextBtnTextStyle}
              nextBtnText="Siguiente"
              nextBtnDisabled={category === ""}
              scrollable={false}
              viewProps={{ style: { flex: 1 } }}
            >
              <SelectCategory
                categorySelected={setCategory}
                activeCategory={category}
              />
            </ProgressStep>
            <ProgressStep
              label="Información básica"
              nextBtnStyle={styles.nextBtnStyle}
              nextBtnTextStyle={styles.nextBtnTextStyle}
              nextBtnText="Siguiente"
              previousBtnStyle={styles.previousBtnStyle}
              previousBtnTextStyle={styles.previousBtnTextStyle}
              previousBtnText="Atrás"
              nextBtnDisabled={event.name === "" || event.description === ""}
            >
              <EventInfo eventInfo={updateEvent} currentEvent={event} />
            </ProgressStep>
            <ProgressStep
              label="Información avanzada"
              nextBtnStyle={styles.nextBtnStyle}
              nextBtnTextStyle={styles.nextBtnTextStyle}
              previousBtnStyle={styles.previousBtnStyle}
              previousBtnTextStyle={styles.previousBtnTextStyle}
              previousBtnText="Atrás"
              finishBtnText={isEditing ? "Guardar Cambios" : "Crear Evento"}
              onSubmit={isEditing ? editEvent : handleEventCreation}
              nextBtnDisabled={
                (event.location === "" && !event.isRemote) ||
                event.startDate === "" ||
                event.endDate === ""
              }
            >
              <AdvancedEventInfo eventInfo={updateEvent} currentEvent={event} />
            </ProgressStep>
          </ProgressSteps>
        </View>
      )}
      <CustomBottomTab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? 0 : 55,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    fontFamily: "SignikaBold",
  },
  stepWrapper: {
    flex: 1,
    paddingHorizontal: 10,
  },
  nextBtnStyle: {
    backgroundColor: colors.accent,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  nextBtnTextStyle: {
    color: "black",
    fontWeight: "bold",
    fontFamily: "SignikaBold",
  },
  previousBtnStyle: {
    backgroundColor: colors.secondary,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  previousBtnTextStyle: {
    color: colors.white,
    fontWeight: "bold",
    fontFamily: "SignikaBold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateEvent;