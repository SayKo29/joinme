import { Alert, Pressable, StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "react-native-elements";
import colors from "styles/colors";
import { USER_ACTIONS_PARAMETERS } from "Constants";

type params = {
  isEventCreator: boolean;
  userHasJoinedEvent: boolean;
  sendPress: (value: Number) => void;
};

const UserActionsButtons = ({
  isEventCreator,
  userHasJoinedEvent,
  sendPress,
}: params) => {
  const firstValue = useSharedValue(45);
  const firstWidth = useSharedValue(45);
  const secondValue = useSharedValue(45);
  const secondWidth = useSharedValue(45);
  const isOpen = useSharedValue(false);
  const opacity = useSharedValue(0);
  const opacityIcon = useSharedValue(0);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0)
  );

  const opacityText = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  const opacityIconButton = useAnimatedStyle(() => {
    return {
      opacity: opacityIcon.value,
    };
  });

  const firstWidthStyle = useAnimatedStyle(() => {
    return {
      width: firstWidth.value,
    };
  });

  const secondWidthStyle = useAnimatedStyle(() => {
    return {
      width: secondWidth.value,
    };
  });

  const firstIcon = useAnimatedStyle(() => {
    const translateY = interpolate(
      firstValue.value,
      [30, -200],
      [-45, 70],
      Extrapolation.CLAMP
    );

    return {
      top: firstValue.value,
      transform: [{ translateY: translateY }],
    };
  });

  const secondIcon = useAnimatedStyle(() => {
    const translateY = interpolate(
      secondValue.value,
      [30, -200],
      [-45, 70],
      Extrapolation.CLAMP
    );

    return {
      top: secondValue.value,
      transform: [{ translateY: translateY }],
    };
  });

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 90}deg` }],
    };
  });

  const handlePress = useCallback(() => {
    // Tu lógica handlePress existente aquí...
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    if (isOpen.value) {
      firstWidth.value = withTiming(44, { duration: 100 }, (finish) => {
        if (finish) {
          firstValue.value = withDelay(44, withTiming(45, config));
        }
      });
      secondWidth.value = withTiming(44, { duration: 400 }, (finish) => {
        if (finish) {
          secondValue.value = withDelay(84, withTiming(45, config));
        }
      });
      opacity.value = withTiming(0, { duration: 100 });
      opacityIcon.value = withTiming(0, { duration: 500 });
    } else {
      firstValue.value = withSpring(100);
      firstWidth.value = withDelay(500, withSpring(165));
      secondValue.value = withSpring(150);
      secondWidth.value = withDelay(850, withSpring(168));
      opacity.value = withDelay(800, withSpring(1));
      opacityIcon.value = withDelay(100, withSpring(1));
    }
    isOpen.value = !isOpen.value;
  }, []);

  const handlePressRemoveEvent = useCallback(() => {
    Alert.alert(
      "Borrar evento",
      "¿Estás seguro de que quieres borrar el evento?",
      [
        {
          text: "Cancelar",
          onPress: () => handlePress(),
          style: "cancel",
        },
        {
          text: "Borrar",
          onPress: () => sendPress(USER_ACTIONS_PARAMETERS.deleteEvent),
        },
      ],
      { cancelable: false }
    );
  }, [handlePress, sendPress]);

  const handlePressExitEvent = useCallback(() => {
    Alert.alert(
      "Salir del evento",
      "¿Estás seguro de que quieres salir del evento?",
      [
        {
          text: "Cancelar",
          onPress: () => handlePress(),
          style: "cancel",
        },
        {
          text: "Salir",
          onPress: () => sendPress(USER_ACTIONS_PARAMETERS.exitGroup),
        },
      ],
      { cancelable: false }
    );
  }, [handlePress, sendPress]);

  const handlePressEditEvent = useCallback(() => {
    sendPress(USER_ACTIONS_PARAMETERS.editEvent);
  }, [sendPress]);

  return (
    <View style={styles.container}>
      {isEventCreator && (
        <>
          <Animated.View
            style={[
              styles.contentContainer,
              firstIcon,
              firstWidthStyle,
              { backgroundColor: colors.accent },
            ]}
          >
            <Pressable
              onPress={() => handlePressEditEvent()}
              style={styles.contentContainer}
            >
              <Animated.View style={[styles.iconContainer, opacityIconButton]}>
                <Icon
                  name="edit"
                  type="antdesign"
                  color={colors.white}
                  size={20}
                  style={styles.icon}
                />
              </Animated.View>
              <Animated.Text style={[styles.text, opacityText]}>
                Editar evento
              </Animated.Text>
            </Pressable>
          </Animated.View>
          <Animated.View
            style={[
              styles.contentContainer,
              secondIcon,
              secondWidthStyle,
              { backgroundColor: colors.error },
            ]}
          >
            <Pressable
              onPress={() => handlePressRemoveEvent()}
              style={styles.contentContainer}
            >
              <Animated.View style={[styles.iconContainer, opacityIconButton]}>
                <Icon
                  name="delete"
                  type="antdesign"
                  color={colors.white}
                  size={20}
                  style={styles.icon}
                />
              </Animated.View>
              <Animated.Text style={[styles.text, opacityText]}>
                Borrar evento
              </Animated.Text>
            </Pressable>
          </Animated.View>
        </>
      )}
      {userHasJoinedEvent && (
        <Animated.View
          style={[styles.contentContainer, firstIcon, secondWidthStyle]}
        >
          <Pressable
            onPress={() => handlePressExitEvent()}
            style={styles.contentContainer}
          >
            <Animated.View style={[styles.iconContainer, opacityIconButton]}>
              <Icon
                name="exit"
                type="ionicon"
                color={colors.white}
                size={20}
                style={styles.icon}
              />
            </Animated.View>
            <Animated.Text style={[styles.text, opacityText]}>
              Salir del grupo
            </Animated.Text>
          </Pressable>
        </Animated.View>
      )}
      <Pressable
        style={styles.contentContainer}
        disabled={!isEventCreator && !userHasJoinedEvent}
        onPress={() => {
          handlePress();
        }}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            plusIcon,
            { backgroundColor: colors.white },
          ]}
        >
          <Icon
            name="dots-three-vertical"
            type="entypo"
            color={colors.black}
            size={20}
            style={styles.icon}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default UserActionsButtons;

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 460,
  },
  contentContainer: {
    position: "absolute",
    right: 26,
    top: 0,
    borderRadius: 50,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
    overflow: "hidden",
  },
  iconContainer: {
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SignikaBold",
  },
});
