import * as React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import Signin from "./screens/Signin";
import Discover from "./screens/Discover";
import Tab2 from "./screens/Tab2";
import Profile from "./screens/Profile";
import { Provider as AuthProvider } from "./context/AuthContext.js";
import { Context as AuthContext } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
import tw from "twrnc";

const AuthStack = createStackNavigator();
function AuthFlow() {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen
                options={{ headerShown: false }}
                name="Signin"
                component={Signin}
            />
            <AuthStack.Screen
                options={{ headerShown: false }}
                name="Signup"
                component={Signin}
            />
        </AuthStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
function HomeFlow() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // color label
                tabBarLabel: ({ focused }) => {
                    return (
                        <Text
                            style={[
                                focused
                                    ? tw.style("text-pink-900 text-xs")
                                    : tw.style("text-gray-500"),
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
}

const Stack = createStackNavigator();
function App() {
    const { state } = React.useContext(AuthContext);
    console.log(state);
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {state.token === null ? (
                    <>
                        <Stack.Screen
                            options={{ headerShown: false }}
                            name="Auth"
                            component={AuthFlow}
                        />
                    </>
                ) : (
                    <Stack.Screen
                        options={{ headerShown: false }}
                        name="Home"
                        component={HomeFlow}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default () => {
    // Create a client
    const queryClient = new QueryClient();

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </AuthProvider>
    );
};
