import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { Text } from "react-native";
import EventsMap from "../screens/EventsMap";
import Profile from "../screens/Profile";
import Create from "../screens/Create";

export const BottomTab = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // color label
                tabBarLabel: ({ focused }) => {
                    return (
                        <Text
                            className={[
                                focused ? "text-pink-900" : "text-gray-500",
                            ]}>
                            {route.name}
                        </Text>
                    );
                },

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case "Events":
                            iconName = focused ? "map" : "ios-map-outline";
                            color = focused ? "#561F37" : "lightgray";
                            break;
                        case "Create":
                            iconName = focused
                                ? "ios-add-circle"
                                : "ios-add-circle-outline";
                            color = focused ? "#561F37" : "lightgray";
                            break;
                        case "Profile":
                            iconName = focused ? "person" : "person";
                            color = focused ? "#561F37" : "lightgray";
                            break;
                    }

                    // You can return any component that you like here!
                    return (
                        <Icon
                            name={iconName}
                            type="ionicon"
                            size={size}
                            color={color}
                        />
                    );
                },
            })}>
            <Tab.Screen
                options={{
                    title: "Map",
                    headerStyle: {
                        backgroundColor: "#561F37",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
                name="Events"
                component={EventsMap}
            />
            <Tab.Screen
                options={{
                    title: "Segunda pantalla",
                    headerStyle: {
                        backgroundColor: "#561F37",
                    },
                    headerShown: false,
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
                name="Create"
                component={Create}
            />
            <Tab.Screen
                options={{
                    title: "Perfil",
                    headerStyle: {
                        backgroundColor: "#561F37",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
                name="Profile"
                component={Profile}
            />
        </Tab.Navigator>
    );
};