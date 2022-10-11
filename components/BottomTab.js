import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Text } from "react-native";
import { Icon } from "react-native-elements";
import React from "react";
import Discover from "../screens/Discover";
import Profile from "../screens/Profile";
import Tab2 from "../screens/Tab2";

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
                        case "Discover":
                            iconName = focused ? "map" : "ios-map-outline";
                            color = focused ? "#561F37" : "lightgray";
                            break;
                        case "Tab2":
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
                name="Discover"
                component={Discover}
            />
            <Tab.Screen
                options={{
                    title: "Segunda pantalla",
                    headerStyle: {
                        backgroundColor: "#561F37",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
                name="Tab2"
                component={Tab2}
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
