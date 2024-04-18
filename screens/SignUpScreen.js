import {
    View,
    Text,
    SafeAreaView,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/Auth'
import { formAuth } from '@/styles/formAuthStyles'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { webClientId, iosClientId, androidClientId } from '@env'
import formStyles from 'styles/formStyles'
import { uiStyles } from 'styles/uiStyles'

WebBrowser.maybeCompleteAuthSession()

const SignUpScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState(null)
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId,
        iosClientId,
        webClientId,
        scopes: ['profile', 'email']
    })
    const [googleUser, setGoogleUser] = useState(null)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    //   const [error, setError] = useState('')
    const [password, setPassword] = useState('')

    const auth = useAuth()

    async function handleSignInWithGoogle () {
        const user = await AsyncStorage.getItem('@user')
        if (!user) {
            if (response?.type === 'success') {
                const { authentication } = response
                const userInfo = await getUserInfo(authentication.accessToken)
                // log in the system
                console.log(userInfo, 'userGoogle')
            }
        } else {
            setUserInfo(JSON.parse(user))
        }
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
            await AsyncStorage.setItem('@user', JSON.stringify(user))
            setUserInfo(user)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleSignInWithGoogle()
    }, [response])

    async function registerFormUser () {
        await auth.register({ email, password, name })
    }

    return (
        <SafeAreaView style={formAuth.container}>
            {/* LOGO */}
            <View style={formAuth.logoContainer}>
                <Image
                    source={require('../assets/logo.png')}
                    style={formAuth.logo}
                />
            </View>
            <View style={formAuth.formContainer}>
                <Text style={uiStyles.title}>Registrarse</Text>

                <TextInput
                    placeholder='Nombre'
                    placeholderTextColor='white'
                    style={formStyles.input}
                    onChangeText={(text) => setName(text)}
                    value={name}
                />
                <TextInput
                    placeholder='Correo'
                    placeholderTextColor='white'
                    style={formStyles.input}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                />
                <TextInput
                    placeholder='Contraseña'
                    placeholderTextColor='white'
                    style={formStyles.input}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={formAuth.registerButton}
                    onPress={registerFormUser}
                >
                    <Text style={formAuth.buttonText}>Crear cuenta</Text>
                </TouchableOpacity>

                {/* or signup with google */}
                <Text style={formAuth.textContent}>or</Text>

                <TouchableOpacity
                    style={formAuth.googleButtonContainer}
                    disabled={!request}
                    onPress={() => {
                        promptAsync()
                    }}
                >
                    <Image
                        source={require('../assets/img/google.png')}
                        style={formAuth.googleLogo}
                    />
                </TouchableOpacity>

                <View>
                    <Text style={formAuth.textNormal}>¿Ya tienes cuenta?</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('SignIn')
                        }}
                    >
                        <Text style={formAuth.textNormal}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SignUpScreen
