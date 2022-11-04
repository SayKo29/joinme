import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../contexts/Auth'


const SignUpScreen = ({navigation}) => {
  const auth = useAuth()
  const [loading, isLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')

  const register = async () => {

    isLoading(true)
    await auth.register({ email, password })
    isLoading(false)

  }

  return (
    <ImageBackground source={ require('../assets/img/logo.gif') }>
    <SafeAreaView className="w-full h-full">
            {/* LOGO */}
            <View className='w[100%] h[10%] flex self-center'>
                <Image source={require('../assets/img/logo.png')} className="w-auto h-[auto] object-contain" />
            </View>
          <View className='p-8 w-full h-[calc(100% - 10%)]'>
            <Text className='self-center text-4xl text-white font-extrabold'>
              Register
            </Text>

         
            <TextInput
                placeholder='Email'
                placeholderTextColor='white'
                className='w-full h-10 mt-4 p-2 border-solid  border-b border-white bg-opacity-20 rounded-lg text-white'
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
                onPress={register}
            >
                <Text className='self-center text-2xl'>Create Account</Text>
            </TouchableOpacity>
            
            <View>
              <Text className="text-white">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => {
                navigation.navigate('SignIn')
              }}>
                <Text className='text-sm text-white'>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        </ImageBackground>
  )
}

export default SignUpScreen