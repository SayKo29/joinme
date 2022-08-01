import React, { useContext } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const Profile = ({ navigation }) => {
    const { state, signout } = useContext(AuthContext);
    console.log(state);

    return (
        <SafeAreaView className="h-full w-full">
            <View className="w-full">
                <Text className="self-center text-4xl text-main">
                    {state.userData.firstName} {state.userData.lastName}
                </Text>
                <TouchableOpacity
                    className="self-end my-2 mx-2 bg-secondary rounded-lg px-6 py-2"
                    onPress={signout}>
                    <Text className=" text-xl w-auto text-white ">
                        Cerrar Sesión
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Profile;
