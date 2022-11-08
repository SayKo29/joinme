import React, { useState, useEffect } from 'react'
import {
  ImageBackground,
  ActivityIndicator,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native'

import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { Icon } from 'react-native-elements'
import { formAuth } from '../styles/formAuthStyles'
import { clientId, iosClientId, androidClientId } from '@env'

import { useAuth } from '../contexts/Auth'

WebBrowser.maybeCompleteAuthSession()

export const SignInScreen = ({ navigation }) => {
  const [loading, isLoading] = useState(false)
  const auth = useAuth()
  const [email, setEmail] = useState('')
  //   const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const signIn = async () => {
    isLoading(true)
    await auth.signIn({ email, password })
    isLoading(false)
  }
  const [accessToken, setAccessToken] = useState(null)
  const [googleUser, setGoogleUser] = useState(null)
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId,
    iosClientId,
    androidClientId
  })

  const signInWithGoogle = async () => {
    isLoading(true)
    await auth.signIn(googleUser)
    isLoading(false)
  }

  async function fetchGoogleUserInfo () {
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    const useInfo = await response.json()
    setGoogleUser(useInfo)
  }

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken)
      accessToken && fetchGoogleUserInfo() && signInWithGoogle()
    }
  }, [response, accessToken])

  return (
    <ImageBackground style={formAuth.backgroundImageLogo} source={require('../assets/img/logo.gif')}>
      <View style={formAuth.container}>
        {loading
          ? (
            <ActivityIndicator
              color='#000'
              animating
              size='small'
            />
            )
          : (
            <View style={formAuth.container}>
              {/* LOGO */}
              <View style={formAuth.logoContainer}>
                <Image style={formAuth.logo} source={require('../assets/img/logo.png')} />
              </View>

              <View style={formAuth.formContainer}>
                <Text style={formAuth.title}>
                  Login
                </Text>

                {/* {error !== ''
                  ? (
                    <Text className='text-xl'>{error}</Text>
                    )
                  : (
                      false
                    )} */}

                {/* {state.firstName == '' ? <Text style={tw.style('self-center text-2xl')}></Text> : <Text style={tw.style('self-center text-2xl')}>Login inválido</Text>} */}
                <TextInput
                  placeholder='Email'
                  placeholderTextColor='white'
                  style={formAuth.input}
                  onChangeText={text => setEmail(text)}
                  value={email}
                />
                <TextInput
                  placeholder='Password'
                  placeholderTextColor='white'
                  style={formAuth.input}
                  onChangeText={text => setPassword(text)}
                  value={password}
                  secureTextEntry
                />

                <TouchableOpacity
                  style={formAuth.loginButton}
                  onPress={signIn}
                >
                  <Icon name='login' color='white' />
                </TouchableOpacity>

                {/* or signup with google */}
                <Text style={formAuth.textContent}>
                  or
                </Text>

                <TouchableOpacity
                  style={formAuth.googleButtonContainer}
                  onPress={() => {
                    promptAsync()
                  }}
                >
                  <Image source={require('../assets/img/google.png')} style={formAuth.googleLogo} />
                </TouchableOpacity>

                <View className='pt-4'>
                  <Text style={formAuth.textNormal}>
                    Dont have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    navigation.navigate('SignUp')
                  }}
                  >
                    <Text style={formAuth.textNormal}>Sign up Here.</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
            )}
      </View>
    </ImageBackground>
  )
}
