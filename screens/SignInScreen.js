import React, { useState } from 'react'
import {
    ImageBackground, Platform, StatusBar, TextInput,
  ActivityIndicator,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native'


import { useAuth } from '../contexts/Auth'

export const SignInScreen = ({navigation}) => {
  const [loading, isLoading] = useState(false)
  const auth = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  console.log(StatusBar.currentHeight)
  const [password, setPassword] = useState('')
  const signIn = async () => {
    // console.log("entra", email == "", password == "");
    // if (email || password == "") {
    //     // return new Promise((resolve, reject) => {
    //     //     resolve();
    //     // });
    //     return new Promise((resolve) => {
    //         console.log("hola");
    //         setTimeout(() => {
    //             resolve("resolved");
    //             setError("Fill all fields");
    //         }, 1);
    //     });
    // } else {
    isLoading(true)
    await auth.signIn({ email, password })
    isLoading(false)
    // }
  }

  return (
    <ImageBackground source={ require('../assets/img/logo.gif') }>
    <SafeAreaView className={`w-[100%] h-full ${Platform.OS === 'android' ?  'pt-[' + (StatusBar.currentHeight + 50) + 'px]' : ''}`}>
      {loading ? (
        <ActivityIndicator
          color='#000'
          animating
          size='small'
        />
      ) : (
        <SafeAreaView className={`w-screen h-screen ${Platform.OS === 'android' ?  'pt-[' + (StatusBar.currentHeight + 30) + 'px]' : ''}`}>
            {/* LOGO */}
            <View className='w[100%] h[10%] flex self-center'>
                <Image source={require('../assets/img/logo.png')} className="w-auto h-[auto] object-contain" />
            </View>
          <View className='p-8 w-full h-[calc(100% - 10%)]'>
            <Text className='self-center text-4xl text-white font-extrabold'>
              Login
            </Text>

            {error != ''
              ? (
                <Text className='text-xl'>{error}</Text>
                )
              : (
                  false
                )}

            {/* {state.firstName == '' ? <Text style={tw.style('self-center text-2xl')}></Text> : <Text style={tw.style('self-center text-2xl')}>Login inválido</Text>} */}
            <TextInput
                placeholder='Email'
                placeholderTextColor='white'
                className='w-full h-10 mt-4 p-2 border-solid  border-b border-white bg-opacity-20 rounded-lg text-white text-lg'
                onChangeText={text => setEmail(text)}
                value={email}
            />
            <TextInput
                placeholder='Password'
                placeholderTextColor='white'
                className='w-full h-10 mt-4 p-2 border-solid  border-b border-white bg-opacity-20 rounded-lg text-white'
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry
            />
            
            <TouchableOpacity
                className='mt-4 p-2 border-solid bg-white rounded-lg text-white'
                onPress={signIn}
            >
                <Text className='self-center text-2xl'>Enter</Text>
            </TouchableOpacity>
            
            <View>
              <Text className="text-gray">
                Dont have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => {
                navigation.navigate('SignUp')
              }}>
                <Text className='text-sm'>Sign up Here.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      )}
    </SafeAreaView>
    </ImageBackground>
  )
}
