import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import Signin from './screens/Signin';
import Discover from './screens/Discover';
import Tab2 from './screens/Tab2';
import Profile from './screens/Profile';
import { Provider as AuthProvider } from './context/AuthContext.js';
import { Context as AuthContext } from './context/AuthContext';
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query'

const AuthStack = createStackNavigator();
function AuthFlow () {
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
function HomeFlow () {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Discover':
                            iconName = focused
                                ? 'map'
                                : 'ios-map-outline';
                            break;
                        case 'Tab2':
                            iconName = focused
                                ? 'ios-add-circle'
                                : 'ios-add-circle-outline';
                            break;
                        case 'Discover':
                            iconName = focused
                                ? 'user'
                                : 'user-o';
                            break;
                    }

                    // You can return any component that you like here!
                    return (
                        <Icon name={iconName} type="ionicon" size={size} color={color} />
                    );
                },
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Discover" component={Discover} />
            <Tab.Screen name="Tab2" component={Tab2} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}

const Stack = createStackNavigator();
function App () {
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
    const queryClient = new QueryClient()

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </AuthProvider>
    );
};