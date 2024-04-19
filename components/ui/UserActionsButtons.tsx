import { Alert, Pressable, StyleSheet, View } from "react-native";
import React from "react";
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
import { userActionsParameters } from "Constants";

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
  const firstValue = useSharedValue(44);
  const firstWidth = useSharedValue(44);
  const secondValue = useSharedValue(44);
  const secondWidth = useSharedValue(44);
  const isOpen = useSharedValue(false);
  const opacity = useSharedValue(0);
  const opacityIcon = useSharedValue(0);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0)
  );

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    if (isOpen.value) {
      firstWidth.value = withTiming(44, { duration: 100 }, (finish) => {
        if (finish) {
          firstValue.value = withDelay(44, withTiming(44, config));
        }
      });
      secondWidth.value = withTiming(44, { duration: 100 }, (finish) => {
        if (finish) {
          secondValue.value = withDelay(44, withTiming(44, config));
        }
      });
      opacity.value = withTiming(0, { duration: 100 });
      opacityIcon.value = withTiming(0, { duration: 500 });
    } else {
      firstValue.value = withSpring(100);
      firstWidth.value = withDelay(500, withSpring(170));
      secondValue.value = withSpring(100);
      secondWidth.value = withDelay(500, withSpring(175));
      opacity.value = withDelay(800, withSpring(1));
      opacityIcon.value = withDelay(100, withSpring(1));
    }
    isOpen.value = !isOpen.value;
  };

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

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 90}deg` }],
    };
  });

  const handlePressRemoveEvent = () => {
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
          onPress: () => sendPress(userActionsParameters.deleteEvent),
        },
      ],
      { cancelable: false }
    );
  };
  const handlePressExitEvent = () => {
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
          onPress: () => sendPress(userActionsParameters.exitGroup),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {isEventCreator && (
        <Animated.View
          style={[styles.contentContainer, firstIcon, firstWidthStyle]}
        >
          <Pressable
            onPress={() => handlePressRemoveEvent()}
            style={styles.contentContainer}
          >
            <Animated.View style={[styles.iconContainer, opacityIconButton]}>
              <Icon
                name="delete"
                type="antdesign"
                color={"#fff"}
                size={20}
                style={styles.icon}
              />
            </Animated.View>
            <Animated.Text style={[styles.text, opacityText]}>
              Borrar evento
            </Animated.Text>
          </Pressable>
        </Animated.View>
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
                color={"#fff"}
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
        <Animated.View style={[styles.iconContainer, plusIcon]}>
          <Icon
            name="dots-three-vertical"
            type="entypo"
            color={colors.white}
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
    backgroundColor: colors.secondary,
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
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontFamily: "SignikaRegular",
  },
});
