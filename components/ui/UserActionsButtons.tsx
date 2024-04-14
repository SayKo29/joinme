import {Image, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
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
} from 'react-native-reanimated';
import { Icon } from 'react-native-elements';
import colors from 'styles/colors';

const UserActionsButtons = () => {
  const firstValue = useSharedValue(44);
  const firstWidth = useSharedValue(44);
  const isOpen = useSharedValue(false);
  const opacity = useSharedValue(0);
  const opacityIcon = useSharedValue(0);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0),
  );

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    if (isOpen.value) {
      firstWidth.value = withTiming(44, {duration: 100}, finish => {
        if (finish) {
          firstValue.value = withDelay(44, withTiming(44, config));
        }
      });
      opacity.value = withTiming(0, {duration: 100});
      opacityIcon.value = withTiming(0, {duration: 500});
    } else {
      firstValue.value = withSpring(100);
      firstWidth.value = withDelay(500, withSpring(160));
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

  
const firstIcon = useAnimatedStyle(() => {
    const translateY = interpolate(
        firstValue.value,
        [30, -200],
        [-45, 70],
        Extrapolation.CLAMP,
    );

    return {
        top: firstValue.value,
        transform: [{ translateY: translateY }],
    };
});

    const plusIcon = useAnimatedStyle(() => {
    return {
    transform: [{rotate: `${progress.value * 90}deg`}],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.contentContainer, firstIcon, firstWidthStyle]}>
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
      </Animated.View>
         <Pressable
        style={styles.contentContainer}
        onPress={() => {
          handlePress();
        }}>
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
    position: 'absolute',
    right: 26,
    top: 0,
    borderRadius: 50,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    overflow: 'hidden',

  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SignikaRegular'
  },
});