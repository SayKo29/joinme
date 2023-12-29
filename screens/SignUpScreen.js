import {
    View,
    Text,
    SafeAreaView,
    Image,
    TextInput,
    TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/Auth";
import { formAuth } from "@/styles/formAuthStyles";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { webClientId, iosClientId, androidClientId } from "@env";

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: androidClientId,
        iosClientId: iosClientId,
        webClientId: webClientId,
        scopes: ["profile", "email"],
    });
    const [googleUser, setGoogleUser] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    //   const [error, setError] = useState('')
    const [password, setPassword] = useState("");

    const auth = useAuth();

    async function handleSignInWithGoogle() {
        const user = await AsyncStorage.getItem("@user");
        if (!user) {
            if (response?.type === "success") {
                const { authentication } = response;
                await getUserInfo(authentication.accessToken);
            }
        } else {
            setUserInfo(JSON.parse(user));
        }
    }

    const getUserInfo = async (token) => {
        if (!token) return;
        try {
            const response = await fetch(
                `https://www.googleapis.com/userinfo/v2/me`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const user = await response.json();
            await AsyncStorage.setItem("@user", JSON.stringify(user));
            setUserInfo(user);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleSignInWithGoogle();
    }, [response]);

    async function registerFormUser() {
        await auth.register({ email, password, name });
    }

    return (
        <SafeAreaView style={formAuth.container}>
            <Text>{JSON.stringify(userInfo, null, 2)}</Text>
            {/* LOGO */}
            <View style={formAuth.logoContainer}>
                <Image
                    source={require("../assets/img/logo.png")}
                    style={formAuth.logo}
                />
            </View>
            <View style={formAuth.formContainer}>
                <Text style={formAuth.title}>Registrarse</Text>

                <TextInput
                    placeholder="Name"
                    placeholderTextColor="white"
                    style={formAuth.input}
                    onChangeText={(text) => setName(text)}
                    value={name}
                />
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="white"
                    style={formAuth.input}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="white"
                    style={formAuth.input}
                    onChangeText={(text) => setPassword(text)}
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
                <Text style={formAuth.textContent}>or</Text>

                <TouchableOpacity
                    style={formAuth.googleButtonContainer}
                    disabled={!request}
                    onPress={() => {
                        promptAsync();
                    }}
                >
                    <Image
                        source={require("../assets/img/google.png")}
                        style={formAuth.googleLogo}
                    />
                </TouchableOpacity>

                <View>
                    <Text style={formAuth.textNormal}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("SignIn");
                        }}
                    >
                        <Text style={formAuth.textNormal}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SignUpScreen;
