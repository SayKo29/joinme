import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { SignInScreen } from '../screens/SignInScreen'
import  SignUpScreen  from '../screens/SignUpScreen'

const Stack = createStackNavigator()

export const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false, presentation:'card', animation: 'fade'}}
        name='SignIn'
        component={SignInScreen}
        
      />
      <Stack.Screen
        options={{ headerShown: false, presentation:'card', animation: 'fade'}}
        name='SignUp'
        component={SignUpScreen}
        />
    </Stack.Navigator>
  )
}
