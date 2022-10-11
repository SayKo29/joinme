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
    const signIn = async () => {
        isLoading(true);
        await auth.signIn();
    };
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator
                    color={"#000"}
                    animating={true}
                    size="small"
                />
            ) : (
                <SafeAreaView className="h-full justify-center">
                    <View className="p-8">
                        <Text className="self-center text-4xl">Login</Text>

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
                        <View style={styles.link}>
                            <Text style={styles.text}>
                                Dont have an account?{" "}
                            </Text>
                            <TouchableOpacity onPress={() => {}}>
                                <Text style={styles.text}>Sign up Here.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            )}
        </View>
    );
};
