import React, { useState } from "react";
import { Icon } from "react-native-elements";
import {
    ActivityIndicator,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { styles } from "./styles";
import { useAuth } from "../contexts/Auth";

export const SignInScreen = () => {
    const [loading, isLoading] = useState(false);
    const auth = useAuth();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const signIn = async () => {
        // if (email || password == "") {
        //     // return new Promise((resolve, reject) => {
        //     //     resolve();
        //     // });
        //     return new Promise((resolve) => {
        //         setError = "Fill all fields";
        //         setTimeout(() => {
        //             resolve("resolved");
        //         }, 1);
        //     });
        // } else {
        isLoading(true);
        await auth.signIn({ email: email, password: password });
        isLoading(false);
        // }
    };

    return (
        <View>
            {loading ? (
                <ActivityIndicator
                    color={"#000"}
                    animating={true}
                    size="small"
                />
            ) : (
                <SafeAreaView className="h-full justify-center w-full">
                    <View className="p-8">
                        <Text className="self-center text-4xl text-main font-extrabold">
                            Login
                        </Text>

                        {error != "" ? (
                            <Text className="text-xl">{error}</Text>
                        ) : (
                            false
                        )}

                        {/* {state.firstName == '' ? <Text style={tw.style('self-center text-2xl')}></Text> : <Text style={tw.style('self-center text-2xl')}>Login inválido</Text>} */}
                        <Input
                            className="text-blue-800 font-semibold"
                            placeholder="Email"
                            onChangeText={setEmail}
                            value={email}
                            leftIcon={
                                <Icon
                                    name="envelope"
                                    type="font-awesome"
                                    size={24}
                                />
                            }
                        />
                        <Input
                            placeholder="Password"
                            onChangeText={setPassword}
                            value={password}
                            leftIcon={
                                <Icon
                                    name="key"
                                    type="font-awesome"
                                    size={24}
                                />
                            }
                            secureTextEntry
                        />
                        <Button title="Login" type="clear" onPress={signIn} />
                        <View>
                            <Text className="text-sm text-stone-500">
                                Dont have an account?{" "}
                            </Text>
                            <TouchableOpacity onPress={() => {}}>
                                <Text className="text-sm">Sign up Here.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            )}
        </View>
    );
};
