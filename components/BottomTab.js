import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { Text } from "react-native";
import EventNavigation from "@/screens/EventNavigation";
import Profile from "@/screens/Profile";
import Create from "@/screens/CreateEvent";
import ChatScreen from "@/screens/Chatroom";
import colors from "@/styles/colors";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

export const BottomTab = () => {
    const Tab = createBottomTabNavigator();
    const transitionValue = useSharedValue(0);

    useFocusEffect(() => {
        transitionValue.value = withTiming(1, { duration: 500 });
        return () => {
            transitionValue.value = withTiming(0, { duration: 250 });
        };
    });

    const tabIconStyle = (focused, color) => {
        return focused ? colors.white : color;
    };

    const tabLabelStyle = (focused) => {
        return {
            color: focused ? colors.white : colors.gray,
            fontSize: 12,
            fontWeight: "bold",
        };
    };

    const tabScreenOptions = ({ route }) => ({
        unmountOnBlur: false,
        tabBarLabel: ({ focused }) => (
            <Text style={tabLabelStyle(focused)}>{route.name}</Text>
        ),
        tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.background,
            color: colors.text,
        },
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
                case "Eventos":
                    iconName = focused ? "map" : "ios-map-outline";
                    break;
                case "Chats":
                    iconName = focused
                        ? "chatbox-ellipses"
                        : "chatbox-ellipses-outline";
                    break;
                case "Crear":
                    iconName = focused
                        ? "ios-add-circle"
                        : "ios-add-circle-outline";
                    break;
                case "Perfil":
                    iconName = "person";
                    break;
            }

            return (
                <Icon
                    name={iconName}
                    type="ionicon"
                    size={size}
                    color={tabIconStyle(focused, color)}
                />
            );
        },
    });

    const tabScreenComponents = [
        {
            name: "Eventos",
            component: EventNavigation,
        },
        {
            name: "Chats",
            component: ChatScreen,
        },
        {
            name: "Crear",
            component: Create,
        },
        {
            name: "Perfil",
            component: Profile,
        },
    ];

    return (
        <Tab.Navigator screenOptions={tabScreenOptions}>
            {tabScreenComponents.map((tabScreenComponent, index) => (
                <Tab.Screen
                    key={index}
                    name={tabScreenComponent.name}
                    component={tabScreenComponent.component}
                    options={{
                        title: tabScreenComponent.name,
                        headerShown: false,
                        headerTintColor: colors.text,
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                    }}
                />
            ))}
        </Tab.Navigator>
    );
};
