import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'
import { Text } from 'react-native'
import EventsMap from '../screens/EventsMap'
import Profile from '../screens/Profile'
import Create from '../screens/CreateEvent'
import ChatScreen from '../screens/Chatroom'
import colors from '../styles/colors'

export const BottomTab = () => {
  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // color label
        tabBarLabel: ({ focused }) => {
          return (
            <Text
              style={{
                color: focused ? colors.primary : colors.gray,
                fontSize: 12,
                fontWeight: 'bold'
              }}
            >
              {route.name}
            </Text>
          )
        },

        // change background of tabs
        tabBarStyle: {
          backgroundColor: colors.purple,
          borderTopColor: 'transparent',
          color: '#fff'
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          switch (route.name) {
            case 'Eventos':
              iconName = focused ? 'map' : 'ios-map-outline'
              color = focused ? colors.primary : 'lightgray'
              break
            case 'Chats':
              iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'
              color = focused ? colors.primary : 'lightgray'
              break
            case 'Crear':
              iconName = focused
                ? 'ios-add-circle'
                : 'ios-add-circle-outline'
              color = focused ? colors.primary : 'lightgray'
              break
            case 'Perfil':
              iconName = focused ? 'person' : 'person'
              color = focused ? colors.primary : 'lightgray'
              break
          }

          // You can return any component that you like here!
          return (
            <Icon
              name={iconName}
              type='ionicon'
              size={size}
              color={color}
            />
          )
        }
      })}
    >
      <Tab.Screen
        options={{
          title: 'Map',
          headerShown: false,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}
        name='Eventos'
        component={EventsMap}
      />
      <Tab.Screen
        options={{
          title: 'Chats',
          headerShown: false,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}
        name='Chats'
        component={ChatScreen}
      />
      <Tab.Screen
        options={{
          title: 'Create event',
          headerStyle: {
            backgroundColor: colors.primary
          },
          headerShown: false,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}
        name='Crear'
        component={Create}
      />
      <Tab.Screen
        options={{
          title: 'Perfil',
          headerShown: false,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}
        name='Perfil'
        component={Profile}
      />
    </Tab.Navigator>
  )
}
