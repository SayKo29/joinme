import React, { useContext } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/Auth";

const Profile = ({ navigation }) => {
    const auth = useAuth();
    const signOut = () => {
        auth.signOut();
    };
    console.log(auth);
    if (auth.authData.user) {
        return (
            // if has state, show profile

            <SafeAreaView className="h-full w-full">
                <View className="w-full">
                    <Text className="self-center text-4xl text-main">
                        {auth.authData.user.name}
                    </Text>
                    <TouchableOpacity
                        className="self-end my-2 mx-2 bg-secondary rounded-lg px-6 py-2"
                        onPress={signOut}>
                        <Text className=" text-xl w-auto text-white ">
                            Cerrar Sesión
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
    return (
        // if no state, show signin
        <SafeAreaView className="h-full w-full">
            <View className="w-full">
                <TouchableOpacity
                    className="self-end my-2 mx-2 bg-secondary rounded-lg px-6 py-2"
                    onPress={signOut}>
                    <Text className=" text-xl w-auto text-white ">
                        Iniciar Sesión
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Profile;
