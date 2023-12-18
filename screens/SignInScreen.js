import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    ActivityIndicator,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
} from "react-native";

// import * as Google from "expo-auth-session/providers/google";
import { Icon } from "react-native-elements";
import { formAuth } from "@/styles/formAuthStyles";
import { clientId, iosClientId, androidClientId } from "@env";

import { useAuth } from "@/contexts/Auth";

export const SignInScreen = ({ navigation }) => {
    const [loading, isLoading] = useState(false);
    const auth = useAuth();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    //   const [error, setError] = useState('')
    const [password, setPassword] = useState("");
    const signIn = async () => {
        isLoading(true);
        // call auth context and pass email and password to signIn function and show what returns
        const response = await auth.signIn({ email, password });
        if (response.error) {
            setError(response.error);
        }
        isLoading(false);
    };
    const [accessToken, setAccessToken] = useState(null);

    return (
        <SafeAreaView style={formAuth.container}>
            {loading ? (
                <ActivityIndicator color="#000" animating size="small" />
            ) : (
                <View style={formAuth.container}>
                    {/* LOGO */}
                    <View style={formAuth.logoContainer}>
                        <Image
                            style={formAuth.logo}
                            source={require("../assets/img/logo.png")}
                        />
                    </View>

                    <View style={formAuth.formContainer}>
                        <Text style={formAuth.title}>Login</Text>

                        {error !== "" ? (
                            <Text className="text-xl">{error}</Text>
                        ) : (
                            false
                        )}

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
                        {/* /* disable if not email and password */}
                        <TouchableOpacity
                            disabled={email === "" || password === ""}
                            style={formAuth.loginButton}
                            onPress={signIn}
                        >
                            <Icon name="login" color="white" />
                        </TouchableOpacity>

                        {/* or signup with google */}
                        <Text style={formAuth.textContent}>or</Text>

                        <TouchableOpacity
                            style={formAuth.googleButtonContainer}
                            onPress={() => {
                                promptAsync();
                            }}
                        >
                            <Image
                                source={require("../assets/img/google.png")}
                                style={formAuth.googleLogo}
                            />
                        </TouchableOpacity>

                        <View className="pt-4">
                            <Text style={formAuth.textNormal}>
                                Dont have an account?{" "}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("SignUp");
                                }}
                            >
                                <Text style={formAuth.textNormal}>
                                    Sign up Here.
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};
