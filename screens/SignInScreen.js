import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ActivityIndicator,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native'

// import * as Google from "expo-auth-session/providers/google";
import { Icon } from 'react-native-elements'
import { formAuth } from '@/styles/formAuthStyles'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { webClientId, iosClientId, androidClientId } from '@env'

import { useAuth } from '@/contexts/Auth'
import colors from '@/styles/colors'
import formStyles from 'styles/formStyles'

export const SignInScreen = ({ navigation }) => {
    const [loading, isLoading] = useState(false)
    const auth = useAuth()
    const [userInfo, setUserInfo] = useState(null)
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId,
        iosClientId,
        webClientId,
        scopes: ['profile', 'email']
    })
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    //   const [error, setError] = useState('')
    const [password, setPassword] = useState('')
    const signIn = async () => {
        isLoading(true)
        // call auth context and pass email and password to signIn function and show what returns
        const response = await auth.signIn({ email, password })
        if (response.error) {
            setError(response.error)
        }
        isLoading(false)
    }

    const getUserInfo = async (token) => {
        if (!token) return
        try {
            const response = await fetch(
                'https://www.googleapis.com/userinfo/v2/me',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            const user = await response.json()
            user.token = token
            await AsyncStorage.setItem('@user', JSON.stringify(user))
            const googleResponse = await auth.signInWithGoogle(user)
            console.log(googleResponse, 'getuserInfo')
            setUserInfo(user)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleSignInWithGoogle () {
        const user = await AsyncStorage.getItem('@user')
        if (!user) {
            console.log("no hay userrrrr")
            if (response?.type === 'success') {
                const { authentication } = response
                await getUserInfo(authentication.accessToken)
            }
        } else {
            setUserInfo(JSON.parse(user))
            await auth.signInWithGoogle(user)
        }
    }

    useEffect(() => {
        handleSignInWithGoogle()
    }, [response]);


    return (
        <SafeAreaView style={formAuth.container}>
            {loading
                ? (
                    <ActivityIndicator color='#000' animating size='small' />
                )
                : (
                    <View style={formAuth.container}>
                        {/* LOGO */}
                        <View style={formAuth.logoContainer}>
                            <Image
                                style={formAuth.logo}
                                source={require('../assets/img/logo.webp')}
                            />
                        </View>

                        <View style={formAuth.formContainer}>
                            <Text style={formAuth.title}>Iniciar sesión</Text>

                            {error !== '' ? <Text className='text-l'>{error}</Text> : false}

                            <TextInput
                                placeholder='Correo electrónico'
                                placeholderTextColor={colors.gray}
                                style={formStyles.input}
                                onChangeText={(text) => { setEmail(text) }}
                                value={email}
                            />
                            <TextInput
                                placeholder='Contraseña'
                                placeholderTextColor={colors.gray}
                                style={formStyles.input}
                                onChangeText={(text) => { setPassword(text) }}
                                value={password}
                                secureTextEntry
                            />
                            {/* /* disable if not email and password */}
                            {/* pass a parameter to get with cypress to touchable opacity */}
                            <TouchableOpacity
                                disabled={email === '' || password === ''}
                                style={formAuth.loginButton}
                                onPress={signIn}
                                testID='login-button'
                            >
                                <Icon name='login' color='white' />
                            </TouchableOpacity>

                            {/* or signup with google */}
                            <Text style={formAuth.textContent}>o</Text>

                            <TouchableOpacity
                                style={formAuth.googleButtonContainer}
                                onPress={() => {
                                    promptAsync()
                                }}
                            >
                                <Image
                                    source={require('../assets/img/google.png')}
                                    style={formAuth.googleLogo}
                                />
                            </TouchableOpacity>

                            <View className='pt-4'>
                                <Text style={formAuth.textNormal}>¿No tienes cuenta? </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('SignUp')
                                    }}
                                >
                                    <Text style={formAuth.textNormal}>Creala aquí</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
        </SafeAreaView>
    )
}
