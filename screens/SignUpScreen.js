import { View, Text, SafeAreaView, StatusBar, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/Auth'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { formAuth } from '../styles/formAuthStyles'
import { clientId, iosClientId, androidClientId } from '@env'

// web : 670475111068-of7eu5va1ug1j2cgjuafb7l6nkm93clf.apps.googleusercontent.com
// ios : 670475111068-a9pcgljjb8c88m2gj1gs5v4u97hph0bk.apps.googleusercontent.com
// android : 670475111068-mj934qhgmn5418a7c2cf152ot6io4ont.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession()

const SignUpScreen = ({ navigation }) => {
  const [accessToken, setAccessToken] = useState(null)
  const [googleUser, setGoogleUser] = useState(null)
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId,
    iosClientId,
    androidClientId
  })
  const [email, setEmail] = useState('')
  //   const [error, setError] = useState('')
  const [password, setPassword] = useState('')

  async function fetchGoogleUserInfo () {
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    const useInfo = await response.json()
    setGoogleUser(useInfo)
  }
  const auth = useAuth()

  async function registerGoogleUser () {
    if (googleUser) {
      await auth.register(googleUser)
    }
  }

  async function registerFormUser () {
    await auth.register({ email, password })
  }

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken)
      accessToken && fetchGoogleUserInfo() && registerGoogleUser()
    }
  }, [response, accessToken])

  return (
    <View style={formAuth.SignUpScreen}>
      <ImageBackground style={formAuth.backgroundImageLogo} source={require('../assets/img/logo.gif')}>
        <SafeAreaView style={formAuth.container}>
          {/* LOGO */}
          <View style={formAuth.logoContainer}>
            <Image source={require('../assets/img/logo.png')} style={formAuth.logo} />
          </View>
          <View style={formAuth.formContainer}>
            <Text style={formAuth.title}>
              Register
            </Text>

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
              style={formAuth.registerButton}
              onPress={registerFormUser}
            >
              <Text style={formAuth.text}>Create Account</Text>
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

            <View>
              <Text style={formAuth.textNormal}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => {
                navigation.navigate('SignIn')
              }}
              >
                <Text style={formAuth.textNormal}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

export default SignUpScreen
